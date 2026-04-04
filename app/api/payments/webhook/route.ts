import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, payload } = body

    // Verify webhook signature (in production, verify using Yoco's webhook secret)
    // const signature = request.headers.get("yoco-signature")

    const supabase = await createClient()

    switch (type) {
      case "payment.succeeded": {
        const { metadata, amount } = payload
        const { userId, type: paymentType, credits, tierId, packageId } = metadata

        if (paymentType === "credits" && credits) {
          // Add credits to user's account
          const { data: profile } = await supabase
            .from("profiles")
            .select("credits")
            .eq("id", userId)
            .single()

          const newCredits = (profile?.credits || 0) + parseInt(credits)

          await supabase
            .from("profiles")
            .update({ credits: newCredits })
            .eq("id", userId)

          await supabase.from("credit_transactions").insert({
            user_id: userId,
            amount: parseInt(credits),
            type: "purchase",
            description: `Purchased ${packageId} credit package`,
            reference_id: payload.id,
          })
        } else if (paymentType === "subscription" && tierId) {
          const now = new Date()
          const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

          await supabase
            .from("profiles")
            .update({
              subscription_tier: tierId,
              subscription_expires_at: expiresAt.toISOString(),
            })
            .eq("id", userId)

          await supabase.from("subscriptions").insert({
            user_id: userId,
            tier: tierId,
            status: "active",
            yoco_subscription_id: payload.id,
            current_period_start: now.toISOString(),
            current_period_end: expiresAt.toISOString(),
          })
        }
        break
      }

      case "payment.failed": {
        console.log("Payment failed:", payload)
        break
      }

      case "subscription.cancelled": {
        const { metadata } = payload
        const { userId } = metadata

        await supabase
          .from("profiles")
          .update({
            subscription_tier: "free",
            subscription_expires_at: null,
          })
          .eq("id", userId)

        await supabase
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("user_id", userId)
          .eq("status", "active")
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
