import { streamText } from 'ai'
import { xai } from '@ai-sdk/xai'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { marketData, analysisType } = await request.json()

    if (!marketData) {
      return new Response('Market data is required', { status: 400 })
    }

    const systemPrompt = `You are Grok, an advanced trading analysis AI by xAI. Provide expert trading insights and market analysis.
    
    When analyzing markets:
    - Identify key support/resistance levels
    - Assess market sentiment and trends
    - Provide actionable trading signals
    - Consider risk/reward ratios
    - Mention relevant economic factors
    - Be direct and concise in your analysis`

    const userPrompt = `Analyze this market data for trading opportunities:

${JSON.stringify(marketData, null, 2)}

Analysis Type: ${analysisType || 'general'}

Provide:
1. Market Sentiment (Risk-On/Off/Neutral)
2. Key Price Levels
3. Trading Signals
4. Risk Assessment
5. Recommended Actions`

    const result = streamText({
      model: xai('grok-4'),
      system: systemPrompt,
      prompt: userPrompt,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Error in trading analysis:', error)
    return new Response('Failed to generate trading analysis', { status: 500 })
  }
}
