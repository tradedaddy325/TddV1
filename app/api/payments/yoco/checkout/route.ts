// app/api/payments/yoco/checkout/route.ts
// Creates a Yoco hosted checkout session and returns the redirect URL

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amountInCents, currency = "ZAR", description, metadata, successUrl, cancelUrl } = body

    if (!amountInCents || !description) {
      return NextResponse.json(
        { error: "Missing required fields: amountInCents, description" },
        { status: 400 }
      )
    }

    const secretKey = process.env.YOCO_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json({ error: "Yoco secret key not configured" }, { status: 500 })
    }

    // Build the base URL for success/cancel redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tradedaddy.co.za"
    const finalSuccessUrl = successUrl || `${baseUrl}/payment/success?type=${metadata?.type || "payment"}&plan=${metadata?.plan || ""}`
    const finalCancelUrl = cancelUrl || `${baseUrl}/profile?tab=subscription&cancelled=true`

    // Create Yoco hosted checkout session
    const yocoRes = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
        "Idempotency-Key": `${metadata?.userId || "anon"}-${Date.now()}`,
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency,
        lineItems: [
          {
            displayName: description,
            quantity: 1,
            pricingDetails: {
              price: amountInCents,
            },
          },
        ],
        successUrl: finalSuccessUrl,
        cancelUrl: finalCancelUrl,
        metadata: {
          ...(metadata || {}),
          userId: metadata?.userId || "",
          type: metadata?.type || "payment",
        },
      }),
    })

    const yocoData = await yocoRes.json()

    if (!yocoRes.ok) {
      console.error("Yoco checkout error:", JSON.stringify(yocoData))
      return NextResponse.json(
        { error: yocoData.errorCode || yocoData.message || "Yoco checkout creation failed", details: yocoData },
        { status: yocoRes.status }
      )
    }

    // Save pending payment record to Supabase
    if (metadata?.userId) {
      await supabase.from("payment_intents").insert({
        user_id: metadata.userId,
        yoco_checkout_id: yocoData.id,
        amount_in_cents: amountInCents,
        currency,
        description,
        status: "pending",
        metadata: metadata,
        created_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      checkoutId: yocoData.id,
      redirectUrl: yocoData.redirectUrl,
    })
  } catch (err: any) {
    console.error("Checkout route error:", err)
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}
