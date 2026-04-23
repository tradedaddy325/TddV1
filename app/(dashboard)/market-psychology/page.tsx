// app/market-psychology/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"

const INSTRUMENTS = ["XAUUSD", "EURUSD", "GBPUSD", "NAS100", "US500", "BTCUSD", "USDJPY", "WTI"]

interface PsychData {
  instrument: string
  sentiment: "GREED" | "FEAR" | "NEUTRAL" | "EXTREME GREED" | "EXTREME FEAR"
  score: number // 0-100
  retailLong: number
  retailShort: number
  trend: "BULLISH" | "BEARISH" | "RANGING"
  keyLevels: { support: string; resistance: string }
  biasStatement: string
  traps: string[]
  updatedAt: string
}

interface AIBriefing {
  overallMood: string
  keyInsight: string
  topOpportunity: string
  topRisk: string
  fearGreedIndex: number
  marketPhase: string
}

const sentimentColor = (s: string) => {
  if (s.includes("EXTREME GREED")) return "text-[#FF4444]"
  if (s.includes("GREED")) return "text-[#FF8C00]"
  if (s.includes("EXTREME FEAR")) return "text-[#00C853]"
  if (s.includes("FEAR")) return "text-[#4CAF50]"
  return "text-[#888]"
}

const sentimentBg = (s: string) => {
  if (s.includes("EXTREME GREED")) return "bg-[#FF4444]/10 border-[#FF4444]/20 text-[#FF4444]"
  if (s.includes("GREED")) return "bg-[#FF8C00]/10 border-[#FF8C00]/20 text-[#FF8C00]"
  if (s.includes("EXTREME FEAR")) return "bg-[#00C853]/10 border-[#00C853]/20 text-[#00C853]"
  if (s.includes("FEAR")) return "bg-[#4CAF50]/10 border-[#4CAF50]/20 text-[#4CAF50]"
  return "bg-[#888]/10 border-[#888]/20 text-[#888]"
}

// Static seed data so the page loads instantly before AI kicks in
const SEED_DATA: PsychData[] = [
  {
    instrument: "XAUUSD", sentiment: "GREED", score: 68,
    retailLong: 72, retailShort: 28, trend: "BULLISH",
    keyLevels: { support: "3310.00", resistance: "3365.00" },
    biasStatement: "Retail heavily long — institutional likely to fade the move.",
    traps: ["Chasing breakouts above 3360", "Holding longs into NFP"],
    updatedAt: "Live",
  },
  {
    instrument: "EURUSD", sentiment: "NEUTRAL", score: 51,
    retailLong: 54, retailShort: 46, trend: "RANGING",
    keyLevels: { support: "1.1280", resistance: "1.1400" },
    biasStatement: "Balanced positioning — market awaiting catalyst.",
    traps: ["Trading inside range without confirmation"],
    updatedAt: "Live",
  },
  {
    instrument: "GBPUSD", sentiment: "FEAR", score: 34,
    retailLong: 38, retailShort: 62, trend: "BEARISH",
    keyLevels: { support: "1.3140", resistance: "1.3280" },
    biasStatement: "Retail short-heavy — watch for short squeeze above 1.3280.",
    traps: ["Shorting into oversold conditions", "Ignoring BOE event risk"],
    updatedAt: "Live",
  },
  {
    instrument: "NAS100", sentiment: "GREED", score: 71,
    retailLong: 68, retailShort: 32, trend: "BULLISH",
    keyLevels: { support: "19500", resistance: "20100" },
    biasStatement: "Strong bullish retail bias post earnings. Smart money accumulating dips.",
    traps: ["FOMO entries at highs", "Ignoring Fed rate risk"],
    updatedAt: "Live",
  },
  {
    instrument: "BTCUSD", sentiment: "EXTREME GREED", score: 84,
    retailLong: 81, retailShort: 19, trend: "BULLISH",
    keyLevels: { support: "90000", resistance: "98000" },
    biasStatement: "Extreme greed — historically precedes sharp corrections.",
    traps: ["Over-leveraging spot positions", "Ignoring whale wallet outflows"],
    updatedAt: "Live",
  },
  {
    instrument: "US500", sentiment: "GREED", score: 63,
    retailLong: 65, retailShort: 35, trend: "BULLISH",
    keyLevels: { support: "5420", resistance: "5600" },
    biasStatement: "Moderate greed. Earnings season driving retail FOMO.",
    traps: ["Buying breakouts without volume confirmation"],
    updatedAt: "Live",
  },
  {
    instrument: "USDJPY", sentiment: "FEAR", score: 38,
    retailLong: 42, retailShort: 58, trend: "BEARISH",
    keyLevels: { support: "140.00", resistance: "144.50" },
    biasStatement: "BOJ intervention fears keeping retail cautious.",
    traps: ["Holding yen shorts near key levels", "Ignoring Japanese CPI"],
    updatedAt: "Live",
  },
  {
    instrument: "WTI", sentiment: "NEUTRAL", score: 48,
    retailLong: 50, retailShort: 50, trend: "RANGING",
    keyLevels: { support: "76.00", resistance: "83.00" },
    biasStatement: "Balanced — OPEC+ headline risk keeping traders cautious.",
    traps: ["Trading without EIA inventory context"],
    updatedAt: "Live",
  },
]

export default function MarketPsychologyPage() {
  const [selected, setSelected] = useState<string>("XAUUSD")
  const [data, setData] = useState<PsychData[]>(SEED_DATA)
  const [briefing, setBriefing] = useState<AIBriefing | null>(null)
  const [loadingBriefing, setLoadingBriefing] = useState(false)
  const [loadingPsych, setLoadingPsych] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<string>("")

  const current = data.find((d) => d.instrument === selected) || data[0]

  const fetchAIBriefing = useCallback(async () => {
    setLoadingBriefing(true)
    try {
      const res = await fetch("/api/claude/market-psychology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "briefing", instruments: INSTRUMENTS }),
      })
      const json = await res.json()
      if (json.briefing) setBriefing(json.briefing)
    } catch (e) {
      console.error("Briefing fetch failed", e)
    } finally {
      setLoadingBriefing(false)
    }
  }, [])

  const fetchPsychData = useCallback(async () => {
    setLoadingPsych(true)
    try {
      const res = await fetch("/api/claude/market-psychology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "psychology", instruments: INSTRUMENTS }),
      })
      const json = await res.json()
      if (json.data && Array.isArray(json.data)) {
        setData(json.data)
      }
      setLastRefresh(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }))
    } catch (e) {
      console.error("Psych data fetch failed", e)
      setLastRefresh(new Date().toLocaleTimeString())
    } finally {
      setLoadingPsych(false)
    }
  }, [])

  useEffect(() => {
    fetchAIBriefing()
    fetchPsychData()
  }, [fetchAIBriefing, fetchPsychData])

  const fgIndex = briefing?.fearGreedIndex ?? 62
  const fgColor = fgIndex > 75 ? "#FF4444" : fgIndex > 55 ? "#FF8C00" : fgIndex < 25 ? "#00C853" : fgIndex < 45 ? "#4CAF50" : "#888"
  const fgLabel = fgIndex > 75 ? "EXTREME GREED" : fgIndex > 55 ? "GREED" : fgIndex < 25 ? "EXTREME FEAR" : fgIndex < 45 ? "FEAR" : "NEUTRAL"

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-6 space-y-4">

      {/* Top bar */}
      <div className="flex items-center justify-between border border-[#1A1A1A] bg-[#0D0D0D] px-4 py-3">
        <div>
          <p className="text-[10px] text-[#333] font-mono tracking-widest">CLAUDE'S NEURAL NETWORK</p>
          <p className="text-sm font-bold">MARKET PSYCHOLOGY</p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-[10px] text-[#333] font-mono hidden md:block">UPDATED {lastRefresh}</span>
          )}
          <button
            onClick={() => { fetchAIBriefing(); fetchPsychData() }}
            disabled={loadingBriefing || loadingPsych}
            className="text-[10px] border border-[#1A1A1A] hover:border-[#00C853]/30 text-[#444] hover:text-[#00C853] px-3 py-1.5 font-mono tracking-widest transition-colors disabled:opacity-50"
          >
            {loadingPsych ? "REFRESHING..." : "↻ REFRESH"}
          </button>
        </div>
      </div>

      {/* Fear & Greed Index + AI Briefing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fear & Greed Gauge */}
        <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5 flex flex-col items-center justify-center">
          <span className="text-[10px] text-[#00C853] tracking-widest font-mono block mb-4 self-start">FEAR & GREED INDEX</span>
          <div className="relative w-32 h-32 mb-3">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#1A1A1A" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke={fgColor}
                strokeWidth="10"
                strokeDasharray={`${(fgIndex / 100) * 314} 314`}
                strokeLinecap="butt"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
              <span className="text-3xl font-bold" style={{ color: fgColor }}>{fgIndex}</span>
              <span className="text-[9px] font-mono text-[#444] mt-0.5">/ 100</span>
            </div>
          </div>
          <span className="text-sm font-bold font-mono" style={{ color: fgColor }}>{fgLabel}</span>
          <p className="text-[10px] text-[#333] font-mono mt-1">COMPOSITE INDEX</p>
        </div>

        {/* AI Briefing */}
        <div className="md:col-span-2 border border-[#1A1A1A] bg-[#0D0D0D] p-5">
          <span className="text-[10px] text-[#00C853] tracking-widest font-mono block mb-4">AI PSYCHOLOGY BRIEFING</span>
          {loadingBriefing ? (
            <div className="space-y-2 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-3 bg-[#1A1A1A] rounded" style={{ width: `${85 - i * 10}%` }} />
              ))}
            </div>
          ) : briefing ? (
            <div className="space-y-3">
              <div className="border-l-2 border-[#00C853] pl-3">
                <p className="text-[11px] text-[#888] leading-relaxed">{briefing.overallMood}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#111] border border-[#1A1A1A] p-3">
                  <p className="text-[9px] text-[#00C853] font-mono tracking-widest mb-1">TOP OPPORTUNITY</p>
                  <p className="text-[11px] text-[#888]">{briefing.topOpportunity}</p>
                </div>
                <div className="bg-[#111] border border-[#FF4444]/10 p-3">
                  <p className="text-[9px] text-[#FF4444] font-mono tracking-widest mb-1">KEY RISK</p>
                  <p className="text-[11px] text-[#888]">{briefing.topRisk}</p>
                </div>
              </div>
              <div className="border-l-2 border-[#FF8C00] pl-3">
                <p className="text-[9px] text-[#FF8C00] font-mono tracking-widest mb-1">MARKET PHASE</p>
                <p className="text-[11px] text-[#888]">{briefing.marketPhase}</p>
              </div>
            </div>
          ) : (
            <div className="border-l-2 border-[#00C853] pl-3">
              <p className="text-[11px] text-[#555] font-mono italic">Loading AI briefing...</p>
            </div>
          )}
        </div>
      </div>

      {/* Instrument selector */}
      <div className="border border-[#1A1A1A] bg-[#0D0D0D]">
        <div className="px-4 py-2.5 border-b border-[#1A1A1A]">
          <span className="text-[10px] text-[#00C853] tracking-widest font-mono">SELECT INSTRUMENT</span>
        </div>
        <div className="flex overflow-x-auto">
          {INSTRUMENTS.map((inst) => {
            const d = data.find((x) => x.instrument === inst)
            const isSelected = selected === inst
            return (
              <button
                key={inst}
                onClick={() => setSelected(inst)}
                className={`flex-shrink-0 px-4 py-3 border-b-2 transition-colors text-center min-w-[90px] ${
                  isSelected
                    ? "border-[#00C853] bg-[#00C853]/5"
                    : "border-transparent hover:bg-[#111]"
                }`}
              >
                <div className={`text-xs font-bold font-mono ${isSelected ? "text-white" : "text-[#555]"}`}>{inst}</div>
                {d && (
                  <div className={`text-[9px] font-mono mt-0.5 ${sentimentColor(d.sentiment)}`}>
                    {d.sentiment}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail panel */}
      {current && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sentiment + positioning */}
          <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-[#00C853] tracking-widest font-mono">SENTIMENT — {current.instrument}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 border font-mono ${sentimentBg(current.sentiment)}`}>
                {current.sentiment}
              </span>
            </div>

            {/* Score bar */}
            <div className="mb-5">
              <div className="flex justify-between text-[10px] font-mono mb-1.5">
                <span className="text-[#00C853]">FEAR</span>
                <span className="text-[#888]">Score: {current.score}</span>
                <span className="text-[#FF4444]">GREED</span>
              </div>
              <div className="h-3 bg-[#111] border border-[#1A1A1A] relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full transition-all"
                  style={{
                    width: `${current.score}%`,
                    background: `linear-gradient(to right, #00C853, #FF8C00, #FF4444)`,
                  }}
                />
                <div
                  className="absolute top-0 h-full w-0.5 bg-white/30"
                  style={{ left: `${current.score}%` }}
                />
              </div>
            </div>

            {/* Retail positioning */}
            <div className="mb-4">
              <p className="text-[10px] text-[#333] font-mono tracking-widest mb-2">RETAIL POSITIONING</p>
              <div className="flex h-6 overflow-hidden border border-[#1A1A1A]">
                <div
                  className="h-full bg-[#00C853] flex items-center justify-center text-[10px] font-bold text-black font-mono transition-all"
                  style={{ width: `${current.retailLong}%` }}
                >
                  {current.retailLong > 20 ? `${current.retailLong}% LONG` : ""}
                </div>
                <div
                  className="h-full bg-[#FF4444] flex items-center justify-center text-[10px] font-bold text-white font-mono transition-all"
                  style={{ width: `${current.retailShort}%` }}
                >
                  {current.retailShort > 20 ? `${current.retailShort}% SHORT` : ""}
                </div>
              </div>
            </div>

            {/* Trend */}
            <div className="flex items-center justify-between border-t border-[#1A1A1A] pt-3">
              <span className="text-[10px] text-[#333] font-mono tracking-wider">TREND BIAS</span>
              <span className={`text-sm font-bold font-mono ${
                current.trend === "BULLISH" ? "text-[#00C853]" :
                current.trend === "BEARISH" ? "text-[#FF4444]" : "text-[#888]"
              }`}>{current.trend}</span>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
            <span className="text-[10px] text-[#00C853] tracking-widest font-mono block mb-4">
              AI ANALYSIS — {current.instrument}
            </span>

            {/* Key levels */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#111] border border-[#1A1A1A] p-3">
                <p className="text-[9px] text-[#00C853] font-mono tracking-widest mb-1">SUPPORT</p>
                <p className="text-base font-bold font-mono">{current.keyLevels.support}</p>
              </div>
              <div className="bg-[#111] border border-[#1A1A1A] p-3">
                <p className="text-[9px] text-[#FF4444] font-mono tracking-widest mb-1">RESISTANCE</p>
                <p className="text-base font-bold font-mono">{current.keyLevels.resistance}</p>
              </div>
            </div>

            {/* Bias */}
            <div className="border-l-2 border-[#00C853] pl-3 mb-4">
              <p className="text-[9px] text-[#333] font-mono tracking-widest mb-1">SMART MONEY BIAS</p>
              <p className="text-[12px] text-[#888] leading-relaxed">{current.biasStatement}</p>
            </div>

            {/* Retail traps */}
            <div>
              <p className="text-[9px] text-[#FF4444] font-mono tracking-widest mb-2">⚠ RETAIL TRAPS TO AVOID</p>
              <div className="space-y-1.5">
                {current.traps.map((trap, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px]">
                    <span className="text-[#FF4444] mt-0.5 shrink-0 text-[10px]">▶</span>
                    <span className="text-[#555]">{trap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All instruments overview table */}
      <div className="border border-[#1A1A1A] bg-[#0D0D0D]">
        <div className="px-4 py-3 border-b border-[#1A1A1A]">
          <span className="text-[10px] text-[#00C853] tracking-widest font-mono">ALL INSTRUMENTS OVERVIEW</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {["INSTRUMENT", "SENTIMENT", "SCORE", "RETAIL LONG", "RETAIL SHORT", "TREND"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] text-[#333] tracking-wider font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {data.map((d) => (
                <tr
                  key={d.instrument}
                  onClick={() => setSelected(d.instrument)}
                  className={`cursor-pointer transition-colors hover:bg-[#111] ${selected === d.instrument ? "bg-[#00C853]/5" : ""}`}
                >
                  <td className="px-4 py-3 font-bold text-white">{d.instrument}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-1.5 py-0.5 border ${sentimentBg(d.sentiment)}`}>
                      {d.sentiment}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#1A1A1A]">
                        <div className="h-full bg-[#00C853]" style={{ width: `${d.score}%` }} />
                      </div>
                      <span className="text-[#555]">{d.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#00C853]">{d.retailLong}%</td>
                  <td className="px-4 py-3 text-[#FF4444]">{d.retailShort}%</td>
                  <td className={`px-4 py-3 font-bold ${
                    d.trend === "BULLISH" ? "text-[#00C853]" :
                    d.trend === "BEARISH" ? "text-[#FF4444]" : "text-[#888]"
                  }`}>{d.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
