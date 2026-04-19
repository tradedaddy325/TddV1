import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export const runtime = "nodejs"
export const revalidate = 86400 // Cache for 24 hours - updates once daily

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function GET() {
  try {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const prompt = `You are a professional forex and financial markets analyst. Today is ${today}.

Generate a daily market intelligence briefing for traders. Return ONLY valid JSON matching this exact structure:

{
  "date": "${today}",
  "market_sentiment": {
    "overall": "Bullish" | "Bearish" | "Neutral" | "Mixed",
    "score": <number 1-10, where 10 is extremely bullish>,
    "summary": "<2-sentence market overview>",
    "key_drivers": ["<driver 1>", "<driver 2>", "<driver 3>"]
  },
  "ai_tip_of_day": {
    "title": "<short punchy title>",
    "content": "<2-3 sentence actionable trading tip for today>",
    "category": "Risk Management" | "Technical Analysis" | "Psychology" | "Strategy"
  },
  "top_setups": [
    {
      "pair": "<currency pair e.g. EURUSD>",
      "direction": "Long" | "Short",
      "bias": "<1 sentence rationale>",
      "key_level": "<important price level to watch>",
      "risk": "Low" | "Medium" | "High"
    },
    {
      "pair": "<currency pair>",
      "direction": "Long" | "Short", 
      "bias": "<1 sentence rationale>",
      "key_level": "<important price level to watch>",
      "risk": "Low" | "Medium" | "High"
    },
    {
      "pair": "<currency pair or index>",
      "direction": "Long" | "Short",
      "bias": "<1 sentence rationale>",
      "key_level": "<important price level to watch>",
      "risk": "Low" | "Medium" | "High"
    }
  ],
  "economic_highlights": [
    {
      "event": "<event name>",
      "time": "<approximate time or session>",
      "impact": "High" | "Medium" | "Low",
      "expectation": "<brief expectation>"
    },
    {
      "event": "<event name>",
      "time": "<approximate time or session>",
      "impact": "High" | "Medium" | "Low",
      "expectation": "<brief expectation>"
    },
    {
      "event": "<event name>",
      "time": "<approximate time or session>",
      "impact": "High" | "Medium" | "Low",
      "expectation": "<brief expectation>"
    }
  ],
  "news_summary": {
    "headline": "<most impactful market news headline today>",
    "summary": "<2-3 sentences on today's most important market-moving news and themes>",
    "watch_out": "<one key risk or event to monitor today>"
  },
  "generated_at": "${new Date().toISOString()}"
}

Return ONLY the JSON object with no other text, no markdown, no explanation.`

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    })

    const textContent = message.content.find((c) => c.type === "text")
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in response")
    }

    const jsonText = textContent.text.trim()
    const data = JSON.parse(jsonText)

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    })
  } catch (error) {
    console.error("Daily intelligence error:", error)

    // Return fallback data if AI fails
    const fallback = {
      date: new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      market_sentiment: {
        overall: "Mixed",
        score: 5,
        summary: "Markets are digesting recent economic data with mixed signals across major pairs. Traders should watch key levels carefully.",
        key_drivers: ["Fed policy expectations", "Geopolitical uncertainty", "Dollar strength"],
      },
      ai_tip_of_day: {
        title: "Patience is Your Edge",
        content: "In uncertain market conditions, the best trade is often no trade. Wait for clean setups with clear invalidation levels. Protect your capital first — opportunities are always available tomorrow.",
        category: "Psychology",
      },
      top_setups: [
        { pair: "EURUSD", direction: "Short", bias: "Dollar strength amid risk-off sentiment favors downside", key_level: "1.0800", risk: "Medium" },
        { pair: "GBPUSD", direction: "Neutral", bias: "Range-bound pending UK economic releases", key_level: "1.2650", risk: "High" },
        { pair: "XAUUSD", direction: "Long", bias: "Safe haven demand supporting gold at current levels", key_level: "2300", risk: "Low" },
      ],
      economic_highlights: [
        { event: "US CPI Data", time: "08:30 ET", impact: "High", expectation: "Core inflation expected steady" },
        { event: "ECB Speech", time: "London Session", impact: "Medium", expectation: "Watch for rate guidance" },
        { event: "US Jobless Claims", time: "08:30 ET", impact: "Medium", expectation: "Slight uptick expected" },
      ],
      news_summary: {
        headline: "Markets Await Key Economic Releases",
        summary: "Global markets are in a cautious holding pattern as traders await key US economic data. Currency markets show mixed signals with the dollar maintaining strength amid ongoing uncertainty.",
        watch_out: "High-impact US data releases could trigger significant volatility across all major pairs.",
      },
      generated_at: new Date().toISOString(),
      is_fallback: true,
    }

    return NextResponse.json(fallback, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    })
  }
}
