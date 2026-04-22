import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { amountInCents, currency, description, metadata } = await req.json()

    if (!amountInCents) {
      return NextResponse.json(
        { success: false, error: "Missing amount" },
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

    console.log("[v0] Creating Yoco checkout:", { amountInCents, metadata })

    // Create checkout via Yoco REST API using SECRET key (server-side only)
    const yocoRes = await fetch("https://api.yoco.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
      },
      body: new URLSearchParams({
        amount: String(amountInCents),
        currency: currency || "ZAR",
        description,
        metadata: JSON.stringify(metadata),
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://tradedaddy.co.za"}/profile?payment=success&tab=${
          metadata.type === "subscription" ? "subscription" : "credits"
        }`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://tradedaddy.co.za"}/profile?payment=cancelled&tab=${
          metadata.type === "subscription" ? "subscription" : "credits"
        }`,
      }).toString(),
    })

    const yocoData = await yocoRes.json()
    console.log("[v0] Yoco response:", yocoData)

    if (!yocoRes.ok) {
      console.error("[v0] Yoco error:", yocoData)
      return NextResponse.json(
        { success: false, error: yocoData.message || "Yoco API error" },
        { status: 400 }
      )
    }

    // Return the redirect URL to Yoco's hosted checkout
    return NextResponse.json({
      success: true,
      redirectUrl: yocoData.redirectUrl || `https://checkout.yoco.com/${yocoData.id}`,
      chargeId: yocoData.id,
    })
  } catch (error) {
    console.error("[v0] Payment route error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error", details: String(error) },
      { status: 500 }
    )
  }
}
