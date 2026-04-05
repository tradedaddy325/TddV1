import { NextResponse } from 'next/server'
import { Anthropic } from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: Request) {
  try {
    const { marketData, analysisType } = await request.json()

    if (!marketData) {
      return NextResponse.json(
        { error: 'Market data is required' },
        { status: 400 }
      )
    }

    let prompt = ''

    switch (analysisType) {
      case 'sentiment':
        prompt = `Analyze the market sentiment based on this data: ${JSON.stringify(marketData)}. Provide a brief sentiment analysis (bullish, bearish, or neutral) with key insights in 2-3 sentences.`
        break
      case 'psychology':
        prompt = `Perform a market psychology analysis on: ${JSON.stringify(marketData)}. Analyze fear/greed indicators, institutional behavior, and retail sentiment. Format as JSON with keys: feargauge, greedgauge, institutionalbias, retailsentiment.`
        break
      case 'macro':
        prompt = `Provide macroeconomic analysis for the current market conditions: ${JSON.stringify(marketData)}. Include: USD strength, rate environment, geopolitical risks, and central bank outlook. Keep it concise.`
        break
      default:
        prompt = `Analyze this market data: ${JSON.stringify(marketData)}`
    }

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const analysis = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({
      analysis,
      type: analysisType,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('AI analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500 }
    )
  }
}
