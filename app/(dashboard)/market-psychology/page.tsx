// app/market-psychology/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"

const INSTRUMENTS = ["XAUUSD", "EURUSD", "GBPUSD", "NAS100", "US500", "BTCUSD", "USDJPY", "WTI"]

interface PsychData {
  instrument: string
  sentiment: "GREED" | "FEAR" | "NEUTRAL" | "EXTREME GREED" | "EXTREME FEAR"
  score: number
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

const sentimentBg = (s: string) => {
  if (s.includes("EXTREME GREED")) return "bg-[#FF4444]/10 border-[#FF4444]/20 text-[#FF4444]"
  if (s.includes("GREED"))         return "bg-[#FF8C00]/10 border-[#FF8C00]/20 text-[#FF8C00]"
  if (s.includes("EXTREME FEAR"))  return "bg-[#FF6600]/10 border-[#FF6600]/20 text-[#FF6600]"
  if (s.includes("FEAR"))          return "bg-[#FF6600]/10 border-[#FF6600]/20 text-[#FF9955]"
  return "bg-[#555]/10 border-[#555]/20 text-[#888]"
}

const sentimentTextColor = (s: string) => {
  if (s.includes("EXTREME GREED")) return "text-[#FF4444]"
  if (s.includes("GREED"))         return "text-[#FF8C00]"
  if (s.includes("EXTREME FEAR"))  return "text-[#FF6600]"
  if (s.includes("FEAR"))          return "text-[#FF9955]"
  return "text-[#888]"
}

const trendColor = (t: string) =>
  t === "BULLISH" ? "text-[#FF6600]" : t === "BEARISH" ? "text-[#FF4444]" : "text-[#888]"

const SEED_DATA: PsychData[] = [
  { instrument: "XAUUSD", sentiment: "GREED", score: 68, retailLong: 72, retailShort: 28, trend: "BULLISH",
    keyLevels: { support: "3310.00", resistance: "3365.00" },
    biasStatement: "Retail heavily long — institutional likely to fade the move near resistance.",
    traps: ["Chasing breakouts above 3360", "Holding longs into NFP"], updatedAt: "Live" },
  { instrument: "EURUSD", sentiment: "NEUTRAL", score: 51, retailLong: 54, retailShort: 46, trend: "RANGING",
    keyLevels: { support: "1.1280", resistance: "1.1400" },
    biasStatement: "Balanced positioning — market awaiting macro catalyst.",
    traps: ["Trading inside range without confirmation"], updatedAt: "Live" },
  { instrument: "GBPUSD", sentiment: "FEAR", score: 34, retailLong: 38, retailShort: 62, trend: "BEARISH",
    keyLevels: { support: "1.3140", resistance: "1.3280" },
    biasStatement: "Retail short-heavy — watch for short squeeze above 1.3280.",
    traps: ["Shorting into oversold conditions", "Ignoring BOE event risk"], updatedAt: "Live" },
  { instrument: "NAS100", sentiment: "GREED", score: 71, retailLong: 68, retailShort: 32, trend: "BULLISH",
    keyLevels: { support: "19500", resistance: "20100" },
    biasStatement: "Strong bullish retail bias post earnings. Smart money accumulating dips.",
    traps: ["FOMO entries at highs", "Ignoring Fed rate risk"], updatedAt: "Live" },
  { instrument: "BTCUSD", sentiment: "EXTREME GREED", score: 84, retailLong: 81, retailShort: 19, trend: "BULLISH",
    keyLevels: { support: "90000", resistance: "98000" },
    biasStatement: "Extreme greed — historically precedes sharp corrections.",
    traps: ["Over-leveraging spot positions", "Ignoring whale wallet outflows"], updatedAt: "Live" },
  { instrument: "US500", sentiment: "GREED", score: 63, retailLong: 65, retailShort: 35, trend: "BULLISH",
    keyLevels: { support: "5420", resistance: "5600" },
    biasStatement: "Moderate greed. Earnings season driving retail FOMO.",
    traps: ["Buying breakouts without volume confirmation"], updatedAt: "Live" },
  { instrument: "USDJPY", sentiment: "FEAR", score: 38, retailLong: 42, retailShort: 58, trend: "BEARISH",
    keyLevels: { support: "140.00", resistance: "144.50" },
    biasStatement: "BOJ intervention fears keeping retail cautious.",
    traps: ["Holding yen shorts near key levels", "Ignoring Japanese CPI"], updatedAt: "Live" },
  { instrument: "WTI", sentiment: "NEUTRAL", score: 48, retailLong: 50, retailShort: 50, trend: "RANGING",
    keyLevels: { support: "76.00", resistance: "83.00" },
    biasStatement: "Balanced — OPEC+ headline risk keeping traders cautious.",
    traps: ["Trading without EIA inventory context"], updatedAt: "Live" },
]

export default function MarketPsychologyPage() {
  const [selected, setSelected] = useState("XAUUSD")
  const [data, setData] = useState<PsychData[]>(SEED_DATA)
  const [briefing, setBriefing] = useState<AIBriefing | null>(null)
  const [loadingBriefing, setLoadingBriefing] = useState(false)
  const [loadingPsych, setLoadingPsych] = useState(false)
  const [lastRefresh, setLastRefresh] = useState("")

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
    } catch (e) { console.error(e) }
    finally { setLoadingBriefing(false) }
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
      if (json.data && Array.isArray(json.data)) setData(json.data)
      setLastRefresh(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }))
    } catch (e) {
      console.error(e)
      setLastRefresh(new Date().toLocaleTimeString())
    } finally { setLoadingPsych(false) }
  }, [])

  useEffect(() => {
    fetchAIBriefing()
    fetchPsychData()
  }, [fetchAIBriefing, fetchPsychData])

  const fgIndex = briefing?.fearGreedIndex ?? 62
  const fgColor = fgIndex > 75 ? "#FF4444" : fgIndex > 55 ? "#FF8C00" : fgIndex < 25 ? "#FF6600" : fgIndex < 45 ? "#FF9955" : "#888"
  const fgLabel = fgIndex > 75 ? "EXTREME GREED" : fgIndex > 55 ? "GREED" : fgIndex < 25 ? "EXTREME FEAR" : fgIndex < 45 ? "FEAR" : "NEUTRAL"

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* ─── Scrollable container ─── */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 space-y-3 sm:space-y-4 overflow-x-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between border border-[#1A1A1A] bg-[#0D0D0D] px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] text-[#333] font-mono tracking-widest truncate">CLAUDE'S NEURAL NETWORK</p>
            <p className="text-sm sm:text-base font-bold">MARKET PSYCHOLOGY</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {lastRefresh && (
              <span className="text-[9px] text-[#333] font-mono hidden sm:block">UPDATED {lastRefresh}</span>
            )}
            <button
              onClick={() => { fetchAIBriefing(); fetchPsychData() }}
              disabled={loadingBriefing || loadingPsych}
              className="text-[10px] border border-[#1A1A1A] hover:border-[#FF6600]/30 text-[#444] hover:text-[#FF6600] px-2.5 sm:px-3 py-1.5 font-mono tracking-widest transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {loadingPsych ? "..." : "↻ REFRESH"}
            </button>
          </div>
        </div>

        {/* Fear & Greed + AI Briefing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">

          {/* Fear & Greed Gauge */}
          <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 sm:p-5 flex flex-row sm:flex-col items-center gap-4 sm:gap-0 sm:justify-center">
            <div className="shrink-0">
              <span className="text-[9px] sm:text-[10px] text-[#FF6600] tracking-widest font-mono block mb-2 sm:mb-4">F&G INDEX</span>
              <div className="relative w-20 h-20 sm:w-28 sm:h-28">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#1A1A1A" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke={fgColor} strokeWidth="10"
                    strokeDasharray={`${(fgIndex / 100) * 314} 314`} strokeLinecap="butt" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl sm:text-3xl font-bold leading-none" style={{ color: fgColor }}>{fgIndex}</span>
                  <span className="text-[8px] sm:text-[9px] font-mono text-[#444] mt-0.5">/ 100</span>
                </div>
              </div>
            </div>
            <div className="flex-1 sm:flex-none sm:text-center sm:mt-3">
              <span className="text-xs sm:text-sm font-bold font-mono block" style={{ color: fgColor }}>{fgLabel}</span>
              <p className="text-[9px] sm:text-[10px] text-[#333] font-mono mt-0.5">COMPOSITE INDEX</p>
            </div>
          </div>

          {/* AI Briefing */}
          <div className="sm:col-span-2 border border-[#1A1A1A] bg-[#0D0D0D] p-4 sm:p-5">
            <span className="text-[9px] sm:text-[10px] text-[#FF6600] tracking-widest font-mono block mb-3 sm:mb-4">AI PSYCHOLOGY BRIEFING</span>
            {loadingBriefing ? (
              <div className="space-y-2 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-2.5 bg-[#1A1A1A] rounded" style={{ width: `${85 - i * 10}%` }} />
                ))}
              </div>
            ) : briefing ? (
              <div className="space-y-2.5 sm:space-y-3">
                <div className="border-l-2 border-[#FF6600] pl-2.5 sm:pl-3">
                  <p className="text-[11px] sm:text-[12px] text-[#888] leading-relaxed">{briefing.overallMood}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-[#111] border border-[#1A1A1A] p-2.5 sm:p-3">
                    <p className="text-[8px] sm:text-[9px] text-[#FF6600] font-mono tracking-widest mb-1">OPPORTUNITY</p>
                    <p className="text-[10px] sm:text-[11px] text-[#888] leading-snug">{briefing.topOpportunity}</p>
                  </div>
                  <div className="bg-[#111] border border-[#FF4444]/10 p-2.5 sm:p-3">
                    <p className="text-[8px] sm:text-[9px] text-[#FF4444] font-mono tracking-widest mb-1">KEY RISK</p>
                    <p className="text-[10px] sm:text-[11px] text-[#888] leading-snug">{briefing.topRisk}</p>
                  </div>
                </div>
                <div className="border-l-2 border-[#FF8C00] pl-2.5 sm:pl-3">
                  <p className="text-[8px] sm:text-[9px] text-[#FF8C00] font-mono tracking-widest mb-0.5">MARKET PHASE</p>
                  <p className="text-[10px] sm:text-[11px] text-[#888]">{briefing.marketPhase}</p>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-[#444] font-mono italic">Loading AI briefing...</p>
            )}
          </div>
        </div>

        {/* Instrument selector — horizontal scroll on mobile */}
        <div className="border border-[#1A1A1A] bg-[#0D0D0D]">
          <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-b border-[#1A1A1A]">
            <span className="text-[9px] sm:text-[10px] text-[#FF6600] tracking-widest font-mono">SELECT INSTRUMENT</span>
          </div>
          {/* overflow-x-auto with hidden scrollbar on mobile */}
          <div className="flex overflow-x-auto scrollbar-hide">
            {INSTRUMENTS.map((inst) => {
              const d = data.find((x) => x.instrument === inst)
              const isSelected = selected === inst
              return (
                <button
                  key={inst}
                  onClick={() => setSelected(inst)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 transition-colors text-center min-w-[72px] sm:min-w-[90px] ${
                    isSelected ? "border-[#FF6600] bg-[#FF6600]/5" : "border-transparent hover:bg-[#111]"
                  }`}
                >
                  <div className={`text-[10px] sm:text-xs font-bold font-mono ${isSelected ? "text-white" : "text-[#555]"}`}>
                    {inst}
                  </div>
                  {d && (
                    <div className={`text-[8px] sm:text-[9px] font-mono mt-0.5 ${sentimentTextColor(d.sentiment)}`}>
                      {d.sentiment}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Detail panel — stacks to single column on mobile */}
        {current && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

            {/* Sentiment + Positioning */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-[9px] sm:text-[10px] text-[#FF6600] tracking-widest font-mono">
                  SENTIMENT — {current.instrument}
                </span>
                <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 border font-mono ${sentimentBg(current.sentiment)}`}>
                  {current.sentiment}
                </span>
              </div>

              {/* Score bar */}
              <div className="mb-4 sm:mb-5">
                <div className="flex justify-between text-[9px] sm:text-[10px] font-mono mb-1.5">
                  <span className="text-[#FF9955]">FEAR</span>
                  <span className="text-[#888]">Score: {current.score}</span>
                  <span className="text-[#FF4444]">GREED</span>
                </div>
                <div className="h-2.5 sm:h-3 bg-[#111] border border-[#1A1A1A] relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full transition-all"
                    style={{
                      width: `${current.score}%`,
                      background: "linear-gradient(to right, #FF9955, #FF8C00, #FF4444)",
                    }}
                  />
                  <div className="absolute top-0 h-full w-0.5 bg-white/20" style={{ left: `${current.score}%` }} />
                </div>
              </div>

              {/* Retail positioning bar */}
              <div className="mb-3 sm:mb-4">
                <p className="text-[8px] sm:text-[9px] text-[#333] font-mono tracking-widest mb-1.5">RETAIL POSITIONING</p>
                <div className="flex h-5 sm:h-6 overflow-hidden border border-[#1A1A1A]">
                  <div
                    className="h-full bg-[#FF6600] flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-white font-mono transition-all"
                    style={{ width: `${current.retailLong}%` }}
                  >
                    {current.retailLong > 25 ? `${current.retailLong}%` : ""}
                  </div>
                  <div
                    className="h-full bg-[#FF4444] flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-white font-mono transition-all"
                    style={{ width: `${current.retailShort}%` }}
                  >
                    {current.retailShort > 25 ? `${current.retailShort}%` : ""}
                  </div>
                </div>
                <div className="flex justify-between text-[8px] sm:text-[9px] font-mono mt-1 text-[#333]">
                  <span className="text-[#FF6600]">LONG {current.retailLong}%</span>
                  <span className="text-[#FF4444]">SHORT {current.retailShort}%</span>
                </div>
              </div>

              {/* Trend */}
              <div className="flex items-center justify-between border-t border-[#1A1A1A] pt-2.5 sm:pt-3">
                <span className="text-[9px] sm:text-[10px] text-[#333] font-mono tracking-wider">TREND BIAS</span>
                <span className={`text-sm sm:text-base font-bold font-mono ${trendColor(current.trend)}`}>
                  {current.trend}
                </span>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 sm:p-5">
              <span className="text-[9px] sm:text-[10px] text-[#FF6600] tracking-widest font-mono block mb-3 sm:mb-4">
                AI ANALYSIS — {current.instrument}
              </span>

              {/* Key levels */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="bg-[#111] border border-[#1A1A1A] p-2.5 sm:p-3">
                  <p className="text-[8px] sm:text-[9px] text-[#FF6600] font-mono tracking-widest mb-0.5 sm:mb-1">SUPPORT</p>
                  <p className="text-sm sm:text-base font-bold font-mono">{current.keyLevels.support}</p>
                </div>
                <div className="bg-[#111] border border-[#1A1A1A] p-2.5 sm:p-3">
                  <p className="text-[8px] sm:text-[9px] text-[#FF4444] font-mono tracking-widest mb-0.5 sm:mb-1">RESISTANCE</p>
                  <p className="text-sm sm:text-base font-bold font-mono">{current.keyLevels.resistance}</p>
                </div>
              </div>

              {/* Bias statement */}
              <div className="border-l-2 border-[#FF6600] pl-2.5 sm:pl-3 mb-3 sm:mb-4">
                <p className="text-[8px] sm:text-[9px] text-[#333] font-mono tracking-widest mb-1">SMART MONEY BIAS</p>
                <p className="text-[11px] sm:text-[12px] text-[#888] leading-relaxed">{current.biasStatement}</p>
              </div>

              {/* Traps */}
              <div>
                <p className="text-[8px] sm:text-[9px] text-[#FF4444] font-mono tracking-widest mb-1.5 sm:mb-2">⚠ RETAIL TRAPS</p>
                <div className="space-y-1.5">
                  {current.traps.map((trap, i) => (
                    <div key={i} className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-[11px]">
                      <span className="text-[#FF4444] mt-0.5 shrink-0 text-[9px] sm:text-[10px]">▶</span>
                      <span className="text-[#555]">{trap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overview table — horizontally scrollable on mobile */}
        <div className="border border-[#1A1A1A] bg-[#0D0D0D]">
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-[#1A1A1A]">
            <span className="text-[9px] sm:text-[10px] text-[#FF6600] tracking-widest font-mono">ALL INSTRUMENTS OVERVIEW</span>
          </div>
          {/* Scrollable horizontally on mobile */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono min-w-[520px]">
              <thead>
                <tr className="border-b border-[#1A1A1A]">
                  {["INSTRUMENT", "SENTIMENT", "SCORE", "LONG", "SHORT", "TREND"].map((h) => (
                    <th key={h} className="px-3 sm:px-4 py-2 sm:py-2.5 text-left text-[9px] sm:text-[10px] text-[#333] tracking-wider font-normal whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {data.map((d) => (
                  <tr
                    key={d.instrument}
                    onClick={() => setSelected(d.instrument)}
                    className={`cursor-pointer transition-colors hover:bg-[#111] ${selected === d.instrument ? "bg-[#FF6600]/5" : ""}`}
                  >
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3 font-bold text-white text-[11px] sm:text-xs whitespace-nowrap">
                      {d.instrument}
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">
                      <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 border ${sentimentBg(d.sentiment)}`}>
                        {d.sentiment}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-10 sm:w-16 h-1.5 bg-[#1A1A1A]">
                          <div className="h-full bg-[#FF6600]" style={{ width: `${d.score}%` }} />
                        </div>
                        <span className="text-[#555] text-[10px] sm:text-xs">{d.score}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-[#FF6600] text-[10px] sm:text-xs">{d.retailLong}%</td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-[#FF4444] text-[10px] sm:text-xs">{d.retailShort}%</td>
                    <td className={`px-3 sm:px-4 py-2.5 sm:py-3 font-bold text-[10px] sm:text-xs ${trendColor(d.trend)}`}>
                      {d.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
