import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('[v0] Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupLegalTable() {
  try {
    console.log('[v0] Creating legal_acceptances table...')
    
    const { error } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS legal_acceptances (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          accepted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          ip_address INET,
          user_agent TEXT,
          terms_version TEXT DEFAULT 'v1',
          signal_disclaimer_accepted BOOLEAN DEFAULT true,
          risk_disclosure_accepted BOOLEAN DEFAULT true,
          privacy_policy_accepted BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id)
        );
        
        CREATE INDEX IF NOT EXISTS idx_legal_acceptances_user_id ON legal_acceptances(user_id);
        CREATE INDEX IF NOT EXISTS idx_legal_acceptances_created_at ON legal_acceptances(created_at);
        
        ALTER TABLE legal_acceptances ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view their own legal acceptances"
          ON legal_acceptances
          FOR SELECT
          USING (auth.uid() = user_id);
          
        CREATE POLICY "Users can insert their own legal acceptances"
          ON legal_acceptances
          FOR INSERT
          WITH CHECK (auth.uid() = user_id);
      `
    })

    if (error) {
      console.error('[v0] Error creating table:', error)
      process.exit(1)
    }

    console.log('[v0] Legal acceptances table created successfully')
  } catch (err) {
    console.error('[v0] Setup failed:', err)
    process.exit(1)
  }
}

setupLegalTable()
