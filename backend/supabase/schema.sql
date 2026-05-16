-- ============================================================
-- Wealth Advisor Database Schema (Real User Data)
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- User Profiles (extends Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT DEFAULT '',
    monthly_income NUMERIC(12,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    financial_goals TEXT DEFAULT '',
    risk_tolerance TEXT DEFAULT 'moderate' CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
    onboarding_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Income Entries (track multiple income sources)
-- ============================================================
CREATE TABLE IF NOT EXISTS income_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    source TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    income_date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT false,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_income_entries_user_date ON income_entries(user_id, income_date);

-- ============================================================
-- Transactions (user-entered expenses)
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    merchant TEXT NOT NULL,
    category TEXT,
    subcategory TEXT,
    is_essential BOOLEAN DEFAULT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);
CREATE INDEX idx_transactions_category ON transactions(user_id, category);

-- ============================================================
-- Budget Goals (user-defined spending limits)
-- ============================================================
CREATE TABLE IF NOT EXISTS budget_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL,
    monthly_limit NUMERIC(12,2) NOT NULL CHECK (monthly_limit > 0),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, category)
);

-- ============================================================
-- Advisory Reports (cached LangGraph outputs)
-- ============================================================
CREATE TABLE IF NOT EXISTS advisory_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    month TEXT NOT NULL,  -- Format: YYYY-MM
    report JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, month)
);

-- ============================================================
-- Chat History
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_history_user ON chat_history(user_id, created_at DESC);

-- ============================================================
-- Auto-create user profile on auth signup
-- Extracts full_name from auth metadata if provided
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_user_profiles_timestamp
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_advisory_reports_timestamp
    BEFORE UPDATE ON advisory_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- Users can only access their own data
-- ============================================================

-- User Profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Income Entries
ALTER TABLE income_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own income" ON income_entries
    FOR ALL USING (auth.uid() = user_id);

-- Transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own transactions" ON transactions
    FOR ALL USING (auth.uid() = user_id);

-- Budget Goals
ALTER TABLE budget_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own budgets" ON budget_goals
    FOR ALL USING (auth.uid() = user_id);

-- Advisory Reports
ALTER TABLE advisory_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own reports" ON advisory_reports
    FOR ALL USING (auth.uid() = user_id);

-- Chat History
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own chats" ON chat_history
    FOR ALL USING (auth.uid() = user_id);
