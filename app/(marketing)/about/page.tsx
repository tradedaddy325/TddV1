import Link from "next/link"

export default function AboutPage() {
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

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        <section>
          <h1 className="text-4xl font-bold text-[#FF6600] mb-6">ABOUT TRADEDADDY</h1>
          <div className="border-l-2 border-[#FF6600] pl-4 mb-8">
            <p className="text-[#999] text-sm leading-relaxed">
              TradeDaddy is a professional-grade trading terminal built by traders, for traders. We understand the challenges of modern trading and created a comprehensive platform to solve them.
            </p>
          </div>

          <div className="space-y-8">
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-6">
              <h3 className="font-bold text-[#FF6600] mb-4">OUR MISSION</h3>
              <p className="text-sm text-[#888] leading-relaxed">
                Empower traders with professional-grade tools, real-time market data, AI-powered analysis, and comprehensive education. We believe every trader deserves access to institutional-quality resources without the institutional price tag.
              </p>
            </div>

            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-6">
              <h3 className="font-bold text-[#FF6600] mb-4">WHY TRADEDADDY?</h3>
              <ul className="space-y-3">
                {[
                  "All-in-one platform - No jumping between 5 different apps",
                  "Real-time market data - Live prices updated every 15-30 seconds",
                  "AI-powered analysis - Claude's Neural Network for market insights",
                  "Professional tools - 12+ calculators for every trading scenario",
                  "Educational resources - Complete trading academy included",
                  "Community - Connect with serious traders on the platform",
                  "Affordable - Professional tools at a fraction of institutional costs",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-[#FF6600] mt-0.5">▶</span>
                    <span className="text-[#888]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-6">
              <h3 className="font-bold text-[#FF6600] mb-4">THE TRADEDADDY DIFFERENCE</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-[#FF6600] font-bold mb-2">TRADERS FIRST</p>
                  <p className="text-xs text-[#888]">Built by people who actually trade. Every feature designed for real trading scenarios.</p>
                </div>
                <div>
                  <p className="text-xs text-[#FF6600] font-bold mb-2">DATA DRIVEN</p>
                  <p className="text-xs text-[#888]">Real-time market data, AI analysis, and psychology metrics. Make informed decisions.</p>
                </div>
                <div>
                  <p className="text-xs text-[#FF6600] font-bold mb-2">COMMUNITY FOCUSED</p>
                  <p className="text-xs text-[#888]">Connect with other serious traders, share ideas, and grow together.</p>
                </div>
                <div>
                  <p className="text-xs text-[#FF6600] font-bold mb-2">ALWAYS EVOLVING</p>
                  <p className="text-xs text-[#888]">We constantly improve based on user feedback and market changes.</p>
                </div>
              </div>
            </div>

            <div className="border border-[#FF6600]/20 bg-[#FF6600]/5 p-6">
              <p className="text-xs text-[#FF6600] font-bold mb-2">DISCLAIMER</p>
              <p className="text-xs text-[#888] leading-relaxed">
                TradeDaddy is an educational and analysis platform. We are not a financial advisor, broker, or investment firm. Trading involves substantial risk of loss. Past performance does not guarantee future results. Always consult with a qualified financial advisor before making trading decisions.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-[#1A1A1A] pt-8">
          <h2 className="text-2xl font-bold text-[#FF6600] mb-6">READY TO GET STARTED?</h2>
          <Link href="/auth/sign-up" className="inline-block bg-[#FF6600] hover:bg-[#FF7722] text-white text-sm font-bold px-6 py-3 tracking-wider transition-colors">
            JOIN TRADEDADDY NOW
          </Link>
        </section>
      </main>
    </div>
  )
}
