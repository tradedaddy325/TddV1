import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { token, amountInCents, currency, description, metadata } = await req.json()

    if (!token || !amountInCents) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!metadata?.userId || !metadata?.type) {
      return NextResponse.json(
        { success: false, error: "Missing metadata" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify user is authenticated and matches metadata
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id !== metadata.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Charge via Yoco REST API
    const yocoRes = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: currency || "ZAR",
        description,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
        },
      }),
    })

    const yocoData = await yocoRes.json()

    if (!yocoRes.ok) {
      console.error("[v0] Yoco error:", yocoData)
      return NextResponse.json(
        { success: false, error: yocoData.message || "Payment failed" },
        { status: 400 }
      )
    }

    console.log(`[v0] Payment initiated: ${yocoData.id} for user ${metadata.userId}`)

    // Success! Webhook will handle credit/subscription updates
    // We don't process credits here - wait for webhook confirmation
    return NextResponse.json({
      success: true,
      chargeId: yocoData.id,
      message: "Payment initiated. Your credits/subscription will be updated once payment is confirmed.",
    })
  } catch (error) {
    console.error("[v0] Payment route error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error", details: String(error) },
      { status: 500 }
    )
  }
}
