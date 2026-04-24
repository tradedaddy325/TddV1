"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function LandingPage() {
  const [time, setTime] = useState("")
  const [prices, setPrices] = useState([])
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

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(`/api/prices?symbols=EURUSD,GBPUSD,USDJPY,XAUUSD`)
        const data = await res.json()
        if (data.prices) {
          setPrices(data.prices.slice(0, 4))
        }
      } catch (error) {
        console.error("[v0] Price fetch failed:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPrices()
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  const tickerData = prices.length > 0 ? prices : [
    { symbol: "XAUUSD", price: "---", change: "--%" },
    { symbol: "EURUSD", price: "---", change: "--%" },
    { symbol: "GBPUSD", price: "---", change: "--%" },
    { symbol: "USDJPY", price: "---", change: "--%" },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono">
      <div className="bg-[#111] border-b border-[#222] h-8 flex items-center overflow-hidden">
        <div className="flex gap-0 animate-[scroll_30s_linear_infinite] shrink-0">
          {[...tickerData, ...tickerData].map((t, i) => (
            <span key={i} className="flex items-center gap-2 px-4 text-xs border-r border-[#222] h-8 whitespace-nowrap">
              <span className="text-[#888]">{t.symbol}</span>
              <span className="text-white">{t.price}</span>
              <span className={t.change.startsWith("+") ? "text-[#FF6600]" : "text-[#FF4444]"}>{t.change}</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      <header className="border-b border-[#222] bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3 border-b border-[#1A1A1A]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#FF6600] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>
                </svg>
              </div>
              <span className="text-sm font-bold tracking-[0.2em]">TRADEDADDY</span>
            </div>
            <span className="text-[11px] text-[#555]">{time}</span>
            <div className="flex gap-2">
              <Link href="/auth/login" className="text-xs text-[#888] px-3 py-1.5 border border-[#333] hover:border-[#555]">LOGIN</Link>
              <Link href="/auth/sign-up" className="text-xs bg-[#FF6600] px-4 py-1.5 text-white font-bold">GET ACCESS</Link>
            </div>
          </div>

          <nav className="flex text-[11px]">
            {["Features", "Pricing", "Signals", "Academy", "About"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="px-4 py-2.5 text-[#555] hover:text-[#FF6600] border-b-2 border-transparent">
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <div>
              <h1 className="text-6xl font-bold mb-4"><span className="text-white">TRADE</span><span className="text-[#FF6600]">DADDY</span></h1>
              <p className="text-[#999] text-sm leading-relaxed">All-in-one platform with live market prices, AI analysis, trading calculators, and education.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/auth/sign-up" className="bg-[#FF6600] text-white px-6 py-3 font-bold text-sm hover:bg-[#FF7722]">LAUNCH TERMINAL</Link>
              <Link href="/auth/login" className="border border-[#333] text-[#888] px-6 py-3 text-sm hover:border-[#555]">SIGN IN</Link>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 border border-[#1A1A1A] bg-[#0D0D0D]">
            <div className="px-4 py-3 border-b border-[#1A1A1A] bg-[#111]">
              <span className="text-[10px] text-[#FF6600] tracking-widest">LIVE PRICES</span>
            </div>
            {tickerData.map((t) => (
              <div key={t.symbol} className="flex justify-between px-4 py-2 border-b border-[#1A1A1A] text-sm">
                <span className="text-[#888]">{t.symbol}</span>
                <span>{t.price}</span>
                <span className={t.change.startsWith("+") ? "text-[#FF6600]" : "text-[#FF4444]"}>{t.change}</span>
              </div>
            ))}
          </div>
        </div>

        <footer className="border-t border-[#1A1A1A] pt-6 text-center text-[11px] text-[#555]">
          <Link href="/legal" className="hover:text-[#FF6600]">Legal</Link> • <Link href="/about" className="hover:text-[#FF6600]">About</Link>
        </footer>
      </main>
    </div>
  )
}
