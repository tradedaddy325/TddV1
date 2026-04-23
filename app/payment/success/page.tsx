// app/payment/success/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function PaymentSuccessPage() {
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
            <p className="text-[#444] text-sm font-mono">
              {isSubscription
                ? `Your ${plan} subscription is now active. Credits have been added to your account.`
                : isCredits
                ? "Your credits have been added to your account."
                : "Your payment has been processed successfully."}
            </p>
          </div>

          {checkoutId && (
            <div className="border border-[#1A1A1A] bg-[#111] px-4 py-3">
              <p className="text-[10px] text-[#333] font-mono tracking-wider">REFERENCE</p>
              <p className="text-[11px] text-[#555] font-mono mt-1 break-all">{checkoutId}</p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full bg-[#00C853] hover:bg-[#00B547] text-black text-sm font-bold py-3 tracking-widest font-mono text-center transition-colors"
            >
              GO TO DASHBOARD
            </Link>
            <Link
              href="/profile?tab=subscription"
              className="block w-full border border-[#1A1A1A] hover:border-[#252525] text-[#555] hover:text-[#888] text-sm py-3 tracking-widest font-mono text-center transition-colors"
            >
              VIEW SUBSCRIPTION
            </Link>
          </div>

          <p className="text-[10px] text-[#333] font-mono">
            Redirecting to dashboard in {countdown}s...
          </p>
        </div>
      </div>
    </div>
  )
}
