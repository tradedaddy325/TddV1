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
