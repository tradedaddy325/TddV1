-- Create legal_acceptances table to track user acceptance of terms
CREATE TABLE IF NOT EXISTS legal_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  accepted_terms BOOLEAN DEFAULT true,
  accepted_privacy BOOLEAN DEFAULT true,
  accepted_risk_disclosure BOOLEAN DEFAULT true,
  accepted_signals_disclaimer BOOLEAN DEFAULT true,
  accepted_age_confirmation BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE legal_acceptances ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own acceptance
CREATE POLICY "Users can view own legal acceptance"
  ON legal_acceptances FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own acceptance
CREATE POLICY "Users can insert own legal acceptance"
  ON legal_acceptances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Service role can update
CREATE POLICY "Service role can update legal acceptance"
  ON legal_acceptances FOR UPDATE
  USING (auth.role() = 'service_role');

-- Create index for faster lookups
CREATE INDEX idx_legal_acceptances_user_id ON legal_acceptances(user_id);
CREATE INDEX idx_legal_acceptances_created_at ON legal_acceptances(created_at);
