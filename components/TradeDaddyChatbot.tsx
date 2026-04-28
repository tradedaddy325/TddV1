"use client"

import { useState, useRef, useEffect } from "react"
import { useTerminalPrices, MARKET_SYMBOLS, formatPrice } from "@/hooks/useLivePrices"
import { createClient } from "@/lib/supabase/client"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const SYSTEM_PROMPT = `You are the TradeDaddy AI — a professional trading assistant built into the TradeDaddy Terminal for South African retail traders.

You specialise in:
- Forex (EURUSD, GBPUSD, USDJPY, AUDUSD, USDCAD)
- Gold (XAUUSD) — your primary instrument
- Indices (NAS100, US500, US30)
- Crypto (BTCUSD, ETHUSD)
- WTI Crude Oil

You are knowledgeable about: Smart Money Concepts (SMC), ICT methodology, supply/demand, order blocks, liquidity grabs, market structure, risk management (1-2% per trade), position sizing, the SA trading environment (ZAR, local brokers, local hours), and macroeconomic context (FOMC, NFP, CPI, DXY).

Tone: Direct, professional, no fluff. Use terminal-style language occasionally. Never provide licensed financial advice — always clarify you are an educational AI tool.

When given live prices, incorporate them naturally in your analysis.

Format responses concisely. Use bullet points for multi-step analysis. Keep responses under 300 words unless the question requires depth.`

export default function TradeDaddyChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "TradeDaddy AI online. I can help with trade analysis, market structure, risk management, and instrument-specific questions. What are you working on?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { prices, lastUpdated } = useTerminalPrices(MARKET_SYMBOLS)

  // Fetch user credits
  useEffect(() => {
    async function fetchCredits() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", user.id)
          .single()
        if (data) setCredits(data.credits ?? 0)
      } catch { /* silent */ }
    }
    fetchCredits()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function buildPriceContext(): string {
    const priceLines = MARKET_SYMBOLS
      .map((sym) => {
        const p = prices[sym]
        if (!p || p.loading) return null
        return `${sym}: ${formatPrice(sym, p.price)} (${p.changePercent})`
      })
      .filter(Boolean)
    if (priceLines.length === 0) return ""
    const time = lastUpdated
      ? lastUpdated.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })
      : "now"
    return `\n\n[LIVE PRICES as of ${time} SAST]\n${priceLines.join("\n")}`
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const priceCtx = buildPriceContext()
      const conversationHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.id === "welcome" ? m.content : m.content,
      }))

      // Inject live prices into the last user message
      const historyForAPI = conversationHistory.map((m, i) => {
        if (i === conversationHistory.length - 1 && m.role === "user") {
          return { ...m, content: m.content + priceCtx }
        }
        return m
      })

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyForAPI,
          system: SYSTEM_PROMPT,
        }),
      })

      if (!res.ok) {
        throw new Error(`API error ${res.status}`)
      }

      const data = await res.json()
      const content = data.content?.[0]?.text ?? data.message ?? "No response received."

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-ai",
          role: "assistant",
          content,
          timestamp: new Date(),
        },
      ])

      // Update credits after use
      if (credits !== null) setCredits((c) => Math.max(0, (c ?? 0) - 5))
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-err",
          role: "assistant",
          content: "⚠ Connection error. Please try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const QUICK_PROMPTS = [
    "Analyse XAUUSD current structure",
    "What's the EURUSD bias today?",
    "Explain order blocks for beginners",
    "How do I calculate lot size for 1% risk?",
    "What to watch before NFP?",
  ]

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A] font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D0D0D] border-b border-[#1A1A1A] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#FF6600] rounded-full animate-pulse" />
          <span className="text-[10px] text-[#FF6600] tracking-widest font-bold">TRADEDADDY AI</span>
          <span className="text-[10px] text-[#333]">· NEURAL NETWORK ACTIVE</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#444]">
          {credits !== null && (
            <span className={credits < 50 ? "text-[#FF4444]" : "text-[#555]"}>
              {credits} CREDITS
            </span>
          )}
          <span className="text-[#00D084]">● LIVE PRICES LOADED</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] ${msg.role === "user" ? "order-2" : ""}`}>
              {/* Role label */}
              <div className={`text-[9px] tracking-widest mb-1 ${msg.role === "user" ? "text-right text-[#555]" : "text-[#FF6600]"}`}>
                {msg.role === "user" ? "YOU" : "TRADEDADDY AI"}
              </div>
              {/* Bubble */}
              <div
                className={`px-3 py-2.5 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#FF6600]/10 border border-[#FF6600]/20 text-white"
                    : "bg-[#0D0D0D] border border-[#1A1A1A] text-[#CCC]"
                }`}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {msg.content}
              </div>
              <div className="text-[9px] text-[#2A2A2A] mt-1 text-right">
                {msg.timestamp.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%]">
              <div className="text-[9px] text-[#FF6600] tracking-widest mb-1">TRADEDADDY AI</div>
              <div className="bg-[#0D0D0D] border border-[#1A1A1A] px-3 py-2.5">
                <span className="text-[#555] text-xs">
                  Analysing
                  <span className="animate-pulse">...</span>
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 py-2 border-t border-[#111] flex gap-2 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => setInput(p)}
            className="text-[10px] text-[#444] hover:text-[#FF6600] border border-[#1A1A1A] hover:border-[#FF6600]/30 px-2.5 py-1 whitespace-nowrap transition-colors shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[#1A1A1A] bg-[#0D0D0D] shrink-0">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-[#333] text-xs select-none">{`>`}</span>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about market structure, setups, risk management..."
              rows={2}
              className="w-full bg-[#0A0A0A] border border-[#222] focus:border-[#FF6600] text-white text-xs pl-7 pr-3 py-2.5 outline-none transition-colors placeholder:text-[#2A2A2A] font-mono resize-none"
              style={{ scrollbarWidth: "none" }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-[#FF6600] hover:bg-[#FF7722] disabled:bg-[#FF6600]/20 disabled:cursor-not-allowed text-white text-[10px] font-bold px-4 tracking-widest transition-colors shrink-0"
          >
            {loading ? (
              <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin block" />
            ) : (
              "SEND"
            )}
          </button>
        </div>
        <p className="text-[9px] text-[#2A2A2A] mt-1.5">
          ENTER to send · SHIFT+ENTER for new line · Each query uses ~5 credits
        </p>
      </div>
    </div>
  )
}
