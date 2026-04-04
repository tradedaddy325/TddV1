import type { MarketPrice } from './types'

// Free API endpoints for market data
const COINGECKO_API = 'https://api.coingecko.com/api/v3'
const EXCHANGERATE_API = 'https://open.er-api.com/v6/latest/USD'

// Cache for rate limiting
const cache: Map<string, { data: unknown; timestamp: number }> = new Map()
const CACHE_DURATION = 30000 // 30 seconds

function getCached<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T
  }
  return null
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// Crypto prices from CoinGecko (free, no API key needed)
export async function getCryptoPrices(): Promise<MarketPrice[]> {
  const cacheKey = 'crypto-prices'
  const cached = getCached<MarketPrice[]>(cacheKey)
  if (cached) return cached

  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,cardano&order=market_cap_desc&sparkline=false&price_change_percentage=24h`,
      { next: { revalidate: 30 } }
    )

    if (!response.ok) throw new Error('Failed to fetch crypto prices')

    const data = await response.json()
    const prices: MarketPrice[] = data.map((coin: {
      symbol: string
      name: string
      current_price: number
      price_change_24h: number
      price_change_percentage_24h: number
      high_24h: number
      low_24h: number
      total_volume: number
      last_updated: string
    }) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change: coin.price_change_24h,
      changePercent: coin.price_change_percentage_24h,
      high24h: coin.high_24h,
      low24h: coin.low_24h,
      volume: coin.total_volume,
      lastUpdated: coin.last_updated,
    }))

    setCache(cacheKey, prices)
    return prices
  } catch (error) {
    console.error('Error fetching crypto prices:', error)
    // Return fallback data
    return getFallbackCryptoPrices()
  }
}

// Forex rates using free exchange rate API
export async function getForexPrices(): Promise<MarketPrice[]> {
  const cacheKey = 'forex-prices'
  const cached = getCached<MarketPrice[]>(cacheKey)
  if (cached) return cached

  try {
    const response = await fetch(EXCHANGERATE_API, { next: { revalidate: 60 } })

    if (!response.ok) throw new Error('Failed to fetch forex rates')

    const data = await response.json()
    const rates = data.rates

    // Calculate major forex pairs
    const pairs: MarketPrice[] = [
      {
        symbol: 'EUR/USD',
        name: 'Euro / US Dollar',
        price: 1 / rates.EUR,
        change: 0,
        changePercent: ((1 / rates.EUR - 1.085) / 1.085) * 100,
        lastUpdated: new Date().toISOString(),
      },
      {
        symbol: 'GBP/USD',
        name: 'British Pound / US Dollar',
        price: 1 / rates.GBP,
        change: 0,
        changePercent: ((1 / rates.GBP - 1.27) / 1.27) * 100,
        lastUpdated: new Date().toISOString(),
      },
      {
        symbol: 'USD/JPY',
        name: 'US Dollar / Japanese Yen',
        price: rates.JPY,
        change: 0,
        changePercent: ((rates.JPY - 149.5) / 149.5) * 100,
        lastUpdated: new Date().toISOString(),
      },
      {
        symbol: 'USD/ZAR',
        name: 'US Dollar / South African Rand',
        price: rates.ZAR,
        change: 0,
        changePercent: ((rates.ZAR - 18.2) / 18.2) * 100,
        lastUpdated: new Date().toISOString(),
      },
      {
        symbol: 'AUD/USD',
        name: 'Australian Dollar / US Dollar',
        price: 1 / rates.AUD,
        change: 0,
        changePercent: ((1 / rates.AUD - 0.66) / 0.66) * 100,
        lastUpdated: new Date().toISOString(),
      },
    ]

    setCache(cacheKey, pairs)
    return pairs
  } catch (error) {
    console.error('Error fetching forex rates:', error)
    return getFallbackForexPrices()
  }
}

// Gold price (simulated with slight variations)
export async function getGoldPrice(): Promise<MarketPrice> {
  const cacheKey = 'gold-price'
  const cached = getCached<MarketPrice>(cacheKey)
  if (cached) return cached

  // Using a realistic base price with small random variations
  const basePrice = 2350
  const variation = (Math.random() - 0.5) * 20
  const price = basePrice + variation
  const change = variation
  const changePercent = (change / basePrice) * 100

  const goldPrice: MarketPrice = {
    symbol: 'XAU/USD',
    name: 'Gold Spot',
    price: parseFloat(price.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    high24h: basePrice + 15,
    low24h: basePrice - 12,
    lastUpdated: new Date().toISOString(),
  }

  setCache(cacheKey, goldPrice)
  return goldPrice
}

// Indices (simulated)
export async function getIndicesPrices(): Promise<MarketPrice[]> {
  const cacheKey = 'indices-prices'
  const cached = getCached<MarketPrice[]>(cacheKey)
  if (cached) return cached

  const indices: MarketPrice[] = [
    createSimulatedPrice('US30', 'Dow Jones Industrial', 39500, 150),
    createSimulatedPrice('US500', 'S&P 500', 5200, 25),
    createSimulatedPrice('US100', 'Nasdaq 100', 18200, 80),
    createSimulatedPrice('UK100', 'FTSE 100', 8100, 30),
    createSimulatedPrice('GER40', 'DAX 40', 18400, 70),
  ]

  setCache(cacheKey, indices)
  return indices
}

function createSimulatedPrice(
  symbol: string,
  name: string,
  basePrice: number,
  maxVariation: number
): MarketPrice {
  const variation = (Math.random() - 0.5) * maxVariation * 2
  const price = basePrice + variation
  const changePercent = (variation / basePrice) * 100

  return {
    symbol,
    name,
    price: parseFloat(price.toFixed(2)),
    change: parseFloat(variation.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    lastUpdated: new Date().toISOString(),
  }
}

// Fallback data when APIs fail
function getFallbackCryptoPrices(): MarketPrice[] {
  return [
    { symbol: 'BTC', name: 'Bitcoin', price: 67500, change: 1250, changePercent: 1.88, lastUpdated: new Date().toISOString() },
    { symbol: 'ETH', name: 'Ethereum', price: 3450, change: -45, changePercent: -1.29, lastUpdated: new Date().toISOString() },
    { symbol: 'SOL', name: 'Solana', price: 175, change: 8.5, changePercent: 5.1, lastUpdated: new Date().toISOString() },
    { symbol: 'XRP', name: 'Ripple', price: 0.52, change: 0.02, changePercent: 4.0, lastUpdated: new Date().toISOString() },
    { symbol: 'ADA', name: 'Cardano', price: 0.45, change: -0.01, changePercent: -2.17, lastUpdated: new Date().toISOString() },
  ]
}

function getFallbackForexPrices(): MarketPrice[] {
  return [
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.085, change: 0.002, changePercent: 0.18, lastUpdated: new Date().toISOString() },
    { symbol: 'GBP/USD', name: 'British Pound / US Dollar', price: 1.27, change: -0.003, changePercent: -0.24, lastUpdated: new Date().toISOString() },
    { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', price: 149.5, change: 0.35, changePercent: 0.23, lastUpdated: new Date().toISOString() },
    { symbol: 'USD/ZAR', name: 'US Dollar / South African Rand', price: 18.25, change: 0.12, changePercent: 0.66, lastUpdated: new Date().toISOString() },
    { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', price: 0.66, change: 0.001, changePercent: 0.15, lastUpdated: new Date().toISOString() },
  ]
}

// Get all market data at once
export async function getAllMarketData() {
  const [crypto, forex, gold, indices] = await Promise.all([
    getCryptoPrices(),
    getForexPrices(),
    getGoldPrice(),
    getIndicesPrices(),
  ])

  return { crypto, forex, gold, indices }
}

// Get all market prices as a single array (for macro page compatibility)
export async function getMarketPrices(): Promise<MarketPrice[]> {
  const { crypto, forex, gold, indices } = await getAllMarketData()
  
  // Combine all prices into a single array
  const allPrices: MarketPrice[] = [
    ...crypto,
    ...forex,
    gold,
    ...indices,
  ]
  
  return allPrices
}

// Format price with appropriate decimal places
export function formatPrice(price: number, symbol: string): string {
  if (symbol.includes('JPY') || symbol.startsWith('US') || symbol.startsWith('UK') || symbol.startsWith('GER')) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  if (price < 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })
  }
  if (price < 100) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  }
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Format change percentage
export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}
