-- Payment System Migration
-- Adds transactions table with idempotency and credit codes system

-- Transactions table for payment tracking
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_zar INTEGER NOT NULL, -- Amount in ZAR cents
  credits INTEGER NOT NULL, -- Credits awarded
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  reference TEXT UNIQUE NOT NULL, -- Yoco transaction ID - prevents duplicates
  yoco_response JSONB, -- Full Yoco response for audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Transactions policies
CREATE POLICY "transactions_select_own" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert_own" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Credit codes table for redemption
CREATE TABLE IF NOT EXISTS credit_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  credits INTEGER NOT NULL CHECK (credits > 0),
  redeemed BOOLEAN DEFAULT FALSE,
  redeemed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB -- For tracking campaign, source, etc.
);

-- Enable RLS for credit codes
ALTER TABLE credit_codes ENABLE ROW LEVEL SECURITY;

-- Credit codes policies
CREATE POLICY "codes_redeem" ON credit_codes FOR UPDATE USING (redeemed = FALSE) 
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "codes_admin_select" ON credit_codes FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create index on reference for fast idempotency checks
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_credit_codes_code ON credit_codes(code);
CREATE INDEX IF NOT EXISTS idx_credit_codes_redeemed ON credit_codes(redeemed);

-- Update profiles table to ensure credits column exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;

-- Add trigger to update transaction timestamp
CREATE OR REPLACE FUNCTION update_transaction_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_transaction_updated_at ON transactions;
CREATE TRIGGER update_transaction_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transaction_timestamp();

-- Helper function for safe credit increment (prevents race conditions)
CREATE OR REPLACE FUNCTION increment_user_credits(p_user_id UUID, p_credits INTEGER)
RETURNS INTEGER AS $$
DECLARE
  v_new_credits INTEGER;
BEGIN
  UPDATE profiles
  SET credits = credits + p_credits
  WHERE id = p_user_id
  RETURNING credits INTO v_new_credits;
  
  RETURN v_new_credits;
END;
$$ LANGUAGE plpgsql;

-- Helper function to validate and redeem credit code
CREATE OR REPLACE FUNCTION redeem_credit_code(p_code TEXT, p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_code_id UUID;
  v_credits INTEGER;
  v_expired BOOLEAN;
  v_result JSONB;
BEGIN
  -- Check if code exists and is not redeemed
  SELECT id, credits, (expires_at < NOW()) 
  INTO v_code_id, v_credits, v_expired
  FROM credit_codes
  WHERE code = LOWER(TRIM(p_code)) AND redeemed = FALSE
  FOR UPDATE; -- Lock the row for this transaction
  
  IF v_code_id IS NULL THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Code not found or already redeemed');
  END IF;
  
  IF v_expired THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Code has expired');
  END IF;
  
  -- Mark code as redeemed
  UPDATE credit_codes
  SET redeemed = TRUE, redeemed_by = p_user_id, redeemed_at = NOW()
  WHERE id = v_code_id;
  
  -- Add credits to user
  PERFORM increment_user_credits(p_user_id, v_credits);
  
  -- Log transaction
  INSERT INTO credit_transactions (user_id, amount, type, description, reference_id)
  VALUES (p_user_id, v_credits, 'bonus', 'Redeemed code: ' || p_code, v_code_id::TEXT);
  
  RETURN jsonb_build_object(
    'success', TRUE, 
    'credits', v_credits, 
    'message', 'Code redeemed successfully'
  );
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION increment_user_credits TO authenticated;
GRANT EXECUTE ON FUNCTION redeem_credit_code TO authenticated;
