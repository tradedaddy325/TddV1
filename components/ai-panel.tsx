"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Send,
  Brain,
  Newspaper,
  BarChart3,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Signal {
  sym: string
  name: string
  exchange: string
  signal: "BUY" | "SELL" | "HOLD" | "WATCH"
  confidence: number
  timeframe: string
  thesis: string
  entry: string
  target: string
  stop: string
  riskReward: string
}

interface NewsItem {
  id: string
  headline: string
  summary: string
  source: string
  time: string
  sentiment: "bullish" | "bearish" | "neutral"
  sentimentScore: number
  impact: "HIGH" | "MED" | "LOW"
  category: string
  assets: string[]
  actionable: string
}

interface MacroData {
  headline: string
  summary: string
  sarb: { rate: string; outlook: string; lastMeeting: string }
  rand: { usdZar: string; trend: string; driver: string }
  globalRisk: string
  keyWatch: string[]
  traderImplication: string
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

// ─── Claude API caller ────────────────────────────────────────────────────────

async function callClaude(
  system: string,
  userMessage: string,
  history: ChatMessage[] = []
): Promise<string> {
  const messages = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: userMessage },
  ]

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system,
      messages,
    }),
  })

  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  return data.content?.map((c: { text?: string }) => c.text ?? "").join("") ?? ""
}

// ─── Shared prompts ───────────────────────────────────────────────────────────

const today = new Date().toLocaleDateString("en-ZA", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Africa/Johannesburg",
})

const SIGNALS_SYSTEM = `You are a professional quantitative trading analyst providing daily signals for a Bloomberg-style trade terminal used by South African traders. Today is ${today} (SAST).

Generate exactly 5 trading signals covering a mix of: JSE-listed stocks, US equities, forex pairs (ZAR pairs included), commodities, and crypto.

Respond ONLY with a valid JSON array. No markdown, no explanation, no preamble.

Each signal object must have exactly these fields:
- sym: ticker symbol (string)
- name: full asset name (string)
- exchange: e.g. "JSE", "NYSE", "NASDAQ", "FOREX", "CRYPTO" (string)
- signal: "BUY" | "SELL" | "HOLD" | "WATCH" (string)
- confidence: integer 50-95 (number)
- timeframe: "Intraday" | "Swing" | "Position" (string)
- thesis: one sentence max 15 words (string)
- entry: realistic price with currency symbol (string)
- target: realistic price with currency symbol (string)
- stop: realistic price with currency symbol (string)
- riskReward: ratio string e.g. "1:2.5" (string)`

const NEWS_SYSTEM = `You are a financial news intelligence analyst for a South African trade terminal. Today is ${today} SAST.

Generate 8 realistic, market-moving financial news items relevant to South African and global traders. Include JSE news, SA macro, global market news, and commodity/forex news.

Respond ONLY with a valid JSON array. No markdown, no preamble.

Each news item must have exactly:
- id: unique string e.g. "news_1" (string)
- headline: concise headline max 12 words (string)
- summary: 1-2 sentence detail (string)
- source: e.g. "BusinessDay", "Bloomberg", "Reuters", "CNBC Africa", "Moneyweb" (string)
- time: e.g. "12m ago", "1h ago", "3h ago" (string)
- sentiment: "bullish" | "bearish" | "neutral" (string)
- sentimentScore: number -1.0 to 1.0 (number)
- impact: "HIGH" | "MED" | "LOW" (string)
- category: "JSE" | "FOREX" | "COMMODITIES" | "MACRO" | "CRYPTO" | "GLOBAL" (string)
- assets: array of 1-3 affected ticker strings (array)
- actionable: one sentence trading implication max 12 words (string)`

const MACRO_SYSTEM = `You are a senior macro analyst at a South African investment bank. Today is ${today}.

Provide a daily macro briefing for traders. Be specific with realistic data points.

Respond ONLY with a valid JSON object. No markdown, no preamble.

The object must have exactly:
- headline: 8-word macro theme for the day (string)
- summary: 3-sentence macro commentary covering SA and global context (string)
- sarb: object with rate (string like "8.25%"), outlook (string), lastMeeting (string)
- rand: object with usdZar (string), trend ("strengthening"|"weakening"|"stable"), driver (string max 8 words)
- globalRisk: "Risk-On" | "Risk-Off" | "Neutral" (string)
- keyWatch: array of 3 strings — events/data to watch today (array)
- traderImplication: one actionable sentence max 15 words (string)`

const RESEARCH_SYSTEM = `You are an elite AI trading analyst embedded in TradeDaddy — a Bloomberg-style trade terminal used by South African traders. Today is ${today} SAST.

Provide sharp, actionable market intelligence. Cover JSE stocks, SA macro, global markets, forex (ZAR pairs), commodities, and crypto. Give specific price levels, percentages, and catalysts. Be concise and data-driven.

When giving trade setups always include entry, target, stop loss, and risk/reward. Consider SA-specific context: SARB policy, rand strength, load shedding impacts, commodity exposure.`

// ─── UI Helpers ───────────────────────────────────────────────────────────────

function SignalBadge({ signal }: { signal: Signal["signal"] }) {
  const styles = {
    BUY: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    SELL: "bg-red-500/10 text-red-400 border-red-500/20",
    HOLD: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    WATCH: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  }
  return (
    <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-xs font-bold border tracking-wide", styles[signal])}>
      {signal}
    </span>
  )
}

function SentimentBadge({ sentiment }: { sentiment: NewsItem["sentiment"] }) {
  const styles = {
    bullish: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    bearish: "bg-red-500/10 text-red-400 border-red-500/20",
    neutral: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  }
  return (
    <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold border", styles[sentiment])}>
      {sentiment}
    </span>
  )
}

function ImpactDot({ impact }: { impact: "HIGH" | "MED" | "LOW" }) {
  return (
    <span className={cn("text-xs font-bold", { "text-red-400": impact === "HIGH", "text-amber-400": impact === "MED", "text-zinc-500": impact === "LOW" })}>
      {impact}
    </span>
  )
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 80 ? "bg-emerald-500" : value >= 65 ? "bg-amber-500" : "bg-red-500"
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded-full bg-zinc-800">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-zinc-400">{value}%</span>
    </div>
  )
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2 animate-pulse">
          <div className="h-3 bg-zinc-800 rounded w-3/4" />
          <div className="h-3 bg-zinc-800 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

// ─── Signals Tab ──────────────────────────────────────────────────────────────

function SignalsTab() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(false)
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)
  const [error, setError] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      const text = await callClaude(SIGNALS_SYSTEM, "Generate 5 AI trading signals for today.")
      const clean = text.replace(/```json|```/g, "").trim()
      setSignals(JSON.parse(clean))
      setGeneratedAt(new Date().toISOString())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">
          {generatedAt ? `Generated ${new Date(generatedAt).toLocaleTimeString("en-ZA")}` : "AI-powered daily trade signals"}
        </p>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="h-7 text-xs gap-1">
          <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {loading && <Skeleton rows={5} />}
      {error && <p className="text-sm text-red-400 p-4">Failed to load signals. Check your Anthropic API key.</p>}

      {signals.map((s, i) => (
        <Card key={i} className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sky-400 text-sm">{s.sym}</span>
                  <SignalBadge signal={s.signal} />
                  <Badge variant="outline" className="text-xs h-5 px-1.5 text-zinc-500">{s.exchange}</Badge>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{s.name}</p>
              </div>
              <div className="text-right shrink-0">
                <ConfidenceBar value={s.confidence} />
                <p className="text-xs text-zinc-600 mt-1">{s.timeframe}</p>
              </div>
            </div>
            <p className="text-xs text-zinc-300 italic">"{s.thesis}"</p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { label: "Entry", value: s.entry, color: "text-zinc-300" },
                { label: "Target", value: s.target, color: "text-emerald-400" },
                { label: "Stop", value: s.stop, color: "text-red-400" },
              ].map((item) => (
                <div key={item.label} className="bg-zinc-800/50 rounded p-1.5 text-center">
                  <p className="text-xs text-zinc-600">{item.label}</p>
                  <p className={cn("text-xs font-mono font-semibold", item.color)}>{item.value}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-600">R/R {s.riskReward}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ─── News Tab ─────────────────────────────────────────────────────────────────

function NewsTab() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [marketMood, setMarketMood] = useState<string | null>(null)
  const [avgScore, setAvgScore] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      const text = await callClaude(NEWS_SYSTEM, "Generate 8 current market-moving financial news items with sentiment analysis.")
      const clean = text.replace(/```json|```/g, "").trim()
      const items: NewsItem[] = JSON.parse(clean)
      setNews(items)
      const avg = items.reduce((s, i) => s + i.sentimentScore, 0) / items.length
      setAvgScore(Math.round(avg * 100) / 100)
      setMarketMood(avg > 0.2 ? "Risk-On" : avg < -0.2 ? "Risk-Off" : "Neutral")
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const moodColor = marketMood === "Risk-On" ? "text-emerald-400" : marketMood === "Risk-Off" ? "text-red-400" : "text-amber-400"

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between">
        {marketMood && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Market mood:</span>
            <span className={cn("text-xs font-bold", moodColor)}>{marketMood}</span>
            <span className="text-xs text-zinc-600">({avgScore > 0 ? "+" : ""}{avgScore})</span>
          </div>
        )}
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="h-7 text-xs gap-1 ml-auto">
          <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          Scan
        </Button>
      </div>

      {loading && <Skeleton rows={6} />}
      {error && <p className="text-sm text-red-400 p-4">Failed to load news. Check your Anthropic API key.</p>}

      <div className="space-y-2">
        {news.map((item) => (
          <Card key={item.id} className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-3 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-zinc-200 leading-snug font-medium">{item.headline}</p>
                <ImpactDot impact={item.impact} />
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.summary}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <SentimentBadge sentiment={item.sentiment} />
                <Badge variant="outline" className="text-xs h-5 px-1.5 text-zinc-600">{item.category}</Badge>
                {item.assets.map((asset) => (
                  <span key={asset} className="text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded">
                    {asset}
                  </span>
                ))}
                <span className="text-xs text-zinc-600 ml-auto">{item.source} · {item.time}</span>
              </div>
              <div className="border-t border-zinc-800 pt-1.5">
                <p className="text-xs text-amber-400/80 italic">
                  <Zap className="inline h-3 w-3 mr-1" />
                  {item.actionable}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Macro Tab ────────────────────────────────────────────────────────────────

function MacroTab() {
  const [macro, setMacro] = useState<MacroData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      const text = await callClaude(MACRO_SYSTEM, "Generate today's macro briefing.")
      const clean = text.replace(/```json|```/g, "").trim()
      setMacro(JSON.parse(clean))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <Skeleton rows={6} />
  if (error) return <p className="text-sm text-red-400 p-4">Failed to load macro data. Check your Anthropic API key.</p>
  if (!macro) return null

  const riskColor = macro.globalRisk === "Risk-On" ? "text-emerald-400" : macro.globalRisk === "Risk-Off" ? "text-red-400" : "text-amber-400"
  const trendIcon = macro.rand?.trend === "strengthening"
    ? <TrendingUp className="h-3 w-3 text-emerald-400" />
    : macro.rand?.trend === "weakening"
    ? <TrendingDown className="h-3 w-3 text-red-400" />
    : <Minus className="h-3 w-3 text-zinc-400" />

  return (
    <div className="flex flex-col gap-3 p-3">
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm text-zinc-200">{macro.headline}</CardTitle>
          <CardDescription className="text-xs leading-relaxed">{macro.summary}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-3">
            <p className="text-xs text-zinc-500 mb-1">SARB Repo Rate</p>
            <p className="text-xl font-bold font-mono text-zinc-100">{macro.sarb?.rate}</p>
            <p className="text-xs text-zinc-500 mt-1">{macro.sarb?.outlook}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-3">
            <p className="text-xs text-zinc-500 mb-1">USD/ZAR</p>
            <div className="flex items-center gap-1.5">
              <p className="text-xl font-bold font-mono text-zinc-100">{macro.rand?.usdZar}</p>
              {trendIcon}
            </div>
            <p className="text-xs text-zinc-500 mt-1">{macro.rand?.driver}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500">Global Risk Appetite</p>
            <p className={cn("text-sm font-bold", riskColor)}>{macro.globalRisk}</p>
          </div>
          <Separator className="bg-zinc-800" />
          <div>
            <p className="text-xs text-zinc-500 mb-2">Watch today</p>
            <ul className="space-y-1">
              {macro.keyWatch?.map((item, i) => (
                <li key={i} className="text-xs text-zinc-300 flex items-start gap-1.5">
                  <span className="text-sky-500 mt-0.5">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Separator className="bg-zinc-800" />
          <p className="text-xs text-amber-400/80 italic">
            <Zap className="inline h-3 w-3 mr-1" />
            {macro.traderImplication}
          </p>
        </CardContent>
      </Card>

      <Button variant="outline" size="sm" onClick={load} disabled={loading} className="w-full h-8 text-xs gap-1.5">
        <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
        Refresh macro briefing
      </Button>
    </div>
  )
}

// ─── Research Tab ─────────────────────────────────────────────────────────────

const QUICK_PROMPTS = [
  "Top 3 JSE setups today with entry & stop",
  "USD/ZAR outlook this week",
  "Gold & platinum — bullish or bearish?",
  "SA macro risks to watch this month",
  "Best sector rotation play right now",
  "S&P 500 key levels to watch",
]

function ResearchTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const send = async (text?: string) => {
    const userText = text ?? input.trim()
    if (!userText || loading) return
    setInput("")

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: userText }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setLoading(true)

    try {
      const reply = await callClaude(RESEARCH_SYSTEM, userText, messages)
      setMessages([...nextMessages, { id: (Date.now() + 1).toString(), role: "assistant", content: reply }])
    } catch {
      setMessages([...nextMessages, { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, something went wrong. Please check your API key and try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[520px]">
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500 text-center pt-2">Ask me anything about markets, setups, or macro</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-left text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 hover:border-sky-500/40 hover:text-zinc-200 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 mt-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "rounded-lg p-3 text-xs leading-relaxed whitespace-pre-wrap",
                m.role === "user"
                  ? "bg-sky-500/10 border border-sky-500/20 text-sky-200 ml-6"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-300 mr-6"
              )}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 mr-6">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-zinc-800 p-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about any market, setup, or macro event..."
            className="text-xs h-9 bg-zinc-900 border-zinc-700 focus:border-sky-500"
            disabled={loading}
          />
          <Button type="button" size="sm" onClick={() => send()} disabled={loading || !input.trim()} className="h-9 w-9 p-0">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function AIPanel() {
  return (
    <Card className="w-full bg-zinc-950 border-zinc-800 overflow-hidden">
      <CardHeader className="p-3 pb-0 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2 pb-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <CardTitle className="text-sm text-zinc-200 tracking-wide">AI Intelligence</CardTitle>
          <Badge variant="outline" className="text-xs h-5 ml-auto text-zinc-500 border-zinc-700">
            Powered by Claude
          </Badge>
        </div>
      </CardHeader>

      <Tabs defaultValue="news">
        <TabsList className="w-full rounded-none bg-zinc-900/50 border-b border-zinc-800 h-9 p-0">
          {[
            { value: "news", label: "News", icon: Newspaper },
            { value: "signals", label: "Signals", icon: TrendingUp },
            { value: "macro", label: "Macro", icon: BarChart3 },
            { value: "research", label: "Research", icon: Brain },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex-1 rounded-none text-xs h-full data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-sky-500 data-[state=active]:text-sky-400 gap-1"
            >
              <Icon className="h-3 w-3" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="h-[580px]">
          <TabsContent value="news" className="mt-0"><NewsTab /></TabsContent>
          <TabsContent value="signals" className="mt-0"><SignalsTab /></TabsContent>
          <TabsContent value="macro" className="mt-0"><MacroTab /></TabsContent>
          <TabsContent value="research" className="mt-0 p-0"><ResearchTab /></TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  )
}
