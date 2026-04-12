-- Create Macro Desk table
CREATE TABLE IF NOT EXISTS public.macro_desk (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  desk_note TEXT,
  overall_sentiment VARCHAR(20),
  sentiment_score INTEGER,
  metals JSONB,
  macro_events JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Psychology table
CREATE TABLE IF NOT EXISTS public.psychology (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  market_mood VARCHAR(50),
  mood_score INTEGER,
  bullish_assets INTEGER,
  bearish_assets INTEGER,
  neutral_assets INTEGER,
  volatile_assets INTEGER,
  emotions JSONB,
  narrative TEXT,
  sentiment_by_asset_class JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Signals table (AI Signals)
CREATE TABLE IF NOT EXISTS public.signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset VARCHAR(50),
  timeframe VARCHAR(20),
  type VARCHAR(10),
  confidence INTEGER,
  entry VARCHAR(50),
  stop_loss VARCHAR(50),
  take_profit VARCHAR(50),
  reasoning TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create News Signals table
CREATE TABLE IF NOT EXISTS public.news_signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event VARCHAR(100),
  time VARCHAR(20),
  impact VARCHAR(20),
  locked BOOLEAN DEFAULT false,
  unlocks_in INTEGER,
  forecast VARCHAR(100),
  previous VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Earnings Signals table
CREATE TABLE IF NOT EXISTS public.earnings_signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company VARCHAR(100),
  report_time VARCHAR(20),
  locked BOOLEAN DEFAULT false,
  hours_until INTEGER,
  previous_eps DECIMAL(10, 2),
  estimate_eps DECIMAL(10, 2),
  revenue_est VARCHAR(100),
  prediction JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Technical Analysis table
CREATE TABLE IF NOT EXISTS public.technical_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset VARCHAR(50),
  timeframe VARCHAR(20),
  price VARCHAR(50),
  trend VARCHAR(20),
  key_levels JSONB,
  indicators JSONB,
  analysis TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Predictive Markets table
CREATE TABLE IF NOT EXISTS public.predictive_markets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  active_signals INTEGER,
  bullish_signals INTEGER,
  bearish_signals INTEGER,
  markets JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_signals_active ON public.signals(active);
CREATE INDEX IF NOT EXISTS idx_signals_confidence ON public.signals(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_news_signals_time ON public.news_signals(time);
CREATE INDEX IF NOT EXISTS idx_earnings_signals_report_time ON public.earnings_signals(report_time);
CREATE INDEX IF NOT EXISTS idx_technical_analysis_asset ON public.technical_analysis(asset);
