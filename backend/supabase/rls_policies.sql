-- ============================================================
-- Row Level Security (RLS) Policies
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisory_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- User Profiles: Users can only access their own profile
-- ============================================================
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================================
-- Transactions: Full CRUD on own data only
-- ============================================================
CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
    ON transactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
    ON transactions FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- Budget Goals: Full CRUD on own data only
-- ============================================================
CREATE POLICY "Users can view own budget goals"
    ON budget_goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budget goals"
    ON budget_goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budget goals"
    ON budget_goals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budget goals"
    ON budget_goals FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- Advisory Reports: Read/write own reports
-- ============================================================
CREATE POLICY "Users can view own reports"
    ON advisory_reports FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own reports"
    ON advisory_reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
    ON advisory_reports FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================================
-- Chat History: Users can only access their own chats
-- ============================================================
CREATE POLICY "Users can view own chat history"
    ON chat_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
    ON chat_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);
