"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Calendar,
  Newspaper,
  Target,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Activity,
} from "lucide-react"

interface DailyIntelligence {
  date: string
  market_sentiment: {
    overall: "Bullish" | "Bearish" | "Neutral" | "Mixed"
    score: number
    summary: string
    key_drivers: string[]
  }
  ai_tip_of_day: {
    title: string
    content: string
    category: string
  }
  top_setups: Array<{
    pair: string
    direction: "Long" | "Short"
    bias: string
    key_level: string
    risk: "Low" | "Medium" | "High"
  }>
  economic_highlights: Array<{
    event: string
    time: string
    impact: "High" | "Medium" | "Low"
    expectation: string
  }>
  news_summary: {
    headline: string
    summary: string
    watch_out: string
  }
  generated_at: string
  is_fallback?: boolean
}

function SentimentIcon({ sentiment }: { sentiment: string }) {
  if (sentiment === "Bullish") return <TrendingUp className="w-5 h-5 text-green-400" />
  if (sentiment === "Bearish") return <TrendingDown className="w-5 h-5 text-red-400" />
  return <Minus className="w-5 h-5 text-yellow-400" />
}

function SentimentColor(sentiment: string) {
  if (sentiment === "Bullish") return { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" }
  if (sentiment === "Bearish") return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" }
  return { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" }
}

function RiskBadge({ risk }: { risk: string }) {
  const colors = risk === "Low" ? "bg-green-500/10 text-green-400 border-green-500/20"
    : risk === "High" ? "bg-red-500/10 text-red-400 border-red-500/20"
    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
  return <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colors}`}>{risk}</span>
}

function ImpactDot({ impact }: { impact: string }) {
  const color = impact === "High" ? "bg-red-400" : impact === "Medium" ? "bg-yellow-400" : "bg-green-400"
  return <span className={`w-2 h-2 rounded-full ${color} flex-shrink-0`} />
}

export default function DailyIntelligenceWidget() {
  const [data, setData] = useState<DailyIntelligence | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch("/api/daily-intelligence")
      if (!res.ok) throw new Error("Failed to fetch")
      const json = await res.json()
      setData(json)
      setLastUpdated(new Date())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/3 rounded-2xl border border-white/6 p-5 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
            <div className="h-3 bg-white/5 rounded w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 text-center">
        <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
        <p className="text-red-400 text-sm font-medium mb-3">Failed to load daily intelligence</p>
        <button onClick={fetchData} className="text-xs text-gray-400 underline">Try again</button>
      </div>
    )
  }

  const sentColors = SentimentColor(data.market_sentiment.overall)

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-green-400" />
          <span className="text-sm font-semibold text-white">AI Daily Intelligence</span>
          {data.is_fallback && (
            <span className="text-xs text-gray-600 font-mono">(cached)</span>
          )}
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Refresh"}
        </button>
      </div>

      {/* Market Sentiment */}
      <div className={`${sentColors.bg} border ${sentColors.border} rounded-2xl p-5`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Market Sentiment</p>
            <div className="flex items-center gap-2">
              <SentimentIcon sentiment={data.market_sentiment.overall} />
              <span className={`text-xl font-bold ${sentColors.text}`}>{data.market_sentiment.overall}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Score</p>
            <div className="flex items-center gap-1">
              <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${data.market_sentiment.score >= 7 ? "bg-green-400" : data.market_sentiment.score <= 3 ? "bg-red-400" : "bg-yellow-400"}`}
                  style={{ width: `${data.market_sentiment.score * 10}%` }}
                />
              </div>
              <span className={`text-sm font-bold ${sentColors.text}`}>{data.market_sentiment.score}/10</span>
            </div>
          </div>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed mb-3">{data.market_sentiment.summary}</p>
        <div className="flex flex-wrap gap-2">
          {data.market_sentiment.key_drivers.map((driver, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
              {driver}
            </span>
          ))}
        </div>
      </div>

      {/* AI Tip of the Day */}
      <div className="bg-[#141414] border border-white/8 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-purple-400" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Tip of the Day</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">{data.ai_tip_of_day.category}</span>
        </div>
        <h3 className="font-bold text-base text-white mb-2">{data.ai_tip_of_day.title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{data.ai_tip_of_day.content}</p>
      </div>

      {/* Top Setups */}
      <div className="bg-[#141414] border border-white/8 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-blue-400" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Top Setups Today</p>
        </div>
        <div className="space-y-3">
          {data.top_setups.map((setup, i) => (
            <div key={i} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
              <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0 ${setup.direction === "Long" ? "bg-green-500/15 text-green-400 border border-green-500/25" : "bg-red-500/15 text-red-400 border border-red-500/25"}`}>
                {setup.direction === "Long" ? "▲" : "▼"} {setup.direction}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-white font-mono">{setup.pair}</span>
                  <div className="flex items-center gap-2">
                    <RiskBadge risk={setup.risk} />
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{setup.bias}</p>
                <p className="text-gray-600 text-xs mt-0.5">Key level: <span className="text-gray-400 font-mono">{setup.key_level}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Economic Highlights */}
      <div className="bg-[#141414] border border-white/8 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-orange-400" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Economic Calendar</p>
        </div>
        <div className="space-y-3">
          {data.economic_highlights.map((event, i) => (
            <div key={i} className="flex items-start gap-3">
              <ImpactDot impact={event.impact} />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-white">{event.event}</span>
                  <span className="text-xs text-gray-500 font-mono flex-shrink-0">{event.time}</span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">{event.expectation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News Summary */}
      <div className="bg-[#141414] border border-white/8 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Newspaper className="w-4 h-4 text-teal-400" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Market News</p>
        </div>
        <h3 className="font-bold text-sm text-white mb-2">{data.news_summary.headline}</h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-3">{data.news_summary.summary}</p>
        <div className="flex items-start gap-2 bg-yellow-500/5 border border-yellow-500/15 rounded-xl p-3">
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-300/80 text-xs leading-relaxed">{data.news_summary.watch_out}</p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-600 font-mono pb-2">
        AI-generated analysis · Updates daily · Not financial advice
      </p>
    </div>
  )
}
