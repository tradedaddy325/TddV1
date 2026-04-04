import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type")
  const userId = searchParams.get("userId")
  const credits = searchParams.get("credits")
  const packageId = searchParams.get("packageId")
  const tierId = searchParams.get("tierId")

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin

  if (!userId) {
    return NextResponse.redirect(`${baseUrl}/profile?error=invalid_session`)
  }

  try {
    const supabase = await createClient()

    if (type === "credits" && credits) {
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

      // Log the transaction
      await supabase.from("credit_transactions").insert({
        user_id: userId,
        amount: parseInt(credits),
        type: "purchase",
        description: `Purchased ${packageId} credit package`,
        reference_id: `yoco_${Date.now()}`,
      })
    } else if (type === "subscription" && tierId) {
      // Update subscription
      const now = new Date()
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

      await supabase
        .from("profiles")
        .update({
          subscription_tier: tierId,
          subscription_expires_at: expiresAt.toISOString(),
        })
        .eq("id", userId)

      // Log the subscription
      await supabase.from("subscriptions").insert({
        user_id: userId,
        tier: tierId,
        status: "active",
        current_period_start: now.toISOString(),
        current_period_end: expiresAt.toISOString(),
      })
    }

    return NextResponse.redirect(`${baseUrl}/profile?success=true`)
  } catch (error) {
    console.error("Payment success handler error:", error)
    return NextResponse.redirect(`${baseUrl}/profile?error=processing_failed`)
  }
}
