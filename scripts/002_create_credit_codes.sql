-- Credit Codes and Redemptions
-- Table for managing credit redemption codes

CREATE TABLE IF NOT EXISTS credit_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  credits_amount INTEGER NOT NULL,
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for tracking code redemptions
CREATE TABLE IF NOT EXISTS code_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id UUID NOT NULL REFERENCES credit_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_received INTEGER NOT NULL,
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(code_id, user_id)
);

-- Enable RLS for credit codes
ALTER TABLE credit_codes ENABLE ROW LEVEL SECURITY;

-- Credit codes policies
CREATE POLICY "credit_codes_select_active" ON credit_codes FOR SELECT 
  USING (is_active = true);

CREATE POLICY "credit_codes_admin_insert" ON credit_codes FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "credit_codes_admin_update" ON credit_codes FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "credit_codes_admin_delete" ON credit_codes FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Enable RLS for code redemptions
ALTER TABLE code_redemptions ENABLE ROW LEVEL SECURITY;

-- Code redemptions policies
CREATE POLICY "redemptions_select_own" ON code_redemptions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "redemptions_insert_own" ON code_redemptions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_credit_codes_code ON credit_codes(code);
CREATE INDEX IF NOT EXISTS idx_credit_codes_active ON credit_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON code_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_code_id ON code_redemptions(code_id);
