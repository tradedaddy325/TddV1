import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const { marketData, analysisType } = await request.json()

    if (!marketData) {
      return new Response('Market data is required', { status: 400 })
    }

    const apiKey = process.env.XAI_API_KEY
    if (!apiKey) {
      return new Response('XAI API key not configured', { status: 500 })
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

    // Use direct xAI API call with correct endpoint
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Grok API error: ${response.status} - ${error}`)
    }

    // Return the streaming response directly
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error in trading analysis:', error)
    return new Response(
      `Failed to generate trading analysis: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    )
  }
}
