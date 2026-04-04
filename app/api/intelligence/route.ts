import { NextResponse } from 'next/server'
import { streamText } from 'ai'

const CACHE_DURATION = 60 * 1000 // 60 seconds cache

interface CachedBrief {
  brief: string
  riskSentiment: string
  explanation: string
  timestamp: number
}

let cachedBrief: CachedBrief | null = null

// Mock brief for when AI is unavailable
const getMockBrief = () => ({
  brief: 'Market conditions show mixed signals across major indices. Bitcoin trading near key resistance levels while traditional markets remain range-bound.',
  riskSentiment: 'Neutral',
  explanation: 'Current market environment suggests cautious positioning. Monitor support/resistance levels for trading signals.',
})

async function fetchMarketData() {
  try {
    // Fetch live market data from various sources
    const [btcData, goldData, oilData, dxyData] = await Promise.all([
      fetchBTC(),
      fetchGold(),
      fetchOil(),
      fetchDXY(),
    ])

    return {
      btc: btcData,
      gold: goldData,
      oil: oilData,
      dxy: dxyData,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error fetching market data:', error)
    return null
  }
}

async function fetchBTC() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true')
    const data = await res.json()
    return {
      price: data.bitcoin.usd,
      change24h: data.bitcoin.usd_24h_change,
    }
  } catch {
    return null
  }
}

async function fetchGold() {
  try {
    // Using a free forex API for gold prices (XAU/USD)
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/XAU?symbols=USD')
    const data = await res.json()
    return {
      price: 1 / data.rates.USD, // Inverse to get USD per troy ounce approximation
      symbol: 'XAUUSD',
    }
  } catch {
    return null
  }
}

async function fetchOil() {
  try {
    // Mock oil data (would need paid API for real data)
    return {
      price: 75.5,
      symbol: 'WTI',
      source: 'mock',
    }
  } catch {
    return null
  }
}

async function fetchDXY() {
  try {
    // Mock DXY data (would need paid API for real data)
    return {
      price: 104.5,
      symbol: 'DXY',
      change: 0.35,
      source: 'mock',
    }
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  try {
    // Check cache
    if (cachedBrief && Date.now() - cachedBrief.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        brief: cachedBrief.brief,
        riskSentiment: cachedBrief.riskSentiment,
        explanation: cachedBrief.explanation,
        cached: true,
      })
    }

    // Fetch fresh market data
    const marketData = await fetchMarketData()

    if (!marketData) {
      return NextResponse.json(
        { error: 'Failed to fetch market data' },
        { status: 500 }
      )
    }

    // Create market data summary for AI
    const marketSummary = `
Market Data Summary:
- Bitcoin: $${marketData.btc?.price?.toFixed(2) || 'N/A'} (24h: ${marketData.btc?.change24h?.toFixed(2) || 'N/A'}%)
- Gold: $${marketData.gold?.price?.toFixed(2) || 'N/A'}/oz
- Oil (WTI): $${marketData.oil?.price?.toFixed(2) || 'N/A'}/bbl
- Dollar Index (DXY): ${marketData.dxy?.price?.toFixed(2) || 'N/A'} (${marketData.dxy?.change || 0}%)

Generate a brief market analysis including:
1. Daily brief (2-3 sentences)
2. Risk sentiment (Risk-On, Risk-Off, or Neutral)
3. Key explanation (1-2 sentences)

Format your response as JSON with keys: brief, riskSentiment, explanation
`

    const result = await streamText({
      model: 'openai/gpt-4o-mini',
      system: 'You are an expert market analyst. Analyze the market data provided and give actionable insights.',
      prompt: marketSummary,
    })

    let fullResponse = ''

    for await (const chunk of result.textStream) {
      fullResponse += chunk
    }

    // Parse AI response
    let aiData = {
      brief: 'Market analysis generated',
      riskSentiment: 'Neutral',
      explanation: 'Market conditions uncertain',
    }

    try {
      const jsonMatch = fullResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        aiData = JSON.parse(jsonMatch[0])
      }
    } catch {
      // If parsing fails, use the raw response
      aiData.brief = fullResponse.substring(0, 200)
    }

    // Cache the result
    cachedBrief = {
      ...aiData,
      timestamp: Date.now(),
    }

    return NextResponse.json({
      ...aiData,
      cached: false,
    })
  } catch (error) {
    console.error('AI Intelligence Error:', error)
    
    // Check if error is due to credit card requirement
    const errorMessage = error instanceof Error ? error.message : String(error)
    const isBillingError = errorMessage.includes('credit card') || errorMessage.includes('customer_verification')
    
    if (isBillingError) {
      console.warn('AI Gateway billing issue - returning mock data')
      const mockData = getMockBrief()
      
      // Cache the mock data
      cachedBrief = {
        ...mockData,
        timestamp: Date.now(),
      }
      
      return NextResponse.json({
        ...mockData,
        cached: true,
        mock: true,
        message: 'Using cached market analysis due to temporary AI service limitations',
      })
    }
    
    // For other errors, try to return cached data if available
    if (cachedBrief && Date.now() - cachedBrief.timestamp < CACHE_DURATION * 2) {
      return NextResponse.json({
        brief: cachedBrief.brief,
        riskSentiment: cachedBrief.riskSentiment,
        explanation: cachedBrief.explanation,
        cached: true,
        message: 'Using cached analysis',
      })
    }
    
    // Last resort: return mock data
    const mockData = getMockBrief()
    return NextResponse.json({
      ...mockData,
      cached: false,
      mock: true,
      message: 'AI service temporarily unavailable',
    })
  }
}
