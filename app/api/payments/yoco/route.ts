import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { token, amountInCents, currency, description, metadata } = await req.json()

    if (!token || !amountInCents) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
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
        metadata,
      }),
    })

    const yocoData = await yocoRes.json()

    if (!yocoRes.ok) {
      console.error("Yoco error:", yocoData)
      return NextResponse.json({ success: false, error: yocoData.message || "Payment failed" }, { status: 400 })
    }

    // TODO: Update user subscription/credits in your database (Supabase)
    // Example:
    // if (metadata.type === "subscription") {
    //   await supabase.from("subscriptions").upsert({ user_id, plan: metadata.plan, active: true })
    // } else if (metadata.type === "credits") {
    //   await supabase.rpc("add_credits", { user_id, amount: metadata.credits })
    // }

    return NextResponse.json({ success: true, chargeId: yocoData.id })
  } catch (error) {
    console.error("Payment route error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
