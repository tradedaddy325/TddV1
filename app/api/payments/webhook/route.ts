import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Verify Yoco webhook signature (implementation depends on Yoco's signature method)
async function verifyYocoSignature(request: NextRequest, body: string): Promise<boolean> {
  // TODO: Implement Yoco signature verification
  // For now, just check that it's from a valid source
  const signature = request.headers.get("yoco-signature")
  if (!signature || !process.env.YOCO_WEBHOOK_SECRET) {
    console.warn("[v0] Webhook signature verification skipped - secret not configured")
    return true // In production, this should return false
  }
  
  try {
    // Implement HMAC verification based on Yoco's documentation
    // const crypto = require("crypto")
    // const expectedSig = crypto
    //   .createHmac("sha256", process.env.YOCO_WEBHOOK_SECRET)
    //   .update(body)
    //   .digest("hex")
    // return signature === expectedSig
    return true
  } catch (error) {
    console.error("[v0] Signature verification error:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const payload = JSON.parse(body)
    
    console.log("[v0] Webhook received:", payload.type)

    // Verify webhook authenticity
    if (!await verifyYocoSignature(request, body)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const supabase = await createClient()
    const { type, data } = payload

    switch (type) {
      case "payment.succeeded": {
        const { metadata, id: yocoId, amount } = data
        
        if (!metadata?.userId) {
          console.error("[v0] Missing userId in metadata")
          return NextResponse.json({ error: "Invalid metadata" }, { status: 400 })
        }

        const { userId, type: paymentType, credits, tierId, packageId } = metadata

        // **IDEMPOTENCY CHECK**: Prevent duplicate transaction processing
        const { data: existingTx } = await supabase
          .from("transactions")
          .select("id, status")
          .eq("reference", yocoId)
          .single()

        if (existingTx) {
          console.log("[v0] Transaction already processed:", yocoId)
          // If it was successful, no need to process again
          if (existingTx.status === "success") {
            return NextResponse.json({ received: true, status: "already_processed" })
          }
          // If it failed before, mark it as success now
          await supabase
            .from("transactions")
            .update({ status: "success", yoco_response: data })
            .eq("reference", yocoId)
          return NextResponse.json({ received: true, status: "recovered" })
        }

        // Insert transaction record FIRST (for audit trail)
        const { error: txError } = await supabase
          .from("transactions")
          .insert({
            user_id: userId,
            amount_zar: amount,
            credits: parseInt(credits || "0"),
            status: "pending",
            reference: yocoId,
            yoco_response: data,
          })

        if (txError) {
          console.error("[v0] Transaction insert error:", txError)
          return NextResponse.json({ error: "Database error" }, { status: 500 })
        }

        // Process based on payment type
        if (paymentType === "credits" && credits) {
          // Use RPC function for atomic credit increment
          const { error: creditError } = await supabase
            .rpc("increment_user_credits", {
              p_user_id: userId,
              p_credits: parseInt(credits),
            })

          if (creditError) {
            console.error("[v0] Credit increment error:", creditError)
            // Update transaction as failed
            await supabase
              .from("transactions")
              .update({ status: "failed" })
              .eq("reference", yocoId)
            return NextResponse.json({ error: "Failed to add credits" }, { status: 500 })
          }

          // Log credit purchase transaction
          await supabase.from("credit_transactions").insert({
            user_id: userId,
            amount: parseInt(credits),
            type: "purchase",
            description: `Purchased ${packageId} credit package via Yoco`,
            reference_id: yocoId,
          })

          console.log(`[v0] Credits added: ${credits} to user ${userId}`)
        } else if (paymentType === "subscription" && tierId) {
          const now = new Date()
          const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

          const { error: subError } = await supabase
            .from("profiles")
            .update({
              subscription_tier: tierId,
              subscription_expires_at: expiresAt.toISOString(),
            })
            .eq("id", userId)

          if (subError) {
            console.error("[v0] Subscription update error:", subError)
            await supabase
              .from("transactions")
              .update({ status: "failed" })
              .eq("reference", yocoId)
            return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
          }

          await supabase.from("subscriptions").insert({
            user_id: userId,
            tier: tierId,
            status: "active",
            yoco_subscription_id: yocoId,
            current_period_start: now.toISOString(),
            current_period_end: expiresAt.toISOString(),
          })

          console.log(`[v0] Subscription updated: ${tierId} for user ${userId}`)
        }

        // Mark transaction as success
        await supabase
          .from("transactions")
          .update({ status: "success" })
          .eq("reference", yocoId)

        return NextResponse.json({ received: true, status: "success" })
      }

      case "payment.failed": {
        const { id: yocoId, metadata } = data
        
        // Record failed transaction
        await supabase.from("transactions").upsert(
          {
            reference: yocoId,
            user_id: metadata?.userId,
            status: "failed",
            yoco_response: data,
            amount_zar: data.amount || 0,
            credits: 0,
          },
          { onConflict: "reference" }
        )

        console.warn("[v0] Payment failed:", yocoId)
        return NextResponse.json({ received: true, status: "failed" })
      }

      case "subscription.cancelled": {
        const { metadata } = data
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

        console.log(`[v0] Subscription cancelled for user ${userId}`)
        return NextResponse.json({ received: true, status: "cancelled" })
      }

      default:
        console.warn(`[v0] Unknown webhook type: ${type}`)
        return NextResponse.json({ received: true, status: "unknown_type" })
    }
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed", details: String(error) },
      { status: 500 }
    )
  }
}
