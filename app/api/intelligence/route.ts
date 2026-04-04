import { NextResponse } from 'next/server'

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
    if (!res.ok) return null
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
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/XAU?symbols=USD')
    if (!res.ok) return null
    const data = await res.json()
    return {
      price: 1 / data.rates.USD,
      symbol: 'XAUUSD',
    }
  } catch {
    return null
  }
}

async function fetchOil() {
  try {
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
    // Check cache first
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
      // If we can't fetch data, return cached or mock
      const mockData = getMockBrief()
      cachedBrief = {
        ...mockData,
        timestamp: Date.now(),
      }
      return NextResponse.json({
        ...mockData,
        cached: false,
        mock: true,
      })
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

    // Try to use AI, but don't let it fail
    try {
      const { streamText } = await import('ai')
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
    } catch (aiError) {
      // AI failed, return mock data
      console.warn('AI Intelligence unavailable, using mock data:', aiError)
      const mockData = getMockBrief()
      
      cachedBrief = {
        ...mockData,
        timestamp: Date.now(),
      }
      
      return NextResponse.json({
        ...mockData,
        cached: false,
        mock: true,
        message: 'AI service temporarily unavailable - using market insights',
      })
    }
  } catch (error) {
    console.error('Intelligence API Error:', error)
    
    // Always have a fallback
    const mockData = getMockBrief()
    return NextResponse.json({
      ...mockData,
      cached: false,
      mock: true,
      message: 'Using market analysis fallback',
    })
  }
}
