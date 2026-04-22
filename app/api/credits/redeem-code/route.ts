import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { code } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid code format' },
        { status: 400 }
      )
    }

    // Use the database RPC function for atomic redemption
    // This handles validation, duplicate prevention, and credit increment in one transaction
    const { data: result, error } = await supabase.rpc('redeem_credit_code', {
      p_code: code.toLowerCase().trim(),
      p_user_id: user.id,
    })

    if (error) {
      console.error('[v0] Credit code redemption error:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to redeem code' },
        { status: 400 }
      )
    }

    if (!result?.success) {
      return NextResponse.json(
        { success: false, error: result?.error || 'Code redemption failed' },
        { status: 400 }
      )
    }

    console.log(`[v0] Code redeemed: ${code} for user ${user.id}, credits: ${result.credits}`)

    // Get updated profile to return new credit balance
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      success: true,
      message: result.message,
      creditsAdded: result.credits,
      totalCredits: profile?.credits || 0,
    })
  } catch (error) {
    console.error('[v0] Redeem code error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
