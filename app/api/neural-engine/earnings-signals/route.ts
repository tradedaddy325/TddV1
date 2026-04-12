import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('earnings_signals')
      .select('*')
      .order('report_time', { ascending: true })
      .limit(10);

    if (error) throw error;
    return Response.json(data || []);
  } catch (error) {
    console.error('Earnings signals fetch error:', error);
    return Response.json([], { status: 500 });
  }
}
