import Link from "next/link"

export const metadata = {
  title: "Features — TradeDaddy Terminal",
  description:
    "Explore all the professional trading tools inside the TradeDaddy Terminal — live market data, 12+ calculators, AI signals, trade journal and more.",
}

const modules = [
  {
    icon: "📊",
    tag: "LIVE",
    title: "LIVE MARKET DATA",
    desc: "Real-time streaming prices for Gold (XAUUSD), Forex majors, Crypto, and Indices refreshed every 15–30 seconds via multiple market data providers.",
    points: [
      "XAUUSD, EURUSD, GBPUSD, USDJPY, AUDUSD, USDCAD",
      "NAS100, US500, US30, UK100 indices",
      "BTCUSD, ETHUSD crypto feed",
      "WTI & Brent crude oil",
      "Color-coded % change — live bid/ask",
      "Session overlays: London, NY, Asian",
    ],
  },
  {
    icon: "🧮",
    tag: "TOOLS",
    title: "12+ TRADING CALCULATORS",
    desc: "Every calculation a professional trader needs, all pre-loaded with live prices so you never have to enter data manually.",
    points: [
      "Pip value calculator",
      "Lot size & position sizing",
      "Risk/reward ratio",
      "Stop-loss calculator",
      "Margin calculator",
      "Profit/loss estimator",
      "Break-even price finder",
      "Compounding calculator",
      "Drawdown & recovery",
      "Currency converter (live rates)",
      "Swap & overnight fee estimator",
      "Daily volatility range (ATR-based)",
    ],
  },
  {
    icon: "🤖",
    tag: "AI",
    title: "NEURAL NETWORK (AI SIGNALS)",
    desc: "Claude's Neural Network analyses price action, macro context and technicals across 8 major instruments to surface actionable signals with confidence scores.",
    points: [
      "BUY / HOLD / SELL direction with % confidence",
      "Suggested entry, stop-loss, and take-profit levels",
      "Daily Intelligence Report — macro briefing every morning",
      "Market psychology analysis",
      "Session-specific bias (Asia / London / NY)",
      "Premium members get full signal unlock",
    ],
  },
  {
    icon: "📓",
    tag: "TRACK",
    title: "TRADE JOURNAL",
    desc: "Log every trade, tag your setups, and let the journal surface the patterns in your performance automatically.",
    points: [
      "One-click trade logging from any calculator",
      "Win rate, avg R:R, profit factor stats",
      "Breakdown by pair, session, and setup type",
      "Emotion & mindset tagging",
      "Monthly performance heatmap",
      "Export to CSV / PDF",
    ],
  },
  {
    icon: "🎓",
    tag: "LEARN",
    title: "TRADING ACADEMY",
    desc: "Structured learning paths from absolute beginner to professional trader — lessons written by experienced SA traders.",
    points: [
      "Beginner, Intermediate, Advanced tracks",
      "35+ structured video-style lessons",
      "Quizzes with instant feedback",
      "Forex basics, technical analysis, risk management",
      "SMC & ICT concepts explained",
      "Gold (XAUUSD) specialist module",
    ],
  },
  {
    icon: "🌐",
    tag: "MACRO",
    title: "MACRO HUB",
    desc: "Stay ahead of market-moving events with an integrated economic calendar, curated news feed, and global risk analysis.",
    points: [
      "Live economic calendar (FOMC, NFP, CPI, etc.)",
      "Impact-rated events: High / Medium / Low",
      "Curated forex & macro news feed",
      "Central bank rate tracker",
      "Commodity & energy market snapshot",
      "Geopolitical risk sentiment indicator",
    ],
  },
  {
    icon: "⚡",
    tag: "SIGNALS",
    title: "TRADE SIGNALS",
    desc: "High-probability trade ideas distributed directly inside the platform — complete with entry zones, SL/TP levels, and a rationale.",
    points: [
      "Daily signals across Forex, Gold, and Indices",
      "Entry range, stop-loss, and 2 take-profit levels",
      "Plain-English rationale for each signal",
      "Historical signal performance tracker",
      "Push notifications (browser & email)",
      "Signal history archive",
    ],
  },
  {
    icon: "💳",
    tag: "BILLING",
    title: "CREDITS SYSTEM",
    desc: "Use credits to power AI queries, unlock premium signals, and access advanced tools — credits roll over and never expire within your billing cycle.",
    points: [
      "300 credits (Sniper), 1200 (Execution), 4000 (Dominance)",
      "Each AI analysis query consumes credits",
      "Redeem promo codes for bonus credits",
      "Real-time credit balance in your dashboard",
      "Top-up packs available any time",
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono">
      {/* Header */}
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
            <Link href="/features" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-[#FF6600] text-white">Features</Link>
            <Link href="/pricing" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-transparent text-[#555] hover:text-[#888]">Pricing</Link>
            <Link href="/signals" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-transparent text-[#555] hover:text-[#888]">Signals</Link>
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
            <span>PLATFORM MODULES</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            EVERYTHING YOU NEED<br />
            <span className="text-[#FF6600]">IN ONE TERMINAL</span>
          </h1>
          <p className="text-sm text-[#777] max-w-2xl leading-relaxed">
            TradeDaddy is not a single tool — it is a complete trading operating system. Every module
            is built for South African traders who are serious about their craft and want to stop
            jumping between 5 different platforms.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-0 border border-[#1A1A1A] mb-12">
          {[
            { n: "8+", l: "ASSET CLASSES" },
            { n: "12+", l: "CALCULATORS" },
            { n: "35+", l: "ACADEMY LESSONS" },
            { n: "24/7", l: "LIVE PRICES" },
          ].map((s) => (
            <div key={s.l} className="p-4 text-center border-r border-[#1A1A1A] last:border-r-0">
              <div className="text-2xl font-bold text-[#FF6600]">{s.n}</div>
              <div className="text-[10px] text-[#555] mt-1 tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Module grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((m) => (
            <div key={m.title} className="border border-[#1A1A1A] hover:border-[#FF6600]/30 bg-[#0D0D0D] p-6 transition-all">
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">{m.icon}</span>
                <span className="text-[9px] text-[#FF6600] border border-[#FF6600]/30 px-1.5 py-0.5 tracking-widest">{m.tag}</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2 tracking-wide">{m.title}</h3>
              <p className="text-[11px] text-[#666] leading-relaxed mb-4">{m.desc}</p>
              <ul className="space-y-1.5">
                {m.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[11px]">
                    <span className="text-[#FF6600] text-[10px] mt-0.5">▶</span>
                    <span className="text-[#888]">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 border border-[#FF6600]/30 bg-[#0D0D0D] p-8 text-center">
          <p className="text-xs text-[#555] tracking-widest mb-3">READY TO TRADE SMARTER?</p>
          <h2 className="text-2xl font-bold mb-4">GET FULL ACCESS TODAY</h2>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/sign-up" className="bg-[#FF6600] hover:bg-[#FF7722] text-white text-sm font-bold px-8 py-3 tracking-wider transition-colors">
              START FREE TRIAL →
            </Link>
            <Link href="/pricing" className="border border-[#333] hover:border-[#555] text-[#888] hover:text-white text-sm px-8 py-3 tracking-wider transition-colors">
              VIEW PRICING
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
