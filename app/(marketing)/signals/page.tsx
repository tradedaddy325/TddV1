import Link from "next/link"

export default function SignalsPage() {
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
          <h1 className="text-4xl font-bold text-[#FF6600] mb-6">AI TRADING SIGNALS</h1>
          <div className="border-l-2 border-[#FF6600] pl-4 mb-8">
            <p className="text-[#999] text-sm leading-relaxed">
              Claude's Neural Network generates daily trading signals based on market analysis, technical patterns, sentiment analysis, and smart money positioning. Each signal includes entry price, take profit, stop loss, and confidence level.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-6">
              <h3 className="font-bold text-[#FF6600] mb-4">SIGNAL COMPONENTS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#888] mb-2">Entry Price</p>
                  <p className="text-sm text-white">Recommended entry point based on technical analysis</p>
                </div>
                <div>
                  <p className="text-xs text-[#888] mb-2">Take Profit</p>
                  <p className="text-sm text-white">Target price to close position for profit</p>
                </div>
                <div>
                  <p className="text-xs text-[#888] mb-2">Stop Loss</p>
                  <p className="text-sm text-white">Price level to exit and limit losses</p>
                </div>
                <div>
                  <p className="text-xs text-[#888] mb-2">Confidence Level</p>
                  <p className="text-sm text-white">AI confidence in the signal (50%-95%)</p>
                </div>
              </div>
            </div>

            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-6">
              <h3 className="font-bold text-[#FF6600] mb-4">HOW SIGNALS ARE GENERATED</h3>
              <ol className="space-y-3">
                <li className="flex gap-3 text-sm">
                  <span className="text-[#FF6600] font-bold">1.</span>
                  <div>
                    <p className="font-bold text-white">Market Analysis</p>
                    <p className="text-xs text-[#888]">AI analyzes technical patterns, support/resistance levels, trend direction</p>
                  </div>
                </li>
                <li className="flex gap-3 text-sm">
                  <span className="text-[#FF6600] font-bold">2.</span>
                  <div>
                    <p className="font-bold text-white">Sentiment Analysis</p>
                    <p className="text-xs text-[#888]">Fear & Greed Index, retail positioning, smart money bias</p>
                  </div>
                </li>
                <li className="flex gap-3 text-sm">
                  <span className="text-[#FF6600] font-bold">3.</span>
                  <div>
                    <p className="font-bold text-white">Risk Assessment</p>
                    <p className="text-xs text-[#888]">Evaluate risk/reward ratio, market volatility, liquidity</p>
                  </div>
                </li>
                <li className="flex gap-3 text-sm">
                  <span className="text-[#FF6600] font-bold">4.</span>
                  <div>
                    <p className="font-bold text-white">Signal Generation</p>
                    <p className="text-xs text-[#888]">Generate BUY, SELL, or HOLD signals with entry/TP/SL</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="border border-[#FF4444]/20 bg-[#FF4444]/5 p-6">
              <p className="text-xs text-[#FF4444] font-bold mb-2">⚠ IMPORTANT DISCLAIMER</p>
              <p className="text-xs text-[#888] leading-relaxed">
                Trading signals are not guaranteed to be profitable. Past performance does not indicate future results. All trading involves risk of substantial loss. TradeDaddy signals are educational tools only and should not be considered financial advice. Always perform your own research and risk management.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-[#1A1A1A] pt-8">
          <h2 className="text-2xl font-bold text-[#FF6600] mb-6">SIGNAL FREQUENCY</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 text-center">
              <p className="text-xl font-bold text-[#FF6600] mb-2">3-5</p>
              <p className="text-xs text-[#888]">Daily signals across major pairs</p>
            </div>
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 text-center">
              <p className="text-xl font-bold text-[#FF6600] mb-2">24/7</p>
              <p className="text-xs text-[#888]">Signals during all market hours</p>
            </div>
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 text-center">
              <p className="text-xl font-bold text-[#FF6600] mb-2">Real-time</p>
              <p className="text-xs text-[#888]">Instant notifications when signals fire</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
