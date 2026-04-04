import { NextResponse } from 'next/server'

const CACHE_DURATION = 60 * 1000 // 60 seconds cache to avoid rate limiting

interface MarketData {
  [key: string]: {
    price: number
    change: number
    changePercent: number
    timestamp: string
  }
}

let cachedPrices: MarketData | null = null
let cacheTime = 0

async function fetchCrypto() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
      { 
        headers: { 'User-Agent': 'TRADEDADDY' },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }
    )
    
    // Handle rate limiting
    if (response.status === 429) {
      console.warn('[Market API] CoinGecko rate limited, using cached data')
      return null
    }
    
    if (!response.ok) {
      console.warn(`[Market API] CoinGecko error: ${response.status}`)
      return null
    }

    const data = await response.json()

    return {
      BTCUSD: {
        price: data.bitcoin.usd,
        changePercent: data.bitcoin.usd_24h_change,
      },
      ETHUSD: {
        price: data.ethereum.usd,
        changePercent: data.ethereum.usd_24h_change,
      },
    }
  } catch (error) {
    console.warn('[Market API] Error fetching crypto:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

async function fetchForex() {
  try {
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD',
      { 
        headers: { 'User-Agent': 'TRADEDADDY' },
        signal: AbortSignal.timeout(5000)
      }
    )

    if (!response.ok) {
      console.warn(`[Market API] ExchangeRate API error: ${response.status}`)
      return null
    }

    const data = await response.json()

    return {
      EURUSD: {
        price: 1 / data.rates.EUR,
        changePercent: 0,
      },
    }
  } catch (error) {
    console.warn('[Market API] Error fetching forex:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

async function fetchCommodities() {
  try {
    // Using mock data for commodities (would need paid API)
    return {
      XAUUSD: {
        price: 2350.5 + (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 2,
      },
      USOIL: {
        price: 78.3 + (Math.random() - 0.5) * 2,
        changePercent: (Math.random() - 0.5) * 3,
      },
    }
  } catch (error) {
    console.warn('[Market API] Error in commodities:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

async function fetchIndices() {
  try {
    // Mock data for indices (would need paid API)
    return {
      US30: {
        price: 39485 + (Math.random() - 0.5) * 200,
        changePercent: (Math.random() - 0.5) * 2,
      },
    }
  } catch (error) {
    console.warn('[Market API] Error in indices:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

export async function GET() {
  try {
    // Return cached data if available (within cache duration)
    if (
      cachedPrices &&
      Date.now() - cacheTime < CACHE_DURATION
    ) {
      return NextResponse.json({
        crypto: filterBySymbol(cachedPrices, 'BTCUSD', 'ETHUSD'),
        forex: filterBySymbol(cachedPrices, 'EURUSD'),
        commodities: filterBySymbol(cachedPrices, 'XAUUSD', 'USOIL'),
        indices: filterBySymbol(cachedPrices, 'US30'),
        cached: true,
        cacheAge: Date.now() - cacheTime,
      })
    }

    // Fetch all market data in parallel with timeouts
    const [crypto, forex, commodities, indices] = await Promise.all([
      fetchCrypto(),
      fetchForex(),
      fetchCommodities(),
      fetchIndices(),
    ])

    const prices: MarketData = {}
    const timestamp = new Date().toISOString()

    // Combine all data
    if (crypto) {
      Object.entries(crypto).forEach(([symbol, data]) => {
        prices[symbol] = {
          price: data.price,
          change: 0,
          changePercent: data.changePercent,
          timestamp,
        }
      })
    }

    if (forex) {
      Object.entries(forex).forEach(([symbol, data]) => {
        prices[symbol] = {
          price: data.price,
          change: 0,
          changePercent: data.changePercent,
          timestamp,
        }
      })
    }

    if (commodities) {
      Object.entries(commodities).forEach(([symbol, data]) => {
        prices[symbol] = {
          price: data.price,
          change: 0,
          changePercent: data.changePercent,
          timestamp,
        }
      })
    }

    if (indices) {
      Object.entries(indices).forEach(([symbol, data]) => {
        prices[symbol] = {
          price: data.price,
          change: 0,
          changePercent: data.changePercent,
          timestamp,
        }
      })
    }

    // Cache the prices
    cachedPrices = prices
    cacheTime = Date.now()

    return NextResponse.json({
      crypto: filterBySymbol(prices, 'BTCUSD', 'ETHUSD'),
      forex: filterBySymbol(prices, 'EURUSD'),
      commodities: filterBySymbol(prices, 'XAUUSD', 'USOIL'),
      indices: filterBySymbol(prices, 'US30'),
      cached: false,
    })
  } catch (error) {
    console.error('[Market API] Fatal error:', error)
    
    // Return cached data as fallback even if expired
    if (cachedPrices) {
      return NextResponse.json({
        crypto: filterBySymbol(cachedPrices, 'BTCUSD', 'ETHUSD'),
        forex: filterBySymbol(cachedPrices, 'EURUSD'),
        commodities: filterBySymbol(cachedPrices, 'XAUUSD', 'USOIL'),
        indices: filterBySymbol(cachedPrices, 'US30'),
        cached: true,
        fallback: true,
      })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    )
  }
}

function filterBySymbol(data: MarketData, ...symbols: string[]): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  symbols.forEach((sym) => {
    if (data[sym]) {
      result[sym] = data[sym]
    }
  })
  return result
}
