"use client"

import { useState, useEffect, useCallback, useRef } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LivePrice {
  symbol: string
  price: string
  changePercent: string
  isPositive: boolean
  source: string
  loading: boolean
}

export type PriceMap = Record<string, LivePrice>

// ─── Constants ────────────────────────────────────────────────────────────────

export const TICKER_SYMBOLS = ["XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "NAS100", "US500", "BTCUSD", "WTI"]
export const MARKET_SYMBOLS = ["XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "NAS100", "US500", "US30", "BTCUSD", "ETHUSD", "WTI"]

// ─── Display helpers ──────────────────────────────────────────────────────────

export function formatPrice(symbol: string, price: string): string {
  if (!price || price === "–") return "–"
  const n = parseFloat(price)
  if (isNaN(n)) return price
  if (["NAS100", "US500", "US30", "XAUUSD", "BTCUSD", "ETHUSD", "WTI"].includes(symbol)) {
    return n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return n.toFixed(5)
}

export function symbolLabel(symbol: string): string {
  const labels: Record<string, string> = {
    XAUUSD: "Gold / USD",
    EURUSD: "EUR / USD",
    GBPUSD: "GBP / USD",
    USDJPY: "USD / JPY",
    AUDUSD: "AUD / USD",
    USDCAD: "USD / CAD",
    NAS100: "Nasdaq 100",
    US500: "S&P 500",
    US30: "Dow Jones",
    BTCUSD: "Bitcoin / USD",
    ETHUSD: "Ethereum / USD",
    WTI: "WTI Crude Oil",
  }
  return labels[symbol] || symbol
}

// ─── Hook: terminal interval (15s) ───────────────────────────────────────────

export function useLivePrices(
  symbols: string[],
  intervalMs: number = 15_000
): { prices: PriceMap; lastUpdated: Date | null; refresh: () => void } {
  const [prices, setPrices] = useState<PriceMap>(() =>
    Object.fromEntries(
      symbols.map((s) => [
        s,
        { symbol: s, price: "–", changePercent: "0.00", isPositive: true, source: "", loading: true },
      ])
    )
  )
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const symbolsKey = symbols.join(",")
  const isMounted = useRef(true)

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch(`/api/prices?symbols=${symbolsKey}`, { cache: "no-store" })
      if (!res.ok) return
      const data = await res.json()
      if (!isMounted.current) return

      setPrices((prev) => {
        const next = { ...prev }
        for (const sym of symbolsKey.split(",")) {
          const entry = data[sym]
          if (entry) {
            const chg = parseFloat(entry.changePercent ?? "0")
            next[sym] = {
              symbol: sym,
              price: entry.price ?? "–",
              changePercent: (chg >= 0 ? "+" : "") + chg.toFixed(2) + "%",
              isPositive: chg >= 0,
              source: entry.source ?? "",
              loading: false,
            }
          } else {
            next[sym] = { ...next[sym], loading: false }
          }
        }
        return next
      })
      setLastUpdated(new Date())
    } catch {
      // silently fail — keep existing prices
    }
  }, [symbolsKey])

  useEffect(() => {
    isMounted.current = true
    fetchPrices()
    const interval = setInterval(fetchPrices, intervalMs)
    return () => {
      isMounted.current = false
      clearInterval(interval)
    }
  }, [fetchPrices, intervalMs])

  return { prices, lastUpdated, refresh: fetchPrices }
}

// ─── Hook: ticker (4h refresh — landing page only) ────────────────────────────

export function useTickerPrices(symbols: string[]) {
  return useLivePrices(symbols, 4 * 60 * 60 * 1_000) // 4 hours
}

// ─── Hook: terminal components (15s refresh) ─────────────────────────────────

export function useTerminalPrices(symbols: string[]) {
  return useLivePrices(symbols, 15_000)
}
