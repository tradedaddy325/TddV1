import { NextResponse } from 'next/server'

const CACHE_DURATION = 30 * 1000 // 30 seconds cache

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
      { headers: { 'User-Agent': 'TRADEDADDY' } }
    )
    
    // Handle rate limiting
    if (response.status === 429) {
      console.warn('CoinGecko rate limited, using mock data')
      return null
    }
    
    if (!response.ok) {
      console.warn(`CoinGecko API error: ${response.status}`)
      return null
    }

    const data = await response.json()

    return {
      BTC: {
        price: data.bitcoin.usd,
        changePercent: data.bitcoin.usd_24h_change,
      },
      ETH: {
        price: data.ethereum.usd,
        changePercent: data.ethereum.usd_24h_change,
      },
    }
  } catch (error) {
    console.error('Error fetching crypto:', error)
    return null
  }
}

async function fetchForex() {
  try {
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD',
      { headers: { 'User-Agent': 'TRADEDADDY' } }
    )

    if (!response.ok) {
      console.warn(`ExchangeRate API error: ${response.status}`)
      return null
    }

    const data = await response.json()

    return {
      EURUSD: {
        price: 1 / data.rates.EUR,
        changePercent: 0,
      },
      GBPUSD: {
        price: 1 / data.rates.GBP,
        changePercent: 0,
      },
    }
  } catch (error) {
    console.error('Error fetching forex:', error)
    return null
  }
}
  } catch (error) {
    console.error('Error fetching forex:', error)
    return null
  }
}

async function fetchCommodities() {
  try {
    // Using mock data for commodities (would need paid API)
    // In production, use TwelveData, Finnhub, or Polygon
    return {
      GOLD: {
        price: 2045.5,
        changePercent: 0.85,
      },
      OIL: {
        price: 75.3,
        changePercent: -1.2,
      },
      DXY: {
        price: 104.2,
        changePercent: 0.35,
      },
    }
  } catch (error) {
    console.error('Error fetching commodities:', error)
    return null
  }
}

async function fetchIndices() {
  try {
    // Mock data for indices (would need paid API)
    return {
      SPY: {
        price: 485.5,
        changePercent: 1.2,
      },
      QQQ: {
        price: 425.3,
        changePercent: 1.8,
      },
      DIA: {
        price: 395.2,
        changePercent: 0.9,
      },
    }
  } catch (error) {
    console.error('Error fetching indices:', error)
    return null
  }
}

export async function GET() {
  try {
    // Return cached data if available
    if (
      cachedPrices &&
      Date.now() - cacheTime < CACHE_DURATION
    ) {
      return NextResponse.json({
        ...cachedPrices,
        cached: true,
      })
    }

    // Fetch all market data in parallel
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
      ...prices,
      cached: false,
    })
  } catch (error) {
    console.error('Market data error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    )
  }
}
