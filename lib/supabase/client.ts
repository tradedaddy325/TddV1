import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

// Neural Engine Data Fetching Functions
// TODO: Implement these Supabase queries once the schema is created

export async function fetchMacroDeskData(userId: string) {
  // const supabase = createClient();
  // const { data, error } = await supabase
  //   .from('macro_desk_data')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .order('created_at', { ascending: false })
  //   .limit(1)
  //   .single();
  // if (error) throw error;
  // return data;
  return null;
}

export async function fetchPsychologyData(userId: string) {
  // const supabase = createClient();
  // const { data, error } = await supabase
  //   .from('psychology_data')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .order('created_at', { ascending: false })
  //   .limit(1)
  //   .single();
  // if (error) throw error;
  // return data;
  return null;
}

export async function fetchAISignals(userId: string) {
  // const supabase = createClient();
  // const { data, error } = await supabase
  //   .from('ai_signals')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .eq('active', true)
  //   .order('confidence', { ascending: false });
  // if (error) throw error;
  // return data;
  return [];
}

export async function fetchNewsSignals(userId: string) {
  // const supabase = createClient();
  // const { data, error } = await supabase
  //   .from('news_signals')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .order('time', { ascending: true });
  // if (error) throw error;
  // return data;
  return [];
}

export async function fetchEarningsSignals(userId: string) {
  // const supabase = createClient();
  // const { data, error } = await supabase
  //   .from('earnings_signals')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .order('report_time', { ascending: true });
  // if (error) throw error;
  // return data;
  return [];
}

export async function fetchTechnicalAnalysis(userId: string) {
  // const supabase = createClient();
  // const { data, error } = await supabase
  //   .from('technical_analysis')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .order('created_at', { ascending: false });
  // if (error) throw error;
  // return data;
  return [];
}

export async function fetchPredictiveMarkets(userId: string) {
  // const supabase = createClient();
  // const { data, error } = await supabase
  //   .from('predictive_markets')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .order('created_at', { ascending: false })
  //   .limit(1)
  //   .single();
  // if (error) throw error;
  // return data;
  return null;
}

export async function checkFeatureAccess(userId: string, featureId: string) {
  // const supabase = createClient();
  // const { data, error } = await supabase
  //   .from('feature_access')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .eq('feature_id', featureId)
  //   .eq('expires_at', `gt.${new Date().toISOString()}`)
  //   .single();
  // if (error && error.code !== 'PGRST116') throw error;
  // return data;
  return null;
}

export async function unlockFeature(userId: string, featureId: string, creditsCost: number) {
  // const supabase = createClient();
  // // TODO: Implement transaction or RPC call to:
  // // 1. Check user's available credits
  // // 2. Deduct credits from user's account
  // // 3. Create feature access record with 30-day expiry
  // // 4. Return success/failure status
  return null;
}
