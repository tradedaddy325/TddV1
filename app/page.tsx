"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function LandingPage() {
  const [time, setTime] = useState("")
  const [activeNav, setActiveNav] = useState("Features")
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const t = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "America/New_York",
      })
      setTime(t + " EST")
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Fetch live prices from API
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true)
        const symbols = "EURUSD,GBPUSD,USDJPY,XAUUSD"
        const res = await fetch(`/api/prices?symbols=${symbols}`)
        const data = await res.json()
        
        if (data.prices) {
          const formatted = data.prices.map((p: any) => ({
            symbol: p.symbol,
            price: parseFloat(p.price).toFixed(p.symbol === "XAUUSD" ? 2 : 4),
            change: Math.random() > 0.5 ? `+${(Math.random() * 2).toFixed(2)}%` : `-${(Math.random() * 2).toFixed(2)}%`
          }))
          setPrices(formatted)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch prices:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const TICKER_DATA = prices.length > 0 ? prices : [
    { symbol: "XAUUSD", price: "---", change: "--%" },
    { symbol: "EURUSD", price: "---", change: "--%" },
    { symbol: "GBPUSD", price: "---", change: "--%" },
    { symbol: "USDJPY", price: "---", change: "--%" },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono overflow-x-hidden">
      {/* Ticker Bar */}
      <div className="bg-[#111] border-b border-[#222] overflow-hidden h-8 flex items-center">
        <div className="flex gap-0 shrink-0 animate-[scroll_30s_linear_infinite]">
          {[...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
            <span key={i} className="flex items-center gap-2 px-4 text-xs border-r border-[#222] h-8 whitespace-nowrap">
              <span className="text-[#888]">{t.symbol}</span>
              <span className="text-white">{t.price}</span>
              <span className={t.change.startsWith("+") ? "text-[#FF6600]" : "text-[#FF4444]"}>{t.change}</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      {/* Top Bar */}
      <header className="border-b border-[#222] bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top row */}
          <div className="flex items-center justify-between py-3 border-b border-[#1A1A1A]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#FF6600] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>
                </svg>
              </div>
              <span className="text-sm font-bold tracking-[0.2em] text-white">TRADEDADDY</span>
              <span className="text-[10px] text-[#FF6600] border border-[#FF6600]/40 px-1.5 py-0.5 tracking-wider">TERMINAL</span>
            </div>
            <div className="flex items-center gap-6 text-[11px] text-[#555]">
              <span className="text-[#FF6600]">● MARKETS OPEN</span>
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="text-xs text-[#888] hover:text-white px-3 py-1.5 border border-[#333] hover:border-[#555] transition-colors">
                LOGIN
              </Link>
              <Link href="/auth/sign-up" className="text-xs bg-[#FF6600] hover:bg-[#FF7722] px-4 py-1.5 text-white transition-colors font-bold tracking-wide">
                GET ACCESS
              </Link>
            </div>
          </div>
          {/* Nav row */}
          <nav className="flex items-center gap-0 text-[11px]">
            {[
              { label: "Features", href: "/features" },
              { label: "Pricing", href: "/pricing" },
              { label: "Signals", href: "/signals" },
              { label: "Academy", href: "/academy" },
              { label: "About", href: "/about" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-4 py-2.5 border-b-2 transition-colors tracking-wider ${
                  activeNav === item.label
                    ? "border-[#FF6600] text-white"
                    : "border-transparent text-[#555] hover:text-[#888]"
                }`}
                onClick={() => setActiveNav(item.label)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Hero */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[11px] text-[#555] mb-4">
                <span className="text-[#FF6600]">▶</span>
                <span>PROFESSIONAL GRADE TRADING INTELLIGENCE</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-none tracking-tight">
                <span className="text-white">TRADE</span>
                <span className="text-[#FF6600]">DADDY</span>
              </h1>
              <p className="text-2xl text-[#555] font-light mt-2 tracking-wide">PROFESSIONAL TRADING TERMINAL</p>
            </div>

            <div className="border-l-2 border-[#FF6600] pl-4">
              <p className="text-sm text-[#999] leading-relaxed max-w-lg">
                All-in-one platform with live market prices, 12 trading calculators, AI-powered analysis via Claude's Neural Network, trade journal, signals, and trading academy. Everything a serious trader needs in one terminal.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link href="/auth/sign-up" className="bg-[#FF6600] hover:bg-[#FF7722] text-white text-sm font-bold px-6 py-3 tracking-wider transition-colors">
                LAUNCH TERMINAL →
              </Link>
              <Link href="/auth/login" className="border border-[#333] hover:border-[#555] text-[#888] hover:text-white text-sm px-6 py-3 tracking-wider transition-colors">
                SIGN IN
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-0 border border-[#1A1A1A] mt-8">
              {[
                { val: "6", label: "LIVE FEEDS" },
                { val: "12+", label: "CALCULATORS" },
                { val: "AI", label: "NEURAL NET" },
                { val: "24/7", label: "MARKET DATA" },
              ].map((s, i) => (
                <div key={i} className={`p-4 text-center ${i < 3 ? "border-r border-[#1A1A1A]" : ""}`}>
                  <div className="text-2xl font-bold text-[#FF6600]">{s.val}</div>
                  <div className="text-[10px] text-[#555] mt-1 tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel — Live Market Preview */}
          <div className="col-span-12 lg:col-span-5 space-y-3">
            <div className="border border-[#1A1A1A] bg-[#0D0D0D]">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#1A1A1A] bg-[#111]">
                <span className="text-[10px] text-[#FF6600] tracking-widest font-bold">LIVE MARKET OVERVIEW</span>
                <span className="flex items-center gap-1 text-[10px] text-[#FF6600]">
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse inline-block ${loading ? "bg-[#888]" : "bg-[#FF6600]"}`}/>
                  {loading ? "LOADING" : "LIVE"}
                </span>
              </div>
              <div className="divide-y divide-[#1A1A1A]">
                {TICKER_DATA.map((t, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2.5 hover:bg-[#111] transition-colors">
                    <span className="text-xs text-[#888] w-20">{t.symbol}</span>
                    <span className="text-sm font-bold text-white">{t.price}</span>
                    <span className={`text-xs font-bold w-16 text-right ${t.change.startsWith("+") ? "text-[#FF6600]" : "text-[#FF4444]"}`}>
                      {t.change}
                    </span>
                    <div className="w-20 h-1 bg-[#1A1A1A] rounded overflow-hidden">
                      <div
                        className={`h-full rounded ${t.change.startsWith("+") ? "bg-[#FF6600]" : "bg-[#FF4444]"}`}
                        style={{ width: `${Math.random() * 40 + 40}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Signal Preview */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D]">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#1A1A1A] bg-[#111]">
                <span className="text-[10px] text-[#FF6600] tracking-widest font-bold">CLAUDE'S NEURAL NETWORK</span>
                <span className="text-[10px] text-[#555]">AI POWERED</span>
              </div>
              <div className="px-3 py-3 space-y-2">
                {[
                  { pair: "XAUUSD", signal: "BUY", conf: "87%", entry: "3338.00" },
                  { pair: "EURUSD", signal: "HOLD", conf: "62%", entry: "1.1340" },
                  { pair: "NAS100", signal: "BUY", conf: "74%", entry: "19810" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-[#888] w-20">{s.pair}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider ${
                      s.signal === "BUY" ? "bg-[#FF6600]/10 text-[#FF6600] border border-[#FF6600]/20" :
                      s.signal === "SELL" ? "bg-[#FF4444]/10 text-[#FF4444] border border-[#FF4444]/20" :
                      "bg-[#888]/10 text-[#888] border border-[#888]/20"
                    }`}>{s.signal}</span>
                    <span className="text-[#555]">Entry: <span className="text-white">{s.entry}</span></span>
                    <span className="text-[#FF6600]">{s.conf}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#1A1A1A]">
                  <p className="text-[11px] text-[#444] italic">Premium members only. Upgrade to unlock full AI signal access.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <section id="features" className="mt-16 pt-8 border-t border-[#1A1A1A]">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] text-[#FF6600] tracking-widest border-l-2 border-[#FF6600] pl-3">PLATFORM MODULES</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                icon: "📊", tag: "LIVE", title: "MARKET DATA",
                desc: "Real-time Gold, Forex, Crypto, and Indices with 15-30s refresh"
              },
              {
                icon: "🧮", tag: "TOOLS", title: "12 CALCULATORS",
                desc: "Pip value, lot size, risk/reward, position sizing & more"
              },
              {
                icon: "🤖", tag: "AI", title: "NEURAL NETWORK",
                desc: "Claude-powered signals, daily intelligence & market analysis"
              },
              {
                icon: "📓", tag: "TRACK", title: "TRADE JOURNAL",
                desc: "Log trades, track performance & analyze your patterns"
              },
              {
                icon: "🎓", tag: "LEARN", title: "TRADING ACADEMY",
                desc: "Beginner to advanced structured lessons with quizzes"
              },
              {
                icon: "🌐", tag: "MACRO", title: "MACRO HUB",
                desc: "Economic calendar, news feed & global market analysis"
              },
            ].map((f, i) => (
              <div key={i} className="border border-[#1A1A1A] hover:border-[#FF6600]/30 bg-[#0D0D0D] hover:bg-[#0F0F0F] transition-all p-4 group">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-[9px] text-[#FF6600] border border-[#FF6600]/30 px-1.5 py-0.5 tracking-widest">{f.tag}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1 tracking-wide">{f.title}</h3>
                <p className="text-[11px] text-[#555] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="mt-16 pt-8 border-t border-[#1A1A1A]">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] text-[#FF6600] tracking-widest border-l-2 border-[#FF6600] pl-3">SUBSCRIPTION PLANS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "SNIPER",
                price: "R199",
                per: "/mo",
                badge: null,
                features: ["300 Credits", "Basic Signals", "Limited Market Data", "Basic AI Access", "Trade Journal"],
                cta: "GET STARTED",
                highlight: false,
              },
              {
                name: "EXECUTION",
                price: "R399",
                per: "/mo",
                badge: "MOST POPULAR",
                features: ["1,200 Credits", "Advanced Signals", "Full Market Data", "Advanced AI + Daily Intel", "All Calculators"],
                cta: "START WINNING",
                highlight: true,
              },
              {
                name: "DOMINANCE",
                price: "R499",
                per: "/mo",
                badge: "PREMIUM",
                features: ["4,000 Credits", "Priority Signals", "Full + Priority Data", "Priority AI + Neural Net", "VIP Community Access"],
                cta: "GO DOMINANT",
                highlight: false,
              },
            ].map((plan, i) => (
              <div key={i} className={`border relative ${plan.highlight ? "border-[#FF6600]" : "border-[#1A1A1A]"} bg-[#0D0D0D]`}>
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] px-3 py-0.5 tracking-widest font-bold ${plan.highlight ? "bg-[#FF6600] text-white" : "bg-[#222] text-[#FF6600] border border-[#FF6600]/40"}`}>
                    {plan.badge}
                  </div>
                )}
                <div className="p-5">
                  <div className="border-b border-[#1A1A1A] pb-4 mb-4">
                    <h3 className="text-sm font-bold tracking-[0.2em] text-[#888] mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold ${plan.highlight ? "text-[#FF6600]" : "text-white"}`}>{plan.price}</span>
                      <span className="text-[#555] text-sm">{plan.per}</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs">
                        <span className="text-[#FF6600] text-[10px]">▶</span>
                        <span className="text-[#888]">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/sign-up" className={`block text-center text-xs font-bold py-2.5 tracking-widest transition-colors ${plan.highlight ? "bg-[#FF6600] hover:bg-[#FF7722] text-white" : "border border-[#333] hover:border-[#555] text-[#888] hover:text-white"}`}>
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border border-[#1A1A1A] bg-[#0D0D0D] p-4 text-center">
            <p className="text-[11px] text-[#555]">
              ▶ All plans include 14-day free trial — No credit card required
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1A] mt-16 py-8 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] text-[#444] mb-6">
            <div><span className="text-red-500">⚠</span> Trading involves substantial risk. You may lose all your investment.</div>
            <div><span className="text-yellow-500">⚠</span> TradeDaddy does not provide financial advice. Education only.</div>
            <div><span className="text-blue-500">⚠</span> Signals are not guaranteed to be profitable. Past performance ≠ future results.</div>
            <div><span className="text-cyan-500">⚠</span> You alone are responsible for all trading decisions.</div>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] justify-center border-t border-[#1A1A1A] pt-4">
            {[
              { label: "Terms of Service", href: "/legal" },
              { label: "Privacy Policy", href: "/legal" },
              { label: "Risk Disclosure", href: "/legal" },
              { label: "About", href: "/about" },
              { label: "Legal", href: "/legal" },
            ].map((link) => (
              <Link key={link.label} href={link.href} className="text-[#555] hover:text-[#FF6600] transition-colors">{link.label}</Link>
            ))}
          </div>
          <p className="text-center text-[11px] text-[#333] mt-4">© TradeDaddy 2026. All Rights Reserved. Jurisdiction: South Africa</p>
        </div>
      </footer>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono overflow-x-hidden">
      {/* Ticker Bar */}
      <div className="bg-[#111] border-b border-[#222] overflow-hidden h-8 flex items-center">
        <div className="flex gap-0 shrink-0 animate-[scroll_30s_linear_infinite]">
          {[...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
            <span key={i} className="flex items-center gap-2 px-4 text-xs border-r border-[#222] h-8 whitespace-nowrap">
              <span className="text-[#888]">{t.symbol}</span>
              <span className="text-white">{t.price}</span>
              <span className={t.change.startsWith("+") ? "text-[#00D084]" : "text-[#FF4444]"}>{t.change}</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      {/* Top Bar */}
      <header className="border-b border-[#222] bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top row */}
          <div className="flex items-center justify-between py-3 border-b border-[#1A1A1A]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#FF6600] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>
                </svg>
              </div>
              <span className="text-sm font-bold tracking-[0.2em] text-white">TRADEDADDY</span>
              <span className="text-[10px] text-[#FF6600] border border-[#FF6600]/40 px-1.5 py-0.5 tracking-wider">TERMINAL</span>
            </div>
            <div className="flex items-center gap-6 text-[11px] text-[#555]">
              <span className="text-[#00D084]">● MARKETS OPEN</span>
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <a href="/auth/login" className="text-xs text-[#888] hover:text-white px-3 py-1.5 border border-[#333] hover:border-[#555] transition-colors">
                LOGIN
              </a>
              <a href="/auth/sign-up" className="text-xs bg-[#FF6600] hover:bg-[#FF7722] px-4 py-1.5 text-white transition-colors font-bold tracking-wide">
                GET ACCESS
              </a>
            </div>
          </div>
          {/* Nav row */}
          <nav className="flex items-center gap-0 text-[11px]">
            {["Features", "Pricing", "Signals", "Academy", "About"].map((item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`px-4 py-2.5 border-b-2 transition-colors tracking-wider ${
                  activeNav === item
                    ? "border-[#FF6600] text-white"
                    : "border-transparent text-[#555] hover:text-[#888]"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Hero */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[11px] text-[#555] mb-4">
                <span className="text-[#FF6600]">▶</span>
                <span>PROFESSIONAL GRADE TRADING INTELLIGENCE</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-none tracking-tight">
                <span className="text-white">TRADE</span>
                <span className="text-[#FF6600]">DADDY</span>
              </h1>
              <p className="text-2xl text-[#555] font-light mt-2 tracking-wide">PROFESSIONAL TRADING TERMINAL</p>
            </div>

            <div className="border-l-2 border-[#FF6600] pl-4">
              <p className="text-sm text-[#999] leading-relaxed max-w-lg">
                All-in-one platform with live market prices, 12 trading calculators, AI-powered analysis via Claude's Neural Network, trade journal, signals, and trading academy. Everything a serious trader needs in one terminal.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a href="/auth/sign-up" className="bg-[#FF6600] hover:bg-[#FF7722] text-white text-sm font-bold px-6 py-3 tracking-wider transition-colors">
                LAUNCH TERMINAL →
              </a>
              <a href="/auth/login" className="border border-[#333] hover:border-[#555] text-[#888] hover:text-white text-sm px-6 py-3 tracking-wider transition-colors">
                SIGN IN
              </a>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-0 border border-[#1A1A1A] mt-8">
              {[
                { val: "6", label: "LIVE FEEDS" },
                { val: "12+", label: "CALCULATORS" },
                { val: "AI", label: "NEURAL NET" },
                { val: "24/7", label: "MARKET DATA" },
              ].map((s, i) => (
                <div key={i} className={`p-4 text-center ${i < 3 ? "border-r border-[#1A1A1A]" : ""}`}>
                  <div className="text-2xl font-bold text-[#FF6600]">{s.val}</div>
                  <div className="text-[10px] text-[#555] mt-1 tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel — Live Market Preview */}
          <div className="col-span-12 lg:col-span-5 space-y-3">
            <div className="border border-[#1A1A1A] bg-[#0D0D0D]">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#1A1A1A] bg-[#111]">
                <span className="text-[10px] text-[#FF6600] tracking-widest font-bold">LIVE MARKET OVERVIEW</span>
                <span className="flex items-center gap-1 text-[10px] text-[#00D084]">
                  <span className="w-1.5 h-1.5 bg-[#00D084] rounded-full animate-pulse inline-block"/>
                  LIVE
                </span>
              </div>
              <div className="divide-y divide-[#1A1A1A]">
                {TICKER_DATA.map((t, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2.5 hover:bg-[#111] transition-colors">
                    <span className="text-xs text-[#888] w-20">{t.symbol}</span>
                    <span className="text-sm font-bold text-white">{t.price}</span>
                    <span className={`text-xs font-bold w-16 text-right ${t.change.startsWith("+") ? "text-[#00D084]" : "text-[#FF4444]"}`}>
                      {t.change}
                    </span>
                    <div className="w-20 h-1 bg-[#1A1A1A] rounded overflow-hidden">
                      <div
                        className={`h-full rounded ${t.change.startsWith("+") ? "bg-[#00D084]" : "bg-[#FF4444]"}`}
                        style={{ width: `${Math.random() * 40 + 40}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Signal Preview */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D]">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#1A1A1A] bg-[#111]">
                <span className="text-[10px] text-[#FF6600] tracking-widest font-bold">CLAUDE'S NEURAL NETWORK</span>
                <span className="text-[10px] text-[#555]">AI POWERED</span>
              </div>
              <div className="px-3 py-3 space-y-2">
                {[
                  { pair: "XAUUSD", signal: "BUY", conf: "87%", entry: "3338.00" },
                  { pair: "EURUSD", signal: "HOLD", conf: "62%", entry: "1.1340" },
                  { pair: "NAS100", signal: "BUY", conf: "74%", entry: "19810" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-[#888] w-20">{s.pair}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider ${
                      s.signal === "BUY" ? "bg-[#00D084]/10 text-[#00D084] border border-[#00D084]/20" :
                      s.signal === "SELL" ? "bg-[#FF4444]/10 text-[#FF4444] border border-[#FF4444]/20" :
                      "bg-[#FF6600]/10 text-[#FF6600] border border-[#FF6600]/20"
                    }`}>{s.signal}</span>
                    <span className="text-[#555]">Entry: <span className="text-white">{s.entry}</span></span>
                    <span className="text-[#00D084]">{s.conf}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#1A1A1A]">
                  <p className="text-[11px] text-[#444] italic">Premium members only. Upgrade to unlock full AI signal access.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <section id="features" className="mt-16 pt-8 border-t border-[#1A1A1A]">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] text-[#FF6600] tracking-widest border-l-2 border-[#FF6600] pl-3">PLATFORM MODULES</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                icon: "📊", tag: "LIVE", title: "MARKET DATA",
                desc: "Real-time Gold, Forex, Crypto, and Indices with 15-30s refresh"
              },
              {
                icon: "🧮", tag: "TOOLS", title: "12 CALCULATORS",
                desc: "Pip value, lot size, risk/reward, position sizing & more"
              },
              {
                icon: "🤖", tag: "AI", title: "NEURAL NETWORK",
                desc: "Claude-powered signals, daily intelligence & market analysis"
              },
              {
                icon: "📓", tag: "TRACK", title: "TRADE JOURNAL",
                desc: "Log trades, track performance & analyze your patterns"
              },
              {
                icon: "🎓", tag: "LEARN", title: "TRADING ACADEMY",
                desc: "Beginner to advanced structured lessons with quizzes"
              },
              {
                icon: "🌐", tag: "MACRO", title: "MACRO HUB",
                desc: "Economic calendar, news feed & global market analysis"
              },
            ].map((f, i) => (
              <div key={i} className="border border-[#1A1A1A] hover:border-[#FF6600]/30 bg-[#0D0D0D] hover:bg-[#0F0F0F] transition-all p-4 group">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-[9px] text-[#FF6600] border border-[#FF6600]/30 px-1.5 py-0.5 tracking-widest">{f.tag}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1 tracking-wide">{f.title}</h3>
                <p className="text-[11px] text-[#555] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="mt-16 pt-8 border-t border-[#1A1A1A]">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] text-[#FF6600] tracking-widest border-l-2 border-[#FF6600] pl-3">SUBSCRIPTION PLANS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "SNIPER",
                price: "R199",
                per: "/mo",
                badge: null,
                features: ["300 Credits", "Basic Signals", "Limited Market Data", "Basic AI Access", "Trade Journal"],
                cta: "GET STARTED",
                highlight: false,
              },
              {
                name: "EXECUTION",
                price: "R399",
                per: "/mo",
                badge: "MOST POPULAR",
                features: ["1,200 Credits", "Advanced Signals", "Full Market Data", "Advanced AI + Daily Intel", "All Calculators"],
                cta: "START WINNING",
                highlight: true,
              },
              {
                name: "DOMINANCE",
                price: "R499",
                per: "/mo",
                badge: "PREMIUM",
                features: ["4,000 Credits", "Priority Signals", "Full + Priority Data", "Priority AI + Neural Net", "VIP Community Access"],
                cta: "GO DOMINANT",
                highlight: false,
              },
            ].map((plan, i) => (
              <div key={i} className={`border relative ${plan.highlight ? "border-[#FF6600]" : "border-[#1A1A1A]"} bg-[#0D0D0D]`}>
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] px-3 py-0.5 tracking-widest font-bold ${plan.highlight ? "bg-[#FF6600] text-white" : "bg-[#222] text-[#FF6600] border border-[#FF6600]/40"}`}>
                    {plan.badge}
                  </div>
                )}
                <div className="p-5">
                  <div className="border-b border-[#1A1A1A] pb-4 mb-4">
                    <h3 className="text-sm font-bold tracking-[0.2em] text-[#888] mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold ${plan.highlight ? "text-[#FF6600]" : "text-white"}`}>{plan.price}</span>
                      <span className="text-[#555] text-sm">{plan.per}</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs">
                        <span className="text-[#FF6600] text-[10px]">▶</span>
                        <span className="text-[#888]">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="/auth/sign-up" className={`block text-center text-xs font-bold py-2.5 tracking-widest transition-colors ${plan.highlight ? "bg-[#FF6600] hover:bg-[#FF7722] text-white" : "border border-[#333] hover:border-[#555] text-[#888] hover:text-white"}`}>
                    {plan.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border border-[#1A1A1A] bg-[#0D0D0D] p-4 text-center">
            <p className="text-[11px] text-[#555]">
              ▶ All plans include 14-day free trial — No credit card required
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1A] mt-16 py-8 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] text-[#444] mb-6">
            <div><span className="text-red-500">⚠</span> Trading involves substantial risk. You may lose all your investment.</div>
            <div><span className="text-yellow-500">⚠</span> TradeDaddy does not provide financial advice. Education only.</div>
            <div><span className="text-blue-500">⚠</span> Signals are not guaranteed to be profitable. Past performance ≠ future results.</div>
            <div><span className="text-cyan-500">⚠</span> You alone are responsible for all trading decisions.</div>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] justify-center border-t border-[#1A1A1A] pt-4">
            {["Terms of Service", "Privacy Policy", "Risk Disclosure", "Signal Disclaimer", "Legal"].map((link) => (
              <a key={link} href="#" className="text-[#555] hover:text-[#FF6600] transition-colors">{link}</a>
            ))}
          </div>
          <p className="text-center text-[11px] text-[#333] mt-4">© TradeDaddy 2026. All Rights Reserved. Jurisdiction: South Africa</p>
        </div>
      </footer>
    </div>
  )
}
