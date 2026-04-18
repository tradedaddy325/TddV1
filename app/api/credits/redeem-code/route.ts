import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const VALID_CODES: Record<string, number> = {
  'WELCOME50': 50,
  'TRADEDADDY100': 100,
  'BETA200': 200,
  'REFERRAL500': 500,
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { code } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid code format' },
        { status: 400 }
      )
    }

    const upperCode = code.trim().toUpperCase()

    // Check if code is valid
    const creditsAmount = VALID_CODES[upperCode]
    if (!creditsAmount) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 400 }
      )
    }

    // Check if user has already redeemed this code
    const { data: existingRedemption } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('reference_id', `code:${upperCode}`)
      .single()

    if (existingRedemption) {
      return NextResponse.json(
        { error: 'You have already redeemed this code' },
        { status: 400 }
      )
    }

    // Get current user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    const newCreditsBalance = (profile.credits || 0) + creditsAmount

    // Update user credits
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: newCreditsBalance })
      .eq('id', user.id)

    if (updateError) {
      console.error('[v0] Error updating credits:', updateError)
      return NextResponse.json(
        { error: 'Failed to update credits' },
        { status: 500 }
      )
    }

    // Log the transaction
    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        amount: creditsAmount,
        type: 'bonus',
        description: `Redeemed code: ${upperCode}`,
        reference_id: `code:${upperCode}`,
      })

    if (transactionError) {
      console.error('[v0] Error logging transaction:', transactionError)
    }

    return NextResponse.json({
      success: true,
      creditsAdded: creditsAmount,
      newBalance: newCreditsBalance,
    })
  } catch (error) {
    console.error('[v0] Error in redeem-code API:', error)
    return NextResponse.json(
      { error: 'An error occurred while redeeming the code' },
      { status: 500 }
    )
  }
}
