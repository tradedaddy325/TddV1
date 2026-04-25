import Link from "next/link"

export const metadata = {
  title: "Signals — TradeDaddy Terminal",
  description:
    "Professional trade signals for Forex, Gold and Indices — with entry, stop-loss and take-profit levels. Powered by the TradeDaddy Neural Network.",
}

const sampleSignals = [
  {
    pair: "XAUUSD",
    type: "BUY",
    typeColor: "#00D084",
    entry: "3338.00 – 3342.00",
    sl: "3325.00",
    tp1: "3358.00",
    tp2: "3375.00",
    confidence: 87,
    rationale:
      "Gold holding above key daily demand zone. NY session opening with bullish momentum. DXY weakening on soft CPI data.",
    session: "LONDON / NY",
    status: "ACTIVE",
  },
  {
    pair: "EURUSD",
    type: "BUY",
    typeColor: "#00D084",
    entry: "1.1335 – 1.1345",
    sl: "1.1310",
    tp1: "1.1375",
    tp2: "1.1420",
    confidence: 74,
    rationale:
      "EUR/USD breaking above 4H resistance with volume expansion. ECB rate hold expected. Bullish OB respected on H1.",
    session: "LONDON",
    status: "ACTIVE",
  },
  {
    pair: "NAS100",
    type: "BUY",
    typeColor: "#00D084",
    entry: "19810 – 19850",
    sl: "19720",
    tp1: "19970",
    tp2: "20100",
    confidence: 71,
    rationale:
      "Tech sector recovering from oversold levels. NVDA earnings beat driving broader index higher. Risk-on sentiment.",
    session: "NY",
    status: "ACTIVE",
  },
  {
    pair: "GBPUSD",
    type: "SELL",
    typeColor: "#FF4444",
    entry: "1.3230 – 1.3245",
    sl: "1.3270",
    tp1: "1.3185",
    tp2: "1.3150",
    confidence: 68,
    rationale:
      "Cable rejecting from weekly supply zone. UK GDP miss weighing on pound. Bearish H4 structure intact.",
    session: "LONDON",
    status: "CLOSED TP1",
  },
]

const howItWorks = [
  {
    step: "01",
    title: "NEURAL NETWORK SCAN",
    desc: "The AI analyses price action, multi-timeframe structure, macro data, and session context across 8 instruments every 30 minutes.",
  },
  {
    step: "02",
    title: "SIGNAL GENERATION",
    desc: "When confluence reaches a threshold, a signal is generated with a direction, entry zone, stop-loss, two take-profits, and a confidence score.",
  },
  {
    step: "03",
    title: "HUMAN REVIEW",
    desc: "Each signal is reviewed by a senior analyst before publishing to ensure quality and context alignment. No fully automated signals.",
  },
  {
    step: "04",
    title: "DELIVERY",
    desc: "Signals appear instantly inside your terminal dashboard. Execution and Dominance members also receive push and email notifications.",
  },
  {
    step: "05",
    title: "PERFORMANCE TRACKING",
    desc: "Every signal result is recorded. You can view win rate, avg R:R, and monthly performance in the Signal History section.",
  },
]

export default function SignalsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono">
      <header className="border-b border-[#222] bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3 border-b border-[#1A1A1A]">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#FF6600] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M16 7h6v6" />
                  <path d="m22 7-8.5 8.5-5-5L2 17" />
                </svg>
              </div>
              <span className="text-sm font-bold tracking-[0.2em] text-white">TRADEDADDY</span>
              <span className="text-[10px] text-[#FF6600] border border-[#FF6600]/40 px-1.5 py-0.5 tracking-wider">TERMINAL</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="text-xs text-[#888] hover:text-white px-3 py-1.5 border border-[#333] hover:border-[#555] transition-colors">LOGIN</Link>
              <Link href="/auth/sign-up" className="text-xs bg-[#FF6600] hover:bg-[#FF7722] px-4 py-1.5 text-white transition-colors font-bold tracking-wide">GET ACCESS</Link>
            </div>
          </div>
          <nav className="flex items-center gap-0 text-[11px]">
            <Link href="/features" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-transparent text-[#555] hover:text-[#888]">Features</Link>
            <Link href="/pricing" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-transparent text-[#555] hover:text-[#888]">Pricing</Link>
            <Link href="/signals" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-[#FF6600] text-white">Signals</Link>
            <Link href="/academy" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-transparent text-[#555] hover:text-[#888]">Academy</Link>
            <Link href="/about" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-transparent text-[#555] hover:text-[#888]">About</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[11px] text-[#555] mb-4">
            <span className="text-[#FF6600]">▶</span>
            <span>NEURAL NETWORK SIGNALS</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            HIGH-PROBABILITY<br />
            <span className="text-[#FF6600]">TRADE SIGNALS</span>
          </h1>
          <p className="text-sm text-[#777] max-w-2xl leading-relaxed">
            TradeDaddy signals are generated by our AI Neural Network and reviewed by analysts before
            delivery. Each signal includes a full entry zone, stop-loss, two take-profit levels, and
            a plain-English rationale so you always understand the trade.
          </p>
          <p className="text-[11px] text-[#555] mt-3">
            ⚠ Signals are for educational purposes only and do not constitute financial advice.
            Past performance does not guarantee future results.
          </p>
        </div>

        {/* Sample signals */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] text-[#FF6600] tracking-widest border-l-2 border-[#FF6600] pl-3">SAMPLE SIGNALS</span>
            <span className="text-[10px] text-[#555]">— these are example signals for illustration only</span>
          </div>
          <div className="space-y-3">
            {sampleSignals.map((s) => (
              <div key={`${s.pair}-${s.type}`} className="border border-[#1A1A1A] bg-[#0D0D0D] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{s.pair}</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 tracking-wider border"
                      style={{
                        color: s.typeColor,
                        borderColor: `${s.typeColor}33`,
                        backgroundColor: `${s.typeColor}11`,
                      }}
                    >
                      {s.type}
                    </span>
                    <span className="text-[10px] text-[#555]">{s.session}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-[#FF6600]">{s.confidence}% confidence</span>
                    <span className="text-[10px] text-[#555] border border-[#333] px-2 py-0.5">{s.status}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs">
                  <div>
                    <span className="text-[#555] text-[10px]">ENTRY ZONE</span>
                    <div className="text-white mt-0.5">{s.entry}</div>
                  </div>
                  <div>
                    <span className="text-[#555] text-[10px]">STOP LOSS</span>
                    <div className="text-[#FF4444] mt-0.5">{s.sl}</div>
                  </div>
                  <div>
                    <span className="text-[#555] text-[10px]">TAKE PROFIT 1</span>
                    <div className="text-[#00D084] mt-0.5">{s.tp1}</div>
                  </div>
                  <div>
                    <span className="text-[#555] text-[10px]">TAKE PROFIT 2</span>
                    <div className="text-[#00D084] mt-0.5">{s.tp2}</div>
                  </div>
                </div>
                <p className="text-[11px] text-[#666] leading-relaxed border-t border-[#1A1A1A] pt-2 mt-2">
                  {s.rationale}
                </p>
              </div>
            ))}
          </div>
          <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 mt-4 text-center">
            <p className="text-[11px] text-[#555]">
              🔒 Full live signals available to Execution and Dominance subscribers.{" "}
              <Link href="/auth/sign-up" className="text-[#FF6600] hover:underline">Start your free trial →</Link>
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] text-[#FF6600] tracking-widest border-l-2 border-[#FF6600] pl-3">HOW SIGNALS ARE GENERATED</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0 border border-[#1A1A1A]">
            {howItWorks.map((step, i) => (
              <div key={step.step} className={`p-5 border-r border-[#1A1A1A] last:border-r-0 ${i === 0 ? "" : ""}`}>
                <div className="text-[#FF6600] text-lg font-bold mb-2">{step.step}</div>
                <h4 className="text-[11px] font-bold text-white mb-2 tracking-wide">{step.title}</h4>
                <p className="text-[10px] text-[#555] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border border-[#333] bg-[#0D0D0D] p-6 text-center">
          <p className="text-[11px] text-[#555] leading-relaxed max-w-2xl mx-auto">
            ⚠ All signals provided by TradeDaddy are for educational and informational purposes only.
            They do not constitute financial advice. Trading financial instruments carries significant
            risk of loss. Past signal performance does not guarantee future results. You are solely
            responsible for all trading decisions.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link href="/auth/sign-up" className="bg-[#FF6600] hover:bg-[#FF7722] text-white text-sm font-bold px-8 py-3 tracking-wider transition-colors">
              ACCESS LIVE SIGNALS →
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#1A1A1A] mt-16 py-8 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 text-[11px] justify-center">
            <Link href="/legal/terms" className="text-[#555] hover:text-[#FF6600] transition-colors">Terms of Service</Link>
            <Link href="/legal/privacy" className="text-[#555] hover:text-[#FF6600] transition-colors">Privacy Policy</Link>
            <Link href="/legal/risk" className="text-[#555] hover:text-[#FF6600] transition-colors">Risk Disclosure</Link>
            <Link href="/legal/disclaimer" className="text-[#555] hover:text-[#FF6600] transition-colors">Signal Disclaimer</Link>
          </div>
          <p className="text-center text-[11px] text-[#333] mt-4">© TradeDaddy 2026. All Rights Reserved. Jurisdiction: South Africa</p>
        </div>
      </footer>
    </div>
  )
}
