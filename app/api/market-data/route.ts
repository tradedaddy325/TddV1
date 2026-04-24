// app/api/market-data/route.ts
// Fetches live prices from Alpha Vantage - called by landing page + dashboard
// Cache: 30s revalidation to stay within AV free tier (25 req/day on free, 75/min on premium)

import { NextRequest, NextResponse } from "next/server"

const AV_KEY = process.env.ALPHA_VANTAGE_API_KEY!
const BASE = "https://www.alphavantage.co/query"

// Mapping of our display symbols to Alpha Vantage query params
const FOREX_PAIRS = [
  { symbol: "EURUSD", from: "EUR", to: "USD" },
  { symbol: "GBPUSD", from: "GBP", to: "USD" },
  { symbol: "USDJPY", from: "USD", to: "JPY" },
  { symbol: "GBPJPY", from: "GBP", to: "JPY" },
]

const CRYPTO_PAIRS = [
  { symbol: "BTCUSD", coin: "BTC", market: "USD" },
  { symbol: "ETHUSD", coin: "ETH", market: "USD" },
]

// Alpha Vantage doesn't have direct forex for Gold — use commodity endpoint
// For indices (NAS100, US500) AV requires premium; we use TIME_SERIES_INTRADAY on ETFs as proxy
// QQQ = Nasdaq proxy, SPY = S&P500 proxy
const EQUITY_PROXIES = [
  { symbol: "NAS100", ticker: "QQQ" },
  { symbol: "US500", ticker: "SPY" },
  { symbol: "XAUUSD", ticker: "GLD" }, // Gold ETF proxy
  { symbol: "WTI", ticker: "USO" },    // Oil ETF proxy
]

type PriceResult = {
  symbol: string
  price: string
  change: string
  changePct: string
  up: boolean
  source: "live" | "cached" | "fallback"
  timestamp: string
}

// In-memory cache (resets on cold start — fine for edge functions)
const cache: { data: PriceResult[]; ts: number } = { data: [], ts: 0 }
const CACHE_TTL = 30_000 // 30 seconds

async function fetchForexQuote(from: string, to: string): Promise<{ price: number; change: number } | null> {
  try {
    const url = `${BASE}?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${AV_KEY}`
    const res = await fetch(url, { next: { revalidate: 30 } })
    const json = await res.json()
    const rate = json["Realtime Currency Exchange Rate"]
    if (!rate) return null
    const price = parseFloat(rate["5. Exchange Rate"])
    const bid = parseFloat(rate["8. Bid Price"] || rate["5. Exchange Rate"])
    const ask = parseFloat(rate["9. Ask Price"] || rate["5. Exchange Rate"])
    const change = ask - bid // approximate
    return { price, change }
  } catch {
    return null
  }
}

async function fetchEquityQuote(ticker: string): Promise<{ price: number; change: number; changePct: number } | null> {
  try {
    const url = `${BASE}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${AV_KEY}`
    const res = await fetch(url, { next: { revalidate: 30 } })
    const json = await res.json()
    const q = json["Global Quote"]
    if (!q || !q["05. price"]) return null
    return {
      price: parseFloat(q["05. price"]),
      change: parseFloat(q["09. change"]),
      changePct: parseFloat(q["10. change percent"]?.replace("%", "") || "0"),
    }
  } catch {
    return null
  }
}

async function fetchCryptoQuote(coin: string): Promise<{ price: number; change: number } | null> {
  try {
    const url = `${BASE}?function=CURRENCY_EXCHANGE_RATE&from_currency=${coin}&to_currency=USD&apikey=${AV_KEY}`
    const res = await fetch(url, { next: { revalidate: 30 } })
    const json = await res.json()
    const rate = json["Realtime Currency Exchange Rate"]
    if (!rate) return null
    const price = parseFloat(rate["5. Exchange Rate"])
    return { price, change: 0 }
  } catch {
    return null
  }
}

function fmt(price: number, symbol: string): string {
  if (symbol === "USDJPY" || symbol === "GBPJPY") return price.toFixed(2)
  if (price > 10000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 })
  if (price > 100) return price.toFixed(2)
  return price.toFixed(4)
}

// Fallback static data when AV rate limit hit
const FALLBACKS: PriceResult[] = [
  { symbol: "XAUUSD", price: "3341.20", change: "+11.20", changePct: "+0.34%", up: true, source: "fallback", timestamp: "" },
  { symbol: "EURUSD", price: "1.1342", change: "+0.0021", changePct: "+0.19%", up: true, source: "fallback", timestamp: "" },
  { symbol: "GBPUSD", price: "1.3218", change: "-0.0014", changePct: "-0.11%", up: false, source: "fallback", timestamp: "" },
  { symbol: "NAS100", price: "19,842", change: "+204", changePct: "+1.04%", up: true, source: "fallback", timestamp: "" },
  { symbol: "US500", price: "5,521", change: "+37", changePct: "+0.67%", up: true, source: "fallback", timestamp: "" },
  { symbol: "BTCUSD", price: "93,412", change: "+2104", changePct: "+2.31%", up: true, source: "fallback", timestamp: "" },
  { symbol: "USDJPY", price: "142.31", change: "-0.47", changePct: "-0.33%", up: false, source: "fallback", timestamp: "" },
  { symbol: "WTI", price: "79.42", change: "+0.43", changePct: "+0.54%", up: true, source: "fallback", timestamp: "" },
]

export async function GET(req: NextRequest) {
  // Return cache if fresh
  if (cache.ts && Date.now() - cache.ts < CACHE_TTL && cache.data.length > 0) {
    return NextResponse.json({ data: cache.data, cached: true }, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" }
    })
  }

  const ts = new Date().toISOString()
  const results: PriceResult[] = []

  try {
    // Fetch equity proxies (includes XAUUSD via GLD, NAS100 via QQQ, etc.)
    const equityPromises = EQUITY_PROXIES.map(async ({ symbol, ticker }) => {
      const q = await fetchEquityQuote(ticker)
      if (!q) return null
      const up = q.change >= 0
      const sign = up ? "+" : ""
      return {
        symbol,
        price: fmt(q.price, symbol),
        change: `${sign}${q.change.toFixed(2)}`,
        changePct: `${sign}${q.changePct.toFixed(2)}%`,
        up,
        source: "live" as const,
        timestamp: ts,
      }
    })

    // Fetch forex pairs
    const forexPromises = FOREX_PAIRS.map(async ({ symbol, from, to }) => {
      const q = await fetchForexQuote(from, to)
      if (!q) return null
      const up = q.change >= 0
      const sign = up ? "+" : ""
      const changePct = q.price > 0 ? ((q.change / q.price) * 100).toFixed(2) : "0.00"
      return {
        symbol,
        price: fmt(q.price, symbol),
        change: `${sign}${Math.abs(q.change).toFixed(4)}`,
        changePct: `${sign}${changePct}%`,
        up,
        source: "live" as const,
        timestamp: ts,
      }
    })

    // Fetch crypto
    const cryptoPromises = CRYPTO_PAIRS.map(async ({ symbol, coin }) => {
      const q = await fetchCryptoQuote(coin)
      if (!q) return null
      return {
        symbol,
        price: fmt(q.price, symbol),
        change: "0.00",
        changePct: "0.00%",
        up: true,
        source: "live" as const,
        timestamp: ts,
      }
    })

    const all = await Promise.allSettled([...equityPromises, ...forexPromises, ...cryptoPromises])

    for (const r of all) {
      if (r.status === "fulfilled" && r.value) {
        results.push(r.value)
      }
    }

    // Fill any missing symbols with fallbacks
    for (const fb of FALLBACKS) {
      if (!results.find((r) => r.symbol === fb.symbol)) {
        results.push({ ...fb, timestamp: ts })
      }
    }

    // Sort to consistent order
    const ORDER = ["XAUUSD", "EURUSD", "GBPUSD", "NAS100", "US500", "BTCUSD", "USDJPY", "WTI"]
    results.sort((a, b) => ORDER.indexOf(a.symbol) - ORDER.indexOf(b.symbol))

    // Update cache
    cache.data = results
    cache.ts = Date.now()

    return NextResponse.json({ data: results, cached: false }, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" }
    })
  } catch (err: any) {
    console.error("Market data error:", err)
    // Return fallbacks on total failure
    return NextResponse.json({ data: FALLBACKS.map(f => ({ ...f, timestamp: ts })), cached: false, error: err.message })
  }
}
