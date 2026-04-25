import Link from "next/link"

export const metadata = {
  title: "Trading Academy — TradeDaddy Terminal",
  description:
    "Learn to trade from scratch or level up your skills with the TradeDaddy Trading Academy. Structured lessons from beginner to advanced.",
}

const tracks = [
  {
    level: "BEGINNER",
    color: "#00D084",
    icon: "🌱",
    subtitle: "Zero to First Trade",
    lessons: [
      "What is Forex & how the market works",
      "Understanding pips, lots, and leverage",
      "How to read a candlestick chart",
      "Support & resistance basics",
      "Your first trade: entry, SL, and TP",
      "Broker selection & platform setup",
      "Risk management fundamentals",
      "Common beginner mistakes",
    ],
  },
  {
    level: "INTERMEDIATE",
    color: "#FF6600",
    icon: "⚡",
    subtitle: "Building Your Edge",
    lessons: [
      "Multi-timeframe analysis (MTF)",
      "Trend identification & trading with the trend",
      "Key price patterns: engulfing, pin bars, IFC",
      "Fibonacci retracements & extensions",
      "Moving averages: EMA, SMA strategy",
      "RSI, MACD, and oscillator signals",
      "Position sizing & the 1% rule",
      "Building a trading plan",
      "Trade journaling & reviewing your trades",
      "Session mechanics: London, NY, Asian",
    ],
  },
  {
    level: "ADVANCED",
    color: "#FF6600",
    icon: "🏆",
    subtitle: "Professional Execution",
    lessons: [
      "Smart Money Concepts (SMC) explained",
      "Order blocks, imbalances & FVGs",
      "Market structure breaks & CHoCH",
      "Liquidity grabs and stop hunts",
      "ICT inner circle concepts",
      "Institutional order flow",
      "Trading news events & economic data",
      "Gold (XAUUSD) specialist module",
      "Psychology of professional traders",
      "Building a proprietary trading system",
    ],
  },
  {
    level: "SPECIALIST",
    color: "#888",
    icon: "🥇",
    subtitle: "Gold & Indices Deep Dive",
    lessons: [
      "Why Gold trades the way it does",
      "DXY correlation & inverse relationships",
      "Gold seasonality & central bank buying",
      "NFP, CPI, and FOMC impact on Gold",
      "Key Gold price levels and ranges",
      "NAS100 & US500 structure analysis",
      "Earnings season & index volatility",
      "Sector rotation and index biases",
    ],
  },
]

const stats = [
  { n: "35+", l: "LESSONS" },
  { n: "4", l: "TRACKS" },
  { n: "SA", l: "FOCUSED" },
  { n: "FREE", l: "WITH PLAN" },
]

export default function AcademyPage() {
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
            <Link href="/signals" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-transparent text-[#555] hover:text-[#888]">Signals</Link>
            <Link href="/academy" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-[#FF6600] text-white">Academy</Link>
            <Link href="/about" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-transparent text-[#555] hover:text-[#888]">About</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[11px] text-[#555] mb-4">
            <span className="text-[#FF6600]">▶</span>
            <span>TRADING EDUCATION</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            TRADEDADDY<br />
            <span className="text-[#FF6600]">TRADING ACADEMY</span>
          </h1>
          <p className="text-sm text-[#777] max-w-2xl leading-relaxed">
            Structured trading education built for South African retail traders. Whether you are
            completely new to the markets or looking to sharpen your edge with advanced concepts like
            SMC and ICT, the Academy has a track for you — all included inside the TradeDaddy Terminal.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-0 border border-[#1A1A1A] mb-12">
          {stats.map((s) => (
            <div key={s.l} className="p-4 text-center border-r border-[#1A1A1A] last:border-r-0">
              <div className="text-2xl font-bold text-[#FF6600]">{s.n}</div>
              <div className="text-[10px] text-[#555] mt-1 tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tracks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {tracks.map((track) => (
            <div key={track.level} className="border border-[#1A1A1A] hover:border-[#FF6600]/30 bg-[#0D0D0D] p-6 transition-all">
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">{track.icon}</span>
                <span
                  className="text-[9px] font-bold px-2 py-0.5 tracking-widest border"
                  style={{ color: track.color, borderColor: `${track.color}44` }}
                >
                  {track.level}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1 tracking-wide">{track.level} TRACK</h3>
              <p className="text-[11px] text-[#555] mb-4">{track.subtitle}</p>
              <ul className="space-y-1.5">
                {track.lessons.map((l) => (
                  <li key={l} className="flex items-start gap-2 text-[11px]">
                    <span className="text-[#FF6600] text-[10px] mt-0.5">▶</span>
                    <span className="text-[#888]">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="border border-[#FF6600]/30 bg-[#0D0D0D] p-8 text-center">
          <p className="text-xs text-[#555] tracking-widest mb-2">INCLUDED IN ALL PLANS</p>
          <h2 className="text-2xl font-bold mb-3">START LEARNING TODAY</h2>
          <p className="text-[11px] text-[#666] mb-6 max-w-md mx-auto">
            The Academy is built into the terminal — no separate app, no extra cost.
            Access your track the moment your account is active.
          </p>
          <Link href="/auth/sign-up" className="bg-[#FF6600] hover:bg-[#FF7722] text-white text-sm font-bold px-8 py-3 tracking-wider transition-colors">
            START FREE TRIAL →
          </Link>
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
