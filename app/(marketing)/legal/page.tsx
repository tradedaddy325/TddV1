import Link from "next/link"

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono">
      <header className="border-b border-[#222] bg-[#0D0D0D] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF6600] flex items-center justify-center"><span className="text-xs font-bold">TD</span></div>
            <span className="font-bold tracking-[0.15em]">TRADEDADDY</span>
          </Link>
          <Link href="/" className="text-[#FF6600] hover:text-white text-sm">← BACK</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Terms of Service */}
          <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-6">
            <h3 className="font-bold text-[#FF6600] mb-3">TERMS OF SERVICE</h3>
            <p className="text-xs text-[#888] mb-4 leading-relaxed">
              TradeDaddy Terminal is provided as-is. By using our platform, you agree to our terms and conditions. We reserve the right to modify service at any time.
            </p>
            <Link href="#" className="text-xs text-[#FF6600] hover:text-white">Read Full Terms →</Link>
          </div>

          {/* Privacy Policy */}
          <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-6">
            <h3 className="font-bold text-[#FF6600] mb-3">PRIVACY POLICY</h3>
            <p className="text-xs text-[#888] mb-4 leading-relaxed">
              We respect your privacy. Your data is encrypted and never sold. We collect only necessary information to provide our service.
            </p>
            <Link href="#" className="text-xs text-[#FF6600] hover:text-white">Read Full Policy →</Link>
          </div>

          {/* Risk Disclosure */}
          <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-6">
            <h3 className="font-bold text-[#FF6600] mb-3">RISK DISCLOSURE</h3>
            <p className="text-xs text-[#888] mb-4 leading-relaxed">
              Trading involves substantial risk of loss. Past performance ≠ future results. TradeDaddy is not a financial advisor. Always risk only what you can afford to lose.
            </p>
            <Link href="#" className="text-xs text-[#FF6600] hover:text-white">Read Full Disclosure →</Link>
          </div>
        </div>

        <div className="mt-8 border border-[#FF4444]/20 bg-[#FF4444]/5 p-6">
          <p className="text-xs text-[#FF4444] font-bold mb-3">⚠ IMPORTANT DISCLAIMERS</p>
          <ul className="space-y-2">
            {[
              "TradeDaddy is an educational platform and NOT a financial advisory service",
              "We do NOT provide financial advice, investment recommendations, or trading advice",
              "Signals and analysis are educational tools only - not guarantees of profit",
              "Past performance does not indicate future results",
              "Trading forex, crypto, and indices involves substantial risk of loss",
              "You are solely responsible for your trading decisions and risk management",
              "Never risk more than you can afford to lose",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#888]">
                <span className="text-[#FF4444] mt-0.5">▶</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-[#444] mb-4">© TradeDaddy 2026. All Rights Reserved. Jurisdiction: South Africa</p>
          <Link href="/" className="text-[#FF6600] hover:text-white text-sm">← Back to Home</Link>
        </div>
      </main>
    </div>
  )
}
