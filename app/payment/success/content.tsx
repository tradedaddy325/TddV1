// app/payment/success/content.tsx
"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  const type = searchParams?.get("type") || "payment"
  const plan = searchParams?.get("plan") || ""
  const checkoutId = searchParams?.get("checkoutId") || ""

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          router.push("/dashboard")
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [router])

  const isSubscription = type === "subscription"
  const isCredits = type === "credits"

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success icon */}
        <div className="border border-[#00C853]/30 bg-[#0D0D0D] p-8 text-center space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-[#00C853] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#00C853]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-[#00C853] font-mono tracking-widest mb-2">PAYMENT SUCCESSFUL</p>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSubscription && plan ? `${plan} PLAN ACTIVATED` : isCredits ? "CREDITS ADDED" : "PAYMENT COMPLETE"}
            </h1>
            <p className="text-[12px] text-[#666]">
              {isSubscription && "Your premium subscription is now active"}
              {isCredits && "Your trading credits have been added to your account"}
              {!isSubscription && !isCredits && "Your payment has been processed"}
            </p>
          </div>

          <div className="bg-[#111] border border-[#1A1A1A] p-4 text-left space-y-2">
            {checkoutId && (
              <>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#666]">Transaction ID:</span>
                  <span className="text-[#00C853] font-mono">{checkoutId.slice(-8)}</span>
                </div>
              </>
            )}
            {isSubscription && plan && (
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#666]">Plan:</span>
                <span className="text-white font-mono">{plan}</span>
              </div>
            )}
          </div>

          {/* Redirect countdown */}
          <div className="text-[12px] text-[#555]">
            Redirecting to dashboard in <span className="text-[#00C853] font-mono font-bold">{countdown}s</span>...
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-4">
            <Link
              href="/dashboard"
              className="flex-1 px-4 py-2 border border-[#00C853] text-[#00C853] hover:bg-[#00C853]/10 transition-colors text-[11px] font-mono font-bold tracking-widest"
            >
              GO TO DASHBOARD
            </Link>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-[10px] text-[#555] hover:text-[#00C853] transition-colors font-mono">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
