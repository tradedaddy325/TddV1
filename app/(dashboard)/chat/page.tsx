"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Send, Bot, User, Zap, Trash2, Sparkles, TrendingUp, Shield, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"
import useSWR from "swr"

const fetcher = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("profiles")
    .select("credits, subscription_tier")
    .eq("id", user.id)
    .single()

  return data
}

const suggestedQuestions = [
  {
    icon: <TrendingUp className="h-4 w-4" />,
    title: "Analyze EURUSD",
    prompt: "Can you analyze the current EURUSD chart and give me key support and resistance levels?",
  },
  {
    icon: <Shield className="h-4 w-4" />,
    title: "Risk Management",
    prompt: "What's the proper position size for a $10,000 account risking 1% per trade on XAUUSD with a 50 pip stop loss?",
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    title: "Gold Trading",
    prompt: "What are the key factors I should watch when trading gold (XAUUSD) today?",
  },
  {
    icon: <BookOpen className="h-4 w-4" />,
    title: "Learn Patterns",
    prompt: "Explain the head and shoulders pattern and how to trade it effectively.",
  },
]

export default function ChatPage() {
  const { data: profile, mutate: mutateProfile } = useSWR("chat_profile", fetcher)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"
  const hasUnlimitedCredits = profile?.subscription_tier === "elite"
  const canSendMessage = hasUnlimitedCredits || (profile?.credits && profile.credits > 0)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !canSendMessage) return
    sendMessage({ text: input })
    setInput("")
    // Refresh profile to update credits
    setTimeout(() => mutateProfile(), 2000)
  }

  const handleSuggestionClick = (prompt: string) => {
    if (!canSendMessage) return
    sendMessage({ text: prompt })
    setTimeout(() => mutateProfile(), 2000)
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="font-mono text-2xl font-bold text-terminal-green">
            {">"} AI_ANALYST
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Get AI-powered trade analysis and market insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-terminal-yellow/30 bg-terminal-yellow/10 px-3 py-1.5">
            <Zap className="h-4 w-4 text-terminal-yellow" />
            <span className="font-mono text-sm">
              {hasUnlimitedCredits ? (
                <span className="text-terminal-green">Unlimited</span>
              ) : (
                <span className="text-terminal-yellow">{profile?.credits || 0} credits</span>
              )}
            </span>
          </div>
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="border-terminal-red/30 text-terminal-red hover:bg-terminal-red/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <Card className="flex flex-1 flex-col border-terminal-green/20 bg-card/50">
        <CardContent className="flex flex-1 flex-col p-0">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center p-6">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-terminal-green/30 bg-terminal-green/10">
                <Bot className="h-8 w-8 text-terminal-green" />
              </div>
              <h2 className="mb-2 font-mono text-xl font-bold text-terminal-green">TRADEDADDY AI</h2>
              <p className="mb-8 max-w-md text-center text-muted-foreground">
                Your personal AI trading analyst. Ask about market analysis, technical patterns, 
                risk management, or any trading-related questions.
              </p>
              
              <div className="grid w-full max-w-2xl gap-3 md:grid-cols-2">
                {suggestedQuestions.map((q, i) => (
                  <Card 
                    key={i}
                    className="cursor-pointer border-terminal-green/20 bg-background/50 transition-all hover:border-terminal-green/40"
                    onClick={() => handleSuggestionClick(q.prompt)}
                  >
                    <CardContent className="flex items-start gap-3 p-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-terminal-green/30 bg-terminal-green/10 text-terminal-green">
                        {q.icon}
                      </div>
                      <div>
                        <h3 className="font-mono font-medium">{q.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{q.prompt}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-terminal-green/30 bg-terminal-green/10">
                        <Bot className="h-4 w-4 text-terminal-green" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-terminal-green/20 text-foreground"
                          : "border border-terminal-green/20 bg-background/50"
                      }`}
                    >
                      {message.parts.map((part, index) => {
                        if (part.type === "text") {
                          return (
                            <div key={index} className="prose prose-invert max-w-none text-sm whitespace-pre-wrap">
                              {part.text}
                            </div>
                          )
                        }
                        return null
                      })}
                    </div>
                    {message.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-terminal-cyan/30 bg-terminal-cyan/10">
                        <User className="h-4 w-4 text-terminal-cyan" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-terminal-green/30 bg-terminal-green/10">
                      <Bot className="h-4 w-4 text-terminal-green animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1 rounded-lg border border-terminal-green/20 bg-background/50 px-4 py-3">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-terminal-green [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-terminal-green [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-terminal-green" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <div className="border-t border-terminal-green/20 p-4">
            {!canSendMessage && (
              <div className="mb-3 rounded-lg border border-terminal-red/30 bg-terminal-red/10 p-3 text-center">
                <p className="text-sm text-terminal-red">
                  You have run out of credits. Please purchase more to continue using AI analysis.
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={canSendMessage ? "Ask about trading, market analysis, risk management..." : "Purchase credits to continue"}
                className="min-h-[60px] resize-none border-terminal-green/30 bg-background font-mono"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                disabled={!canSendMessage || isLoading}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading || !canSendMessage}
                className="h-auto bg-terminal-green px-6 text-background hover:bg-terminal-green/90"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              TRADEDADDY AI provides analysis for educational purposes only. Not financial advice.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
