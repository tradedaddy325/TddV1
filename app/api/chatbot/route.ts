import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  const { messages } = await request.json()

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `You are Trade Daddy AI, an expert trading assistant for the Trade Daddy platform. You help traders with:
- Market analysis and technical analysis
- Trade setups and entry/exit strategies
- Risk management (stop loss, take profit, position sizing)
- MT5 and trading platform guidance
- Trading psychology and discipline
- Forex, stocks, crypto, commodities

Be concise, professional, and use trading terminology. Format key numbers and levels clearly.
Always remind traders of risk management principles when discussing specific trades.`,
      messages: messages.slice(-20), // Keep last 20 messages for context
    }),
  })

  const data = await res.json()
  const content = data.content?.[0]?.text || "I couldn't process that. Please try again."

  return NextResponse.json({ content })
}
