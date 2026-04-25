"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Price {
  symbol: string
  price: string
  change: string
  changeColor: string
  barWidth: number
  barColor: string
}

// ─── Live price hook ──────────────────────────────────────────────────────────

const SYMBOLS = ["XAUUSD", "EURUSD", "GBPUSD", "NAS100", "US500", "BTCUSD", "USDJPY", "WTI"]

function useLivePrices() {
  const [prices, setPrices] = useState<Price[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch(`/api/prices?symbols=${SYMBOLS.join(",")}`, {
        cache: "no-store",
      })
      if (!res.ok) throw new Error("API error")
      const data = await res.json()

      const mapped: Price[] = SYMBOLS.map((sym) => {
        const entry = data[sym]
        if (!entry) return null
        const chg = parseFloat(entry.changePercent ?? "0")
        const isNeg = chg < 0
        // bar width mapped to 40–90 range based on absolute % change (max 3%)
        const barWidth = 40 + Math.min(50, (Math.abs(chg) / 3) * 50)
        return {
          symbol: sym,
          price: entry.price ?? "–",
          change: `${isNeg ? "" : "+"}${chg.toFixed(2)}%`,
          changeColor: isNeg ? "#FF4444" : "#00D084",
          barWidth,
          barColor: isNeg ? "#FF4444" : "#00D084",
        }
      }).filter(Boolean) as Price[]

      setPrices(mapped)
      setLastUpdated(new Date())
    } catch {
      // silently fail — keep existing prices
    }
  }, [])

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 30_000)
    return () => clearInterval(interval)
  }, [fetchPrices])

  return { prices, lastUpdated }
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/signals", label: "Signals" },
  { href: "/academy", label: "Academy" },
  { href: "/about", label: "About" },
]

function Nav({ activeHref }: { activeHref: string }) {
  return (
    <nav className="flex items-center gap-0 text-[11px]">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-4 py-2.5 border-b-2 transition-colors tracking-wider ${
            activeHref === link.href
              ? "border-[#FF6600] text-white"
              : "border-transparent text-[#555] hover:text-[#888]"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

// ─── Ticker strip ─────────────────────────────────────────────────────────────

function Ticker({ prices }: { prices: Price[] }) {
  const items = prices.length > 0 ? prices : []
  // Duplicate for seamless loop
  const doubled = [...items, ...items]

  return (
    <div className="bg-[#111] border-b border-[#222] overflow-hidden h-8 flex items-center">
      <div
        className="flex gap-0 shrink-0"
        style={{ animation: "scroll 30s linear infinite" }}
      >
        {doubled.map((p, i) => (
          <span
            key={`${p.symbol}-${i}`}
            className="flex items-center gap-2 px-4 text-xs border-r border-[#222] h-8 whitespace-nowrap"
          >
            <span className="text-[#888]">{p.symbol}</span>
            <span className="text-white">{p.price}</span>
            <span style={{ color: p.changeColor }}>{p.change}</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  )
}

// ─── Market overview panel ────────────────────────────────────────────────────

function MarketOverview({ prices, lastUpdated }: { prices: Price[]; lastUpdated: Date | null }) {
  return (
    <div className="border border-[#1A1A1A] bg-[#0D0D0D]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1A1A1A] bg-[#111]">
        <span className="text-[10px] text-[#FF6600] tracking-widest font-bold">LIVE MARKET OVERVIEW</span>
        <span className="flex items-center gap-1 text-[10px] text-[#00D084]">
          <span className="w-1.5 h-1.5 bg-[#00D084] rounded-full animate-pulse inline-block" />
          {lastUpdated ? `UPDATED ${lastUpdated.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : "LIVE"}
        </span>
      </div>
      <div className="divide-y divide-[#1A1A1A]">
        {prices.length === 0
          ? SYMBOLS.map((sym) => (
              <div key={sym} className="flex items-center justify-between px-3 py-2.5 animate-pulse">
                <span className="text-xs text-[#888] w-20">{sym}</span>
                <span className="text-sm font-bold text-[#333]">———</span>
                <span className="text-xs font-bold w-16 text-right text-[#333]">+0.00%</span>
                <div className="w-20 h-1 bg-[#1A1A1A] rounded overflow-hidden" />
              </div>
            ))
          : prices.map((p) => (
              <div key={p.symbol} className="flex items-center justify-between px-3 py-2.5 hover:bg-[#111] transition-colors">
                <span className="text-xs text-[#888] w-20">{p.symbol}</span>
                <span className="text-sm font-bold text-white">{p.price}</span>
                <span className="text-xs font-bold w-16 text-right" style={{ color: p.changeColor }}>
                  {p.change}
                </span>
                <div className="w-20 h-1 bg-[#1A1A1A] rounded overflow-hidden">
                  <div
                    className="h-full rounded"
                    style={{ width: `${p.barWidth}%`, backgroundColor: p.barColor }}
                  />
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { prices, lastUpdated } = useLivePrices()
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono overflow-x-hidden">
      <Ticker prices={prices} />

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
            <div className="flex items-center gap-6 text-[11px] text-[#555]">
              <span className="text-[#00D084]">● MARKETS OPEN</span>
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
          <Nav activeHref={pathname} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-12 gap-6">
          {/* Hero */}
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
                All-in-one platform with live market prices, 12 trading calculators, AI-powered analysis
                via Claude&apos;s Neural Network, trade journal, signals, and trading academy. Everything
                a serious trader needs in one terminal.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/auth/sign-up"
                className="bg-[#FF6600] hover:bg-[#FF7722] text-white text-sm font-bold px-6 py-3 tracking-wider transition-colors"
              >
                LAUNCH TERMINAL →
              </Link>
              <Link
                href="/auth/login"
                className="border border-[#333] hover:border-[#555] text-[#888] hover:text-white text-sm px-6 py-3 tracking-wider transition-colors"
              >
                SIGN IN
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-0 border border-[#1A1A1A] mt-8">
              {[
                { n: "6", l: "LIVE FEEDS" },
                { n: "12+", l: "CALCULATORS" },
                { n: "AI", l: "NEURAL NET" },
                { n: "24/7", l: "MARKET DATA" },
              ].map((s) => (
                <div key={s.l} className="p-4 text-center border-r border-[#1A1A1A] last:border-r-0">
                  <div className="text-2xl font-bold text-[#FF6600]">{s.n}</div>
                  <div className="text-[10px] text-[#555] mt-1 tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className="col-span-12 lg:col-span-5 space-y-3">
            <MarketOverview prices={prices} lastUpdated={lastUpdated} />

            {/* AI signals teaser */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D]">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#1A1A1A] bg-[#111]">
                <span className="text-[10px] text-[#FF6600] tracking-widest font-bold">CLAUDE&apos;S NEURAL NETWORK</span>
                <span className="text-[10px] text-[#555]">AI POWERED</span>
              </div>
              <div className="px-3 py-3 space-y-2">
                {[
                  { sym: "XAUUSD", dir: "BUY", entry: "3338.00", conf: 87 },
                  { sym: "EURUSD", dir: "HOLD", entry: "1.1340", conf: 62 },
                  { sym: "NAS100", dir: "BUY", entry: "19810", conf: 74 },
                ].map((s) => (
                  <div key={s.sym} className="flex items-center justify-between text-xs">
                    <span className="text-[#888] w-20">{s.sym}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold tracking-wider border ${
                        s.dir === "BUY"
                          ? "bg-[#00D084]/10 text-[#00D084] border-[#00D084]/20"
                          : "bg-[#FF6600]/10 text-[#FF6600] border-[#FF6600]/20"
                      }`}
                    >
                      {s.dir}
                    </span>
                    <span className="text-[#555]">
                      Entry: <span className="text-white">{s.entry}</span>
                    </span>
                    <span className="text-[#00D084]">{s.conf}%</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#1A1A1A]">
                  <p className="text-[11px] text-[#444] italic">
                    Premium members only.{" "}
                    <Link href="/auth/sign-up" className="text-[#FF6600] hover:underline">
                      Upgrade to unlock full AI signal access.
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <section id="features" className="mt-16 pt-8 border-t border-[#1A1A1A]">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] text-[#FF6600] tracking-widest border-l-2 border-[#FF6600] pl-3">PLATFORM MODULES</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon: "📊", tag: "LIVE", title: "MARKET DATA", desc: "Real-time Gold, Forex, Crypto, and Indices with 15-30s refresh" },
              { icon: "🧮", tag: "TOOLS", title: "12 CALCULATORS", desc: "Pip value, lot size, risk/reward, position sizing & more" },
              { icon: "🤖", tag: "AI", title: "NEURAL NETWORK", desc: "Claude-powered signals, daily intelligence & market analysis" },
              { icon: "📓", tag: "TRACK", title: "TRADE JOURNAL", desc: "Log trades, track performance & analyze your patterns" },
              { icon: "🎓", tag: "LEARN", title: "TRADING ACADEMY", desc: "Beginner to advanced structured lessons with quizzes" },
              { icon: "🌐", tag: "MACRO", title: "MACRO HUB", desc: "Economic calendar, news feed & global market analysis" },
            ].map((m) => (
              <div
                key={m.title}
                className="border border-[#1A1A1A] hover:border-[#FF6600]/30 bg-[#0D0D0D] hover:bg-[#0F0F0F] transition-all p-4 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-[9px] text-[#FF6600] border border-[#FF6600]/30 px-1.5 py-0.5 tracking-widest">{m.tag}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1 tracking-wide">{m.title}</h3>
                <p className="text-[11px] text-[#555] leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/features" className="text-[11px] text-[#FF6600] hover:underline tracking-wider">
              VIEW ALL FEATURES →
            </Link>
          </div>
        </section>

        {/* Pricing section */}
        <section id="pricing" className="mt-16 pt-8 border-t border-[#1A1A1A]">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] text-[#FF6600] tracking-widest border-l-2 border-[#FF6600] pl-3">SUBSCRIPTION PLANS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "SNIPER",
                price: "R199",
                highlight: false,
                badge: null,
                features: ["300 Credits", "Basic Signals", "Limited Market Data", "Basic AI Access", "Trade Journal"],
                cta: "GET STARTED",
              },
              {
                name: "EXECUTION",
                price: "R399",
                highlight: true,
                badge: "MOST POPULAR",
                features: ["1,200 Credits", "Advanced Signals", "Full Market Data", "Advanced AI + Daily Intel", "All Calculators"],
                cta: "START WINNING",
              },
              {
                name: "DOMINANCE",
                price: "R499",
                highlight: false,
                badge: "PREMIUM",
                features: ["4,000 Credits", "Priority Signals", "Full + Priority Data", "Priority AI + Neural Net", "VIP Community Access"],
                cta: "GO DOMINANT",
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`border relative bg-[#0D0D0D] ${plan.highlight ? "border-[#FF6600]" : "border-[#1A1A1A]"}`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] px-3 py-0.5 tracking-widest font-bold ${
                      plan.highlight ? "bg-[#FF6600] text-white" : "bg-[#222] text-[#FF6600] border border-[#FF6600]/40"
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}
                <div className="p-5">
                  <div className="border-b border-[#1A1A1A] pb-4 mb-4">
                    <h3 className="text-sm font-bold tracking-[0.2em] text-[#888] mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold ${plan.highlight ? "text-[#FF6600]" : "text-white"}`}>
                        {plan.price}
                      </span>
                      <span className="text-[#555] text-sm">/mo</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs">
                        <span className="text-[#FF6600] text-[10px]">▶</span>
                        <span className="text-[#888]">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/auth/sign-up"
                    className={`block text-center text-xs font-bold py-2.5 tracking-widest transition-colors ${
                      plan.highlight
                        ? "bg-[#FF6600] hover:bg-[#FF7722] text-white"
                        : "border border-[#333] hover:border-[#555] text-[#888] hover:text-white"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border border-[#1A1A1A] bg-[#0D0D0D] p-4 text-center">
            <p className="text-[11px] text-[#555]">
              ▶ All plans include 14-day free trial — No credit card required ·{" "}
              <Link href="/pricing" className="text-[#FF6600] hover:underline">View full pricing details →</Link>
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1A1A1A] mt-16 py-8 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] text-[#444] mb-6">
            <div><span className="text-red-500">⚠</span> Trading involves substantial risk. You may lose all your investment.</div>
            <div><span className="text-yellow-500">⚠</span> TradeDaddy does not provide financial advice. Education only.</div>
            <div><span className="text-blue-500">⚠</span> Signals are not guaranteed to be profitable. Past performance ≠ future results.</div>
            <div><span className="text-cyan-500">⚠</span> You alone are responsible for all trading decisions.</div>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] justify-center border-t border-[#1A1A1A] pt-4">
            <Link href="/legal/terms" className="text-[#555] hover:text-[#FF6600] transition-colors">Terms of Service</Link>
            <Link href="/legal/privacy" className="text-[#555] hover:text-[#FF6600] transition-colors">Privacy Policy</Link>
            <Link href="/legal/risk" className="text-[#555] hover:text-[#FF6600] transition-colors">Risk Disclosure</Link>
            <Link href="/legal/disclaimer" className="text-[#555] hover:text-[#FF6600] transition-colors">Signal Disclaimer</Link>
            <Link href="/legal/legal" className="text-[#555] hover:text-[#FF6600] transition-colors">Legal</Link>
          </div>
          <p className="text-center text-[11px] text-[#333] mt-4">© TradeDaddy 2026. All Rights Reserved. Jurisdiction: South Africa</p>
        </div>
      </footer>
    </div>
  )
}
