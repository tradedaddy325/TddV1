// hooks/useMarketData.ts
// Universal hook — polls /api/market-data every 30s
// Use on: landing page ticker, dashboard market strip, any page needing live prices

"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export type MarketPrice = {
  symbol: string
  price: string
  change: string
  changePct: string
  up: boolean
  source: "live" | "cached" | "fallback"
  timestamp: string
}

const FALLBACK: MarketPrice[] = [
  { symbol: "XAUUSD", price: "3341.20", change: "+11.20", changePct: "+0.34%", up: true, source: "fallback", timestamp: "" },
  { symbol: "EURUSD", price: "1.1342", change: "+0.0021", changePct: "+0.19%", up: true, source: "fallback", timestamp: "" },
  { symbol: "GBPUSD", price: "1.3218", change: "-0.0014", changePct: "-0.11%", up: false, source: "fallback", timestamp: "" },
  { symbol: "NAS100", price: "19,842", change: "+204", changePct: "+1.04%", up: true, source: "fallback", timestamp: "" },
  { symbol: "US500",  price: "5,521",  change: "+37",   changePct: "+0.67%", up: true, source: "fallback", timestamp: "" },
  { symbol: "BTCUSD", price: "93,412", change: "+2104", changePct: "+2.31%", up: true, source: "fallback", timestamp: "" },
  { symbol: "USDJPY", price: "142.31", change: "-0.47", changePct: "-0.33%", up: false, source: "fallback", timestamp: "" },
  { symbol: "WTI",    price: "79.42",  change: "+0.43", changePct: "+0.54%", up: true, source: "fallback", timestamp: "" },
]

type Options = {
  /** Poll interval in ms. Default 30000 (30s) */
  interval?: number
  /** Whether to start polling immediately. Default true */
  enabled?: boolean
}

export function useMarketData({ interval = 30_000, enabled = true }: Options = {}) {
  const [prices, setPrices] = useState<MarketPrice[]>(FALLBACK)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isLive, setIsLive] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch("/api/market-data", { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (json.data && json.data.length > 0) {
        setPrices(json.data)
        setIsLive(json.data.some((d: MarketPrice) => d.source === "live"))
        setLastUpdated(new Date())
        setError(null)
      }
    } catch (e: any) {
      setError(e.message)
      // Keep showing last good data / fallback
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    fetchPrices()
    timerRef.current = setInterval(fetchPrices, interval)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [enabled, interval, fetchPrices])

  const getPrice = useCallback(
    (symbol: string) => prices.find((p) => p.symbol === symbol) ?? null,
    [prices]
  )

  return { prices, loading, error, lastUpdated, isLive, refresh: fetchPrices, getPrice }
}
