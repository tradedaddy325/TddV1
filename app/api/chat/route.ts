import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 30

const TRADING_SYSTEM_PROMPT = `You are TRADEDADDY AI, an expert trading analyst assistant. You specialize in:

1. **Technical Analysis**: Chart patterns, candlestick formations, support/resistance levels, trend lines, indicators (RSI, MACD, Moving Averages, Fibonacci, Bollinger Bands)

2. **Fundamental Analysis**: Economic indicators, interest rates, GDP, inflation, employment data, central bank policies

3. **Risk Management**: Position sizing, stop loss placement, risk-reward ratios, portfolio management, drawdown analysis

4. **Market Analysis**: Forex, Gold (XAUUSD), Crypto, Indices, Commodities

5. **Trading Psychology**: Emotional management, discipline, avoiding FOMO/revenge trading

When analyzing trades:
- Always consider risk management first
- Provide specific entry, stop loss, and take profit levels when asked
- Explain your reasoning clearly
- Use technical terminology but explain concepts when needed
- Never guarantee profits - trading involves significant risk
- Encourage proper position sizing (1-2% risk per trade)

Format responses clearly with:
- Key levels in **bold**
- Important warnings in capital letters
- Structured analysis with bullet points when appropriate

Remember: You are a tool for education and analysis, not financial advice. Always remind users to do their own research and never risk more than they can afford to lose.`

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Check if user has credits
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits, subscription_tier")
      .eq("id", user.id)
      .single()

    const hasUnlimitedCredits = profile?.subscription_tier === "elite"
    
    if (!hasUnlimitedCredits && (!profile || profile.credits <= 0)) {
      return new Response(
        JSON.stringify({ error: "Insufficient credits. Please purchase more credits to continue." }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      )
    }

    const { messages }: { messages: UIMessage[] } = await req.json()

    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: TRADING_SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
    })

    // Deduct credit after successful response (if not unlimited)
    if (!hasUnlimitedCredits) {
      await supabase
        .from("profiles")
        .update({ credits: profile!.credits - 1 })
        .eq("id", user.id)

      await supabase.from("credit_transactions").insert({
        user_id: user.id,
        amount: -1,
        type: "usage",
        description: "AI Chat analysis",
      })
    }

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      consumeSseStream: consumeStream,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
