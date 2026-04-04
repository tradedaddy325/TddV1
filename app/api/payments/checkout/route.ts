import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, packageId, tierId, amount, credits } = body

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin

    // Create Yoco checkout session
    const yocoResponse = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.YOCO_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: amount, // Amount in cents
        currency: "ZAR",
        successUrl: `${baseUrl}/api/payments/success?type=${type}&${type === "credits" ? `credits=${credits}&packageId=${packageId}` : `tierId=${tierId}`}&userId=${user.id}`,
        cancelUrl: `${baseUrl}/profile?cancelled=true`,
        failureUrl: `${baseUrl}/profile?failed=true`,
        metadata: {
          userId: user.id,
          type: type,
          packageId: packageId || null,
          tierId: tierId || null,
          credits: credits || null,
        },
      }),
    })

    if (!yocoResponse.ok) {
      const errorData = await yocoResponse.json()
      console.error("Yoco API error:", errorData)
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      )
    }

    const checkoutData = await yocoResponse.json()

    return NextResponse.json({
      paymentUrl: checkoutData.redirectUrl,
      checkoutId: checkoutData.id,
    })
  } catch (error) {
    console.error("Payment checkout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
