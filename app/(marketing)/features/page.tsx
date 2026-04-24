import Link from "next/link"

export default function FeaturesPage() {
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
          <h1 className="text-4xl font-bold text-[#FF6600] mb-6">PLATFORM FEATURES</h1>
          <div className="border-l-2 border-[#FF6600] pl-4 mb-8">
            <p className="text-[#999] text-sm leading-relaxed">
              TradeDaddy Terminal is a comprehensive all-in-one trading platform designed for serious traders. Access live market data, advanced calculators, AI-powered analysis, and educational resources all in one place.
            </p>
          </div>

          <div className="grid gap-6">
            {[
              {
                title: "LIVE MARKET DATA",
                desc: "Real-time prices for Gold (XAUUSD), Forex pairs (EURUSD, GBPUSD, USDJPY), Indices (NAS100, US500), Crypto (BTCUSD), and Commodities (WTI). Updates every 15-30 seconds during market hours.",
              },
              {
                title: "12+ TRADING CALCULATORS",
                desc: "Comprehensive tools including pip value calculator, lot size calculator, risk/reward ratio, position sizing, margin requirements, and more. All accessible from one terminal.",
              },
              {
                title: "CLAUDE'S NEURAL NETWORK",
                desc: "AI-powered market analysis powered by Claude. Receive daily market psychology insights, trade signals with confidence levels, smart money bias analysis, and retail trap identification.",
              },
              {
                title: "TRADE JOURNAL",
                desc: "Log all your trades, track performance metrics, analyze patterns, review winning and losing trades. Build a personal trading history and improve your edge over time.",
              },
              {
                title: "TRADING ACADEMY",
                desc: "Structured learning paths from beginner to advanced trader. Lessons, quizzes, practical examples, and market psychology education. Learn at your own pace.",
              },
              {
                title: "MACRO HUB",
                desc: "Economic calendar integration, global market news feed, and macroeconomic analysis. Stay informed on events that move markets.",
              },
              {
                title: "SIGNALS SYSTEM",
                desc: "Daily trading signals from AI analysis with entry points, take profit levels, and stop loss levels. For premium members only.",
              },
              {
                title: "MARKET PSYCHOLOGY",
                desc: "Fear & Greed Index, retail positioning data, sentiment analysis, and smart money bias indicators. Understand what other traders are doing.",
              },
            ].map((feature, i) => (
              <div key={i} className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
                <h3 className="font-bold text-[#FF6600] mb-2 tracking-wide">{feature.title}</h3>
                <p className="text-xs text-[#888] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
