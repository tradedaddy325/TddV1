import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { userId, acceptedAt } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Create or update legal acceptance record
    const { error: insertError } = await supabase
      .from('legal_acceptances')
      .insert([
        {
          user_id: userId,
          accepted_at: acceptedAt || new Date().toISOString(),
          ip_address: ip,
          version: '2.0',
          acceptance_type: 'post_login_full_terms'
        }
      ])

    if (insertError && insertError.code !== 'PGRST116') {
      throw insertError
    }

    return NextResponse.json({
      success: true,
      message: 'Legal acceptance recorded',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Legal acceptance error:', error)
    return NextResponse.json(
      { error: 'Failed to record legal acceptance' },
      { status: 500 }
    )
  }
}
