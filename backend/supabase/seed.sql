-- ============================================================
-- Synthetic Seed Data for Development
-- Replace USER_ID_HERE with an actual Supabase Auth user UUID
-- Run AFTER schema.sql and rls_policies.sql
-- ============================================================

-- To get your user ID, sign up via the app and check auth.users:
-- SELECT id FROM auth.users LIMIT 1;

-- ============================================================
-- Example: Set the user ID variable
-- ============================================================
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Get the first user from auth (or replace with a specific UUID)
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;

    IF test_user_id IS NULL THEN
        RAISE NOTICE 'No auth user found. Please sign up first, then re-run this script.';
        RETURN;
    END IF;

    -- ============================================================
    -- User Profile
    -- ============================================================
    UPDATE user_profiles SET
        full_name = 'Alex Morgan',
        monthly_income = 7500.00,
        currency = 'USD',
        financial_goals = 'Save for house down payment, build emergency fund, reduce dining out',
        risk_tolerance = 'moderate'
    WHERE user_id = test_user_id;

    -- ============================================================
    -- Budget Goals
    -- ============================================================
    INSERT INTO budget_goals (user_id, category, monthly_limit, priority) VALUES
        (test_user_id, 'Housing', 2000.00, 'high'),
        (test_user_id, 'Food', 600.00, 'high'),
        (test_user_id, 'Transport', 400.00, 'medium'),
        (test_user_id, 'Entertainment', 200.00, 'low'),
        (test_user_id, 'Shopping', 300.00, 'low'),
        (test_user_id, 'Utilities', 250.00, 'high'),
        (test_user_id, 'Health', 150.00, 'high'),
        (test_user_id, 'Other', 200.00, 'low')
    ON CONFLICT (user_id, category) DO NOTHING;

    -- ============================================================
    -- Transactions — May 2026 (realistic monthly spending)
    -- ============================================================
    INSERT INTO transactions (user_id, amount, description, merchant, category, transaction_date) VALUES
        -- Housing
        (test_user_id, 1850.00, 'Monthly rent payment', 'Cityview Apartments', 'Housing', '2026-05-01'),
        (test_user_id, 45.00, 'Renters insurance', 'Lemonade Insurance', 'Housing', '2026-05-01'),

        -- Food - Groceries
        (test_user_id, 87.34, 'Weekly groceries', 'Whole Foods Market', 'Food', '2026-05-02'),
        (test_user_id, 62.18, 'Weekly groceries', 'Trader Joes', 'Food', '2026-05-09'),
        (test_user_id, 94.52, 'Weekly groceries', 'Whole Foods Market', 'Food', '2026-05-16'),
        (test_user_id, 71.89, 'Weekly groceries', 'Costco', 'Food', '2026-05-23'),

        -- Food - Dining out
        (test_user_id, 48.50, 'Dinner with friends', 'Olive Garden', 'Food', '2026-05-03'),
        (test_user_id, 15.99, 'Lunch delivery', 'DoorDash', 'Food', '2026-05-07'),
        (test_user_id, 32.00, 'Coffee and brunch', 'Blue Bottle Coffee', 'Food', '2026-05-10'),
        (test_user_id, 67.80, 'Birthday dinner', 'The Cheesecake Factory', 'Food', '2026-05-14'),
        (test_user_id, 22.50, 'Pizza night', 'Dominos', 'Food', '2026-05-18'),
        (test_user_id, 42.00, 'Sushi dinner', 'Nobu Express', 'Food', '2026-05-22'),
        (test_user_id, 18.75, 'Coffee runs', 'Starbucks', 'Food', '2026-05-25'),

        -- Transport
        (test_user_id, 127.00, 'Monthly metro pass', 'Metro Transit', 'Transport', '2026-05-01'),
        (test_user_id, 45.00, 'Gas fill-up', 'Shell', 'Transport', '2026-05-08'),
        (test_user_id, 38.50, 'Uber rides', 'Uber', 'Transport', '2026-05-12'),
        (test_user_id, 42.00, 'Gas fill-up', 'Chevron', 'Transport', '2026-05-20'),
        (test_user_id, 25.00, 'Parking garage', 'ParkWhiz', 'Transport', '2026-05-24'),

        -- Entertainment
        (test_user_id, 15.99, 'Netflix subscription', 'Netflix', 'Entertainment', '2026-05-01'),
        (test_user_id, 10.99, 'Spotify premium', 'Spotify', 'Entertainment', '2026-05-01'),
        (test_user_id, 65.00, 'Concert tickets', 'Ticketmaster', 'Entertainment', '2026-05-11'),
        (test_user_id, 34.99, 'Video game purchase', 'Steam', 'Entertainment', '2026-05-15'),
        (test_user_id, 28.00, 'Movie tickets x2', 'AMC Theatres', 'Entertainment', '2026-05-21'),

        -- Shopping
        (test_user_id, 89.99, 'New running shoes', 'Nike Store', 'Shopping', '2026-05-05'),
        (test_user_id, 45.00, 'Books', 'Amazon', 'Shopping', '2026-05-13'),
        (test_user_id, 129.99, 'Wireless headphones', 'Best Buy', 'Shopping', '2026-05-19'),
        (test_user_id, 35.00, 'T-shirts', 'Uniqlo', 'Shopping', '2026-05-26'),

        -- Utilities
        (test_user_id, 85.40, 'Electric bill', 'ConEdison', 'Utilities', '2026-05-05'),
        (test_user_id, 65.00, 'Internet service', 'Xfinity', 'Utilities', '2026-05-05'),
        (test_user_id, 45.00, 'Phone plan', 'T-Mobile', 'Utilities', '2026-05-10'),
        (test_user_id, 32.50, 'Water bill', 'City Water Dept', 'Utilities', '2026-05-15'),

        -- Health
        (test_user_id, 50.00, 'Gym membership', 'Planet Fitness', 'Health', '2026-05-01'),
        (test_user_id, 25.00, 'Pharmacy', 'CVS Pharmacy', 'Health', '2026-05-08'),
        (test_user_id, 40.00, 'Doctor copay', 'CityHealth Clinic', 'Health', '2026-05-20'),

        -- Other
        (test_user_id, 25.00, 'Haircut', 'SuperCuts', 'Other', '2026-05-06'),
        (test_user_id, 15.00, 'Dry cleaning', 'Express Cleaners', 'Other', '2026-05-17'),
        (test_user_id, 50.00, 'Birthday gift', 'Target', 'Other', '2026-05-13');

    RAISE NOTICE 'Seed data inserted for user: %', test_user_id;
END $$;
