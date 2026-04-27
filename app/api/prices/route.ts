/**
 * /api/prices
 *
 * Fetches live prices for TradeDaddy Terminal.
 *
 * PRIMARY: Twelve Data API — free tier 800 credits/day, covers all our symbols
 * FALLBACK: Frankfurter.app for Forex (no key needed), static for indices
 *
 * GET /api/prices?symbols=XAUUSD,EURUSD,GBPUSD,NAS100,US500,BTCUSD,USDJPY,WTI
 *
 * Returns:
 * {
 *   XAUUSD: { price: "3341.20", changePercent: "0.82", source: "twelvedata" },
 *   ...
 * }
 */

import { NextRequest, NextResponse } from "next/server"

// ─── Symbol mapping ────────────────────────────────────────────────────────────

// Maps our symbols to Twelve Data format
const TWELVE_DATA_SYMBOLS: Record<string, string> = {
  XAUUSD: "XAU/USD",
  EURUSD: "EUR/USD",
  GBPUSD: "GBP/USD",
  USDJPY: "USD/JPY",
  AUDUSD: "AUD/USD",
  USDCAD: "USD/CAD",
  NAS100: "NDX",
  US500: "SPX",
  US30: "DJI",
  BTCUSD: "BTC/USD",
  ETHUSD: "ETH/USD",
  WTI: "WTI/USD",
}

// ─── In-memory cache (persists across warm Lambda invocations) ─────────────────

interface CachedPrice {
  price: string
  changePercent: string
  source: string
  cachedAt: number
}

const priceCache = new Map<string, CachedPrice>()
const CACHE_TTL_MS = 30_000 // 30 seconds

function getCached(symbol: string): CachedPrice | null {
  const entry = priceCache.get(symbol)
  if (!entry) return null
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) return null
  return entry
}

function setCache(symbol: string, data: Omit<CachedPrice, "cachedAt">) {
  priceCache.set(symbol, { ...data, cachedAt: Date.now() })
}

// ─── Twelve Data batch fetch ──────────────────────────────────────────────────

async function fetchTwelveData(symbols: string[]): Promise<Record<string, CachedPrice>> {
  const apiKey = process.env.TWELVE_DATA_API_KEY || process.env.TWELVEDATA_API_KEY

  if (!apiKey) {
    console.log("[prices] No TWELVE_DATA_API_KEY set, skipping Twelve Data")
    return {}
  }

  // Build comma-separated list of Twelve Data symbols
  const tdSymbols = symbols
    .map((s) => TWELVE_DATA_SYMBOLS[s])
    .filter(Boolean)
    .join(",")

  if (!tdSymbols) return {}

  try {
    const url = `https://api.twelvedata.com/price?symbol=${encodeURIComponent(tdSymbols)}&apikey=${apiKey}`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`Twelve Data HTTP ${res.status}`)
    const json = await res.json()

    // Check for API-level errors
    if (json.status === "error") {
      console.error("[prices] Twelve Data error:", json.message)
      return {}
    }

    const result: Record<string, CachedPrice> = {}

    // If single symbol returned, it's not wrapped in the symbol key
    if (symbols.length === 1) {
      const sym = symbols[0]
      if (json.price) {
        result[sym] = { price: parseFloat(json.price).toFixed(getDecimals(sym)).toString(), changePercent: "0.00", source: "twelvedata" }
      }
      return result
    }

    // Multiple symbols returned as { "EUR/USD": { price: "..." }, ... }
    for (const [ourSymbol, tdSymbol] of Object.entries(TWELVE_DATA_SYMBOLS)) {
      if (!symbols.includes(ourSymbol)) continue
      const entry = json[tdSymbol]
      if (entry && entry.price && !entry.code) {
        result[ourSymbol] = {
          price: parseFloat(entry.price).toFixed(getDecimals(ourSymbol)).toString(),
          changePercent: "0.00",
          source: "twelvedata",
        }
      }
    }

    return result
  } catch (err) {
    console.error("[prices] Twelve Data fetch error:", err)
    return {}
  }
}

// ─── Twelve Data with percent change ─────────────────────────────────────────

async function fetchTwelveDataWithChange(symbols: string[]): Promise<Record<string, CachedPrice>> {
  const apiKey = process.env.TWELVE_DATA_API_KEY || process.env.TWELVEDATA_API_KEY

  if (!apiKey) return {}

  const tdSymbols = symbols
    .map((s) => TWELVE_DATA_SYMBOLS[s])
    .filter(Boolean)
    .join(",")

  if (!tdSymbols) return {}

  try {
    // Use quote endpoint for price + percent change in one call
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(tdSymbols)}&apikey=${apiKey}`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`Twelve Data quote HTTP ${res.status}`)
    const json = await res.json()

    if (json.status === "error" || json.code) {
      console.error("[prices] Twelve Data quote error:", json.message || json)
      // Fall back to price-only endpoint
      return fetchTwelveData(symbols)
    }

    const result: Record<string, CachedPrice> = {}

    const processEntry = (ourSymbol: string, entry: Record<string, string>) => {
      if (!entry || entry.status === "error" || entry.code) return
      const price = parseFloat(entry.close || entry.price || "0")
      const open = parseFloat(entry.open || entry.previous_close || "0")
      const change = open > 0 ? ((price - open) / open) * 100 : 0

      result[ourSymbol] = {
        price: price.toFixed(getDecimals(ourSymbol)).toString(),
        changePercent: change.toFixed(2),
        source: "twelvedata",
      }
    }

    if (symbols.length === 1) {
      processEntry(symbols[0], json)
    } else {
      for (const [ourSymbol, tdSymbol] of Object.entries(TWELVE_DATA_SYMBOLS)) {
        if (!symbols.includes(ourSymbol)) continue
        processEntry(ourSymbol, json[tdSymbol])
      }
    }

    return result
  } catch (err) {
    console.error("[prices] Twelve Data quote error:", err)
    return fetchTwelveData(symbols)
  }
}

// ─── Frankfurter fallback for Forex pairs ────────────────────────────────────

async function fetchFrankfurterForex(symbols: string[]): Promise<Record<string, CachedPrice>> {
  // Frankfurter covers major forex — free, no key needed
  const forexSymbols = symbols.filter((s) =>
    ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD"].includes(s)
  )
  if (forexSymbols.length === 0) return {}

  try {
    const result: Record<string, CachedPrice> = {}
    // EUR/USD base
    const res = await fetch("https://api.frankfurter.app/latest?from=EUR&to=USD,GBP,JPY,AUD,CAD", {
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error("Frankfurter HTTP error")
    const data = await res.json()

    const rates = data.rates || {}
    const map: Record<string, () => string> = {
      EURUSD: () => rates.USD?.toFixed(5),
      GBPUSD: () => (1 / rates.GBP * rates.USD).toFixed(5),
      USDJPY: () => (rates.JPY / rates.USD).toFixed(3),
      AUDUSD: () => (rates.USD / rates.AUD).toFixed(5),
      USDCAD: () => (rates.CAD / rates.USD).toFixed(5),
    }

    for (const sym of forexSymbols) {
      try {
        const price = map[sym]?.()
        if (price) {
          result[sym] = { price, changePercent: "0.00", source: "frankfurter" }
        }
      } catch {
        // skip
      }
    }
    return result
  } catch (err) {
    console.error("[prices] Frankfurter error:", err)
    return {}
  }
}

// ─── Alpha Vantage fallback (if key exists) ───────────────────────────────────

async function fetchAlphaVantage(symbol: string): Promise<CachedPrice | null> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY
  if (!apiKey) return null

  // Alpha Vantage Forex
  const forexMap: Record<string, [string, string]> = {
    EURUSD: ["EUR", "USD"],
    GBPUSD: ["GBP", "USD"],
    USDJPY: ["USD", "JPY"],
    AUDUSD: ["AUD", "USD"],
    USDCAD: ["USD", "CAD"],
  }

  try {
    if (forexMap[symbol]) {
      const [from, to] = forexMap[symbol]
      const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${apiKey}`
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      const json = await res.json()
      const rate = json?.["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"]
      if (rate) {
        return { price: parseFloat(rate).toFixed(getDecimals(symbol)).toString(), changePercent: "0.00", source: "alphavantage" }
      }
    }

    if (symbol === "XAUUSD") {
      const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${apiKey}`
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      const json = await res.json()
      const rate = json?.["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"]
      if (rate) {
        return { price: parseFloat(rate).toFixed(2).toString(), changePercent: "0.00", source: "alphavantage" }
      }
    }
  } catch (err) {
    console.error(`[prices] Alpha Vantage error for ${symbol}:`, err)
  }
  return null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDecimals(symbol: string): number {
  if (["XAUUSD", "WTI"].includes(symbol)) return 2
  if (["NAS100", "US500", "US30", "BTCUSD"].includes(symbol)) return 2
  if (["USDJPY"].includes(symbol)) return 3
  return 5
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const symbolsParam = searchParams.get("symbols") || "XAUUSD,EURUSD,GBPUSD,NAS100,US500,BTCUSD,USDJPY,WTI"
  const symbols = symbolsParam.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean)

  const result: Record<string, CachedPrice> = {}
  const symbolsToFetch: string[] = []

  // Return cached prices first
  for (const sym of symbols) {
    const cached = getCached(sym)
    if (cached) {
      result[sym] = cached
    } else {
      symbolsToFetch.push(sym)
    }
  }

  if (symbolsToFetch.length > 0) {
    console.log(`[prices] Fetching live prices for: ${symbolsToFetch.join(", ")}`)

    // Try Twelve Data first (best coverage)
    const twelveDataPrices = await fetchTwelveDataWithChange(symbolsToFetch)

    // For any remaining symbols, try fallbacks
    const remaining = symbolsToFetch.filter((s) => !twelveDataPrices[s])

    let fallbackPrices: Record<string, CachedPrice> = {}

    if (remaining.length > 0) {
      // Try Alpha Vantage for single symbols if key exists
      const alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY
      if (alphaVantageKey && remaining.length <= 2) {
        for (const sym of remaining) {
          const avPrice = await fetchAlphaVantage(sym)
          if (avPrice) fallbackPrices[sym] = avPrice
        }
      }

      // Try Frankfurter for Forex
      const stillRemaining = remaining.filter((s) => !fallbackPrices[s])
      if (stillRemaining.length > 0) {
        const frankfurterPrices = await fetchFrankfurterForex(stillRemaining)
        fallbackPrices = { ...fallbackPrices, ...frankfurterPrices }
      }
    }

    const allFetched = { ...twelveDataPrices, ...fallbackPrices }

    for (const [sym, data] of Object.entries(allFetched)) {
      setCache(sym, data)
      result[sym] = data
    }

    // Log what we got vs what failed
    const fetched = Object.keys(allFetched)
    const failed = symbolsToFetch.filter((s) => !fetched.includes(s))
    if (failed.length > 0) {
      console.error(`[prices] Failed to fetch prices for: ${failed.join(", ")} — check TWELVE_DATA_API_KEY env var`)
    }
  }

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
