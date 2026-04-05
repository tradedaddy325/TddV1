import { NextResponse } from 'next/server'

const MARKET_SYMBOLS = [
  'BTCUSD', 'ETHUSD', 'XAUUSD', 'EURUSD', 'US30', 'USOIL', 'NGAS', 'AAPL', 'TSLA'
]

// Cache market data for 5 seconds to avoid excessive API calls
let cachedData: any = null
let lastFetchTime = 0
const CACHE_DURATION = 5000

export async function GET() {
  try {
    const now = Date.now()
    
    // Return cached data if still valid
    if (cachedData && now - lastFetchTime < CACHE_DURATION) {
      return NextResponse.json({
        data: cachedData,
        cached: true,
        timestamp: new Date().toISOString()
      })
    }

    // Fetch fresh market data from Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured')
    }

    const marketData: Record<string, any> = {}

    // Fetch data for each symbol
    for (const symbol of MARKET_SYMBOLS) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Get current market price for ${symbol}. Return only JSON: {"symbol":"${symbol}","price":0,"change":0,"percentChange":0}`
                    }
                  ]
                }
              ]
            })
          }
        )

        const result = await response.json()
        
        // Parse the response
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = result.candidates[0].content.parts[0].text
          try {
            const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, ''))
            marketData[symbol] = {
              ...parsed,
              timestamp: new Date().toISOString()
            }
          } catch (e) {
            // If parsing fails, use mock data
            marketData[symbol] = {
              symbol,
              price: Math.random() * 100000,
              change: (Math.random() - 0.5) * 100,
              percentChange: (Math.random() - 0.5) * 5,
              timestamp: new Date().toISOString()
            }
          }
        }
      } catch (err) {
        console.error(`Error fetching ${symbol}:`, err)
        // Add mock data on error
        marketData[symbol] = {
          symbol,
          price: Math.random() * 100000,
          change: (Math.random() - 0.5) * 100,
          percentChange: (Math.random() - 0.5) * 5,
          timestamp: new Date().toISOString()
        }
      }
    }

    // Cache the data
    cachedData = marketData
    lastFetchTime = now

    return NextResponse.json({
      data: marketData,
      cached: false,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Market data error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    )
  }
}
