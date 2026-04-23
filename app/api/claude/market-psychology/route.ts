// app/api/claude/market-psychology/route.ts
import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { type, instruments } = await req.json()

    if (type === "briefing") {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: `You are a professional market psychologist and trading analyst. 
Analyze current market psychology for forex and financial markets.
Return ONLY valid JSON with this exact structure (no markdown, no extra text):
{
  "overallMood": "2-3 sentence summary of overall market psychology right now",
  "keyInsight": "Most important psychological insight for traders today",
  "topOpportunity": "Best opportunity based on current market psychology (1-2 sentences)",
  "topRisk": "Biggest psychological risk traders face today (1-2 sentences)",
  "fearGreedIndex": <number 0-100 representing overall market fear/greed>,
  "marketPhase": "Current market phase description (accumulation, distribution, markup, markdown, etc.)"
}
Today's date: ${new Date().toDateString()}. Use your training knowledge of market dynamics.`,
          },
        ],
      })

      const text = message.content[0].type === "text" ? message.content[0].text : ""
      const briefing = JSON.parse(text.trim())
      return NextResponse.json({ briefing })
    }

    if (type === "psychology") {
      const instList = (instruments as string[]).join(", ")
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: `You are a professional market psychology analyst. 
Analyze market sentiment and retail positioning psychology for these instruments: ${instList}.
Return ONLY valid JSON array with NO markdown, no code blocks, no extra text.
Each object must have exactly this structure:
[
  {
    "instrument": "XAUUSD",
    "sentiment": "GREED",
    "score": 68,
    "retailLong": 72,
    "retailShort": 28,
    "trend": "BULLISH",
    "keyLevels": { "support": "3310.00", "resistance": "3365.00" },
    "biasStatement": "One sentence describing institutional vs retail bias",
    "traps": ["Trap 1 retail traders are falling into", "Trap 2"],
    "updatedAt": "Live"
  }
]
Rules:
- sentiment must be one of: "GREED", "FEAR", "NEUTRAL", "EXTREME GREED", "EXTREME FEAR"
- score is 0-100 (0=extreme fear, 100=extreme greed)
- retailLong + retailShort must equal 100
- trend must be: "BULLISH", "BEARISH", or "RANGING"
- traps array: 1-3 items
Today: ${new Date().toDateString()}. Base analysis on your training knowledge of typical market psychology patterns.`,
          },
        ],
      })

      const text = message.content[0].type === "text" ? message.content[0].text : "[]"
      // Strip any accidental markdown
      const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
      const data = JSON.parse(clean)
      return NextResponse.json({ data })
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (err: any) {
    console.error("Market psychology API error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
