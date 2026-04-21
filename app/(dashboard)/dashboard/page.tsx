"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const MARKETS = [
  { symbol: "XAUUSD", name: "Gold", price: "3341.20", change: "+0.82%", up: true },
  { symbol: "EURUSD", name: "Euro", price: "1.1342", change: "+0.21%", up: true },
  { symbol: "GBPUSD", name: "Cable", price: "1.3218", change: "-0.11%", up: false },
  { symbol: "NAS100", name: "Nasdaq", price: "19,842", change: "+1.04%", up: true },
  { symbol: "US500", name: "S&P 500", price: "5,521", change: "+0.67%", up: true },
  { symbol: "BTCUSD", name: "Bitcoin", price: "93,412", change: "+2.31%", up: true },
]

const SIGNALS = [
  { pair: "XAUUSD", signal: "BUY", conf: 87, entry: "3,338.00", tp: "3,365.00", sl: "3,310.00" },
  { pair: "EURUSD", signal: "HOLD", conf: 62, entry: "1.1340", tp: "1.1400", sl: "1.1280" },
  { pair: "NAS100", signal: "BUY", conf: 74, entry: "19,810", tp: "20,100", sl: "19,500" },
  { pair: "GBPUSD", signal: "SELL", conf: 71, entry: "1.3230", tp: "1.3140", sl: "1.3280" },
]

const QUICK_LINKS = [
  { label: "Risk Calculator", href: "/trading-tools/risk-calculator", icon: "⚡" },
  { label: "Trade Journal", href: "/trading-tools/journal", icon: "📓" },
  { label: "Economic Calendar", href: "/trading-tools/economic-calendar", icon: "📅" },
  { label: "Market Heatmap", href: "/trading-tools/heatmap", icon: "🔥" },
  { label: "AI Signals", href: "/signals/ai", icon: "🤖" },
  { label: "Charting", href: "/trading-tools/charting", icon: "📈" },
]

export default function DashboardPage() {
  const [time, setTime] = useState("")
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Africa/Johannesburg" }) + " SAST")
      const h = now.getHours()
      setGreeting(h < 12 ? "GOOD MORNING" : h < 17 ? "GOOD AFTERNOON" : "GOOD EVENING")
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-6 space-y-4">

      {/* Top bar */}
      <div className="flex items-center justify-between border border-[#1A1A1A] bg-[#0D0D0D] px-4 py-3">
        <div>
          <p className="text-[10px] text-[#333] font-mono tracking-widest">{greeting}</p>
          <p className="text-sm font-bold text-white">Mohammed B. <span className="text-[#00C853]">↗</span></p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#00C853] rounded-full animate-pulse" />
            <span className="text-[10px] text-[#00C853] font-mono tracking-wider">MARKETS OPEN</span>
          </div>
          <span className="text-[11px] text-[#333] font-mono">{time}</span>
          <div className="flex items-center gap-2 border border-[#1A1A1A] px-3 py-1.5">
            <span className="text-[10px] text-[#333] font-mono">CREDITS</span>
            <span className="text-xs font-bold text-[#00C853]">847</span>
          </div>
        </div>
      </div>

      {/* Market strip */}
      <div className="border border-[#1A1A1A] bg-[#0D0D0D]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#1A1A1A]">
          <span className="text-[10px] text-[#00C853] tracking-widest font-mono">LIVE MARKET OVERVIEW</span>
          <span className="flex items-center gap-1 text-[10px] text-[#00C853] font-mono">
            <span className="w-1.5 h-1.5 bg-[#00C853] rounded-full animate-pulse inline-block" />
            LIVE
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y md:divide-y-0 divide-[#1A1A1A]">
          {MARKETS.map((m) => (
            <div key={m.symbol} className="px-4 py-3 hover:bg-[#111] transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#444] font-mono">{m.symbol}</span>
                <span className={`text-[10px] font-bold font-mono ${m.up ? "text-[#00C853]" : "text-[#FF4444]"}`}>{m.change}</span>
              </div>
              <div className="text-base font-bold">{m.price}</div>
              <div className="text-[10px] text-[#333] font-mono">{m.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* AI Signals */}
        <div className="lg:col-span-2 border border-[#1A1A1A] bg-[#0D0D0D]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A]">
            <span className="text-[10px] text-[#00C853] tracking-widest font-mono">CLAUDE'S NEURAL NETWORK</span>
            <Link href="/signals/ai" className="text-[10px] text-[#333] hover:text-[#00C853] font-mono tracking-wider transition-colors">
              VIEW ALL →
            </Link>
          </div>
          <div className="divide-y divide-[#1A1A1A]">
            {SIGNALS.map((s) => (
              <div key={s.pair} className="px-4 py-3 hover:bg-[#111] transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold w-16 font-mono">{s.pair}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider font-mono border ${
                    s.signal === "BUY" ? "bg-[#00C853]/10 text-[#00C853] border-[#00C853]/20" :
                    s.signal === "SELL" ? "bg-[#FF4444]/10 text-[#FF4444] border-[#FF4444]/20" :
                    "bg-[#FF6600]/10 text-[#FF6600] border-[#FF6600]/20"
                  }`}>{s.signal}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="h-1 bg-[#1A1A1A] flex-1 rounded overflow-hidden">
                      <div className={`h-full rounded ${
                        s.signal === "BUY" ? "bg-[#00C853]" : s.signal === "SELL" ? "bg-[#FF4444]" : "bg-[#FF6600]"
                      }`} style={{ width: `${s.conf}%` }} />
                    </div>
                    <span className="text-[11px] text-[#444] font-mono w-8">{s.conf}%</span>
                  </div>
                  <div className="hidden md:flex items-center gap-4 text-[11px] font-mono">
                    <span className="text-[#333]">E: <span className="text-[#666]">{s.entry}</span></span>
                    <span className="text-[#00C853]/50">TP: <span className="text-[#00C853]">{s.tp}</span></span>
                    <span className="text-[#FF4444]/50">SL: <span className="text-[#FF4444]">{s.sl}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="border border-[#1A1A1A] bg-[#0D0D0D]">
          <div className="px-4 py-3 border-b border-[#1A1A1A]">
            <span className="text-[10px] text-[#00C853] tracking-widest font-mono">QUICK ACCESS</span>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {QUICK_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex flex-col items-center gap-2 p-3 border border-[#1A1A1A] hover:border-[#00C853]/30 hover:bg-[#111] transition-colors text-center"
              >
                <span className="text-xl">{l.icon}</span>
                <span className="text-[10px] text-[#555] font-mono leading-tight">{l.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Daily Intelligence */}
        <div className="border border-[#1A1A1A] bg-[#0D0D0D]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A]">
            <span className="text-[10px] text-[#00C853] tracking-widest font-mono">DAILY INTELLIGENCE</span>
            <span className="text-[10px] text-[#333] font-mono">AI POWERED</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="border-l-2 border-[#00C853] pl-3">
              <p className="text-[11px] text-[#666] leading-relaxed">
                Gold continues to show bullish momentum supported by USD weakness and geopolitical risk premium.
                Key resistance at 3,365 — a break above confirms continuation to 3,400.
              </p>
            </div>
            <div className="border-l-2 border-[#FF6600] pl-3">
              <p className="text-[11px] text-[#666] leading-relaxed">
                NAS100 tech rally driven by positive earnings beats. Watch Fed speakers today at 14:00 EST for rate guidance.
              </p>
            </div>
            <Link href="/neural-network/daily-intelligence" className="flex items-center gap-1 text-[10px] text-[#333] hover:text-[#00C853] font-mono tracking-wider transition-colors mt-2">
              FULL BRIEFING →
            </Link>
          </div>
        </div>

        {/* Recent Journal */}
        <div className="border border-[#1A1A1A] bg-[#0D0D0D]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A]">
            <span className="text-[10px] text-[#00C853] tracking-widest font-mono">RECENT TRADES</span>
            <Link href="/trading-tools/journal" className="text-[10px] text-[#333] hover:text-[#00C853] font-mono tracking-wider transition-colors">
              JOURNAL →
            </Link>
          </div>
          <div className="divide-y divide-[#1A1A1A]">
            {[
              { pair: "XAUUSD", dir: "BUY", pnl: "+$142", date: "Apr 20", win: true },
              { pair: "EURUSD", dir: "SELL", pnl: "-$38", date: "Apr 19", win: false },
              { pair: "NAS100", dir: "BUY", pnl: "+$287", date: "Apr 18", win: true },
              { pair: "GBPUSD", dir: "BUY", pnl: "+$65", date: "Apr 17", win: true },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 hover:bg-[#111] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#555] font-mono w-12">{t.date}</span>
                  <span className="text-xs font-bold font-mono">{t.pair}</span>
                  <span className={`text-[10px] font-mono ${t.dir === "BUY" ? "text-[#00C853]" : "text-[#FF4444]"}`}>{t.dir}</span>
                </div>
                <span className={`text-sm font-bold font-mono ${t.win ? "text-[#00C853]" : "text-[#FF4444]"}`}>{t.pnl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
