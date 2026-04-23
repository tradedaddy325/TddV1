// app/payment/success/page.tsx
import { Suspense } from "react"
import PaymentSuccessContent from "./content"

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><div className="text-[#00C853] font-mono">Loading...</div></div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
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
