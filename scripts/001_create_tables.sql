-- TRADEDADDY Database Schema
-- Run this migration to set up all required tables

-- Users profile extending auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 100,
  subscription_tier TEXT DEFAULT 'free', -- free, basic, pro, elite
  subscription_expires_at TIMESTAMPTZ,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE USING (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "profiles_admin_select" ON profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Trade Journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pair TEXT NOT NULL, -- XAUUSD, EURUSD, BTCUSD, etc.
  direction TEXT NOT NULL, -- buy, sell
  entry_price DECIMAL NOT NULL,
  exit_price DECIMAL,
  lot_size DECIMAL NOT NULL,
  stop_loss DECIMAL,
  take_profit DECIMAL,
  pnl DECIMAL,
  pnl_percent DECIMAL,
  notes TEXT,
  screenshot_url TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'open', -- open, closed, cancelled
  entry_date TIMESTAMPTZ DEFAULT NOW(),
  exit_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for journal entries
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Journal entries policies
CREATE POLICY "journal_select_own" ON journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "journal_insert_own" ON journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "journal_update_own" ON journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "journal_delete_own" ON journal_entries FOR DELETE USING (auth.uid() = user_id);

-- Credit transactions
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- purchase, spend, bonus, refund
  description TEXT,
  reference_id TEXT, -- Yoco transaction ID or feature used
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for credit transactions
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Credit transactions policies
CREATE POLICY "credits_select_own" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "credits_insert_own" ON credit_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,
  status TEXT DEFAULT 'active', -- active, cancelled, expired
  yoco_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "subscriptions_select_own" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_insert_own" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_update_own" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Academy progress
CREATE TABLE IF NOT EXISTS academy_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS for academy progress
ALTER TABLE academy_progress ENABLE ROW LEVEL SECURITY;

-- Academy progress policies
CREATE POLICY "academy_select_own" ON academy_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "academy_insert_own" ON academy_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "academy_update_own" ON academy_progress FOR UPDATE USING (auth.uid() = user_id);

-- Watchlists
CREATE TABLE IF NOT EXISTS watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  symbols TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for watchlists
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

-- Watchlists policies
CREATE POLICY "watchlists_select_own" ON watchlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "watchlists_insert_own" ON watchlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "watchlists_update_own" ON watchlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "watchlists_delete_own" ON watchlists FOR DELETE USING (auth.uid() = user_id);

-- Price alerts
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  condition TEXT NOT NULL, -- above, below, crosses
  target_price DECIMAL NOT NULL,
  triggered BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for price alerts
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Price alerts policies
CREATE POLICY "alerts_select_own" ON price_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "alerts_insert_own" ON price_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "alerts_update_own" ON price_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "alerts_delete_own" ON price_alerts FOR DELETE USING (auth.uid() = user_id);

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)),
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)), ' ', '_')) || '_' || SUBSTRING(NEW.id::text, 1, 8)
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_journal_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_status ON journal_entries(status);
CREATE INDEX IF NOT EXISTS idx_journal_entry_date ON journal_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_credits_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_user_id ON academy_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_symbol ON price_alerts(symbol);
