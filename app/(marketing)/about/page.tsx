import Link from "next/link"

export const metadata = {
  title: "About — TradeDaddy Terminal",
  description:
    "TradeDaddy is a South African professional trading terminal built for retail traders who are serious about their edge.",
}

const values = [
  {
    icon: "🎯",
    title: "TRADER-FIRST",
    desc: "Every feature in the terminal was requested by real traders. We build what traders actually need, not what looks impressive in a demo.",
  },
  {
    icon: "🔒",
    title: "TRANSPARENCY",
    desc: "Signal performance is tracked and published — the good and the bad. We don't cherry-pick. You see every result.",
  },
  {
    icon: "🇿🇦",
    title: "BUILT FOR SA",
    desc: "Prices are displayed in Rands. Payment works via local SA processors. Support runs on SA hours. This is built for you.",
  },
  {
    icon: "⚡",
    title: "SPEED",
    desc: "Live market data refreshes every 15–30 seconds. The terminal is fast. No lag, no spinning loaders when the market is moving.",
  },
]

export default function AboutPage() {
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
            <Link href="/academy" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-transparent text-[#555] hover:text-[#888]">Academy</Link>
            <Link href="/about" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-[#FF6600] text-white">About</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="mb-12 max-w-3xl">
          <div className="flex items-center gap-2 text-[11px] text-[#555] mb-4">
            <span className="text-[#FF6600]">▶</span>
            <span>OUR STORY</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            WE BUILT THE TERMINAL<br />
            <span className="text-[#FF6600]">WE WISHED EXISTED</span>
          </h1>
          <div className="border-l-2 border-[#FF6600] pl-4 space-y-4 text-sm text-[#888] leading-relaxed">
            <p>
              TradeDaddy was started by South African retail traders who were tired of stitching
              together five different tools just to place a single trade — a charting app here,
              a calculator there, a Telegram channel for signals, a YouTube video for education,
              and a spreadsheet for the trade journal.
            </p>
            <p>
              We wanted one place. A proper terminal. Fast live prices, calculators that
              auto-load those prices, AI-powered signals with full context, a journal that
              actually helps you learn from your trades, and education built for the SA market — 
              not generic content written for US or UK traders.
            </p>
            <p>
              TradeDaddy Terminal is that platform. It is not trying to be a broker. It is not
              trying to be TradingView. It is the operating system that runs alongside whatever
              broker and charting app you already use — filling in everything they don't provide.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] text-[#FF6600] tracking-widest border-l-2 border-[#FF6600] pl-3">WHAT WE STAND FOR</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((v) => (
              <div key={v.title} className="border border-[#1A1A1A] bg-[#0D0D0D] p-6">
                <div className="text-2xl mb-3">{v.icon}</div>
                <h3 className="text-sm font-bold text-white mb-2 tracking-wide">{v.title}</h3>
                <p className="text-[11px] text-[#666] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimers */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] text-[#FF6600] tracking-widest border-l-2 border-[#FF6600] pl-3">IMPORTANT INFORMATION</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-[#555]">
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4">
              <span className="text-red-500 mr-2">⚠</span>
              TradeDaddy does not hold a Financial Services Provider (FSP) licence in South Africa.
              We are an educational technology platform. Nothing on this platform constitutes
              licensed financial advice.
            </div>
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4">
              <span className="text-yellow-500 mr-2">⚠</span>
              All signals, AI analysis, and market commentary are for educational and informational
              purposes only. Trading involves substantial risk. You may lose all your invested capital.
            </div>
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4">
              <span className="text-blue-500 mr-2">⚠</span>
              Past signal performance does not guarantee future results. Always conduct your own
              analysis before entering any trade. Never risk more than you can afford to lose.
            </div>
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4">
              <span className="text-cyan-500 mr-2">⚠</span>
              You are solely responsible for all trading decisions made using this platform.
              TradeDaddy and its team accept no liability for trading losses incurred by users.
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-6 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] text-[#FF6600] tracking-widest border-l-2 border-[#FF6600] pl-3">CONTACT</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
            <div>
              <p className="text-[#555] mb-1">SUPPORT</p>
              <p className="text-[#888]">support@tradedaddy.co.za</p>
            </div>
            <div>
              <p className="text-[#555] mb-1">JURISDICTION</p>
              <p className="text-[#888]">South Africa</p>
            </div>
            <div>
              <p className="text-[#555] mb-1">HOURS</p>
              <p className="text-[#888]">Mon–Fri 08:00–18:00 SAST</p>
            </div>
          </div>
        </div>

        {/* Legal links */}
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/legal/terms", label: "Terms of Service" },
            { href: "/legal/privacy", label: "Privacy Policy" },
            { href: "/legal/risk", label: "Risk Disclosure" },
            { href: "/legal/disclaimer", label: "Signal Disclaimer" },
            { href: "/legal/legal", label: "Legal" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border border-[#1A1A1A] hover:border-[#FF6600]/40 bg-[#0D0D0D] px-4 py-2 text-[11px] text-[#555] hover:text-[#FF6600] transition-colors"
            >
              {l.label} →
            </Link>
          ))}
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
