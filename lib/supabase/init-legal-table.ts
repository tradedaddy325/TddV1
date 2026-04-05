import { createClient } from '@/lib/supabase/server'

export async function ensureLegalAcceptancesTableExists() {
  const supabase = await createClient()

  try {
    // Try to select from the table to see if it exists
    const { error: selectError } = await supabase
      .from('legal_acceptances')
      .select('count')
      .limit(1)

    if (selectError?.code === 'PGRST116' || selectError?.message.includes('does not exist')) {
      // Table doesn't exist, create it
      const { error: createError } = await supabase.rpc('run_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.legal_acceptances (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            ip_address TEXT,
            version TEXT DEFAULT '2.0',
            acceptance_type TEXT DEFAULT 'post_login_full_terms',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, version)
          );

          ALTER TABLE public.legal_acceptances ENABLE ROW LEVEL SECURITY;

          CREATE POLICY "Users can view their own legal acceptances" ON public.legal_acceptances
            FOR SELECT USING (auth.uid() = user_id);

          CREATE POLICY "Users can insert their own legal acceptances" ON public.legal_acceptances
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        `
      })

      if (createError) {
        console.error('Failed to create legal_acceptances table:', createError)
      }
    }
  } catch (error) {
    console.error('Error ensuring table exists:', error)
  }
}
