'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

export function LiveMarketCarousel() {
  const [markets, setMarkets] = useState<MarketData[]>([])
  const [isLive, setIsLive] = useState(false)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market/live', {
          cache: 'no-store',
        })

        if (!response.ok) {
          console.warn('[v0] Market API error:', response.status)
          setIsLive(false)
          return
        }

        const data = await response.json()
        setIsLive(true)

        const formattedMarkets: MarketData[] = []

        if (data.crypto) {
          Object.entries(data.crypto).forEach(([key, value]: [string, any]) => {
            if (value.price && value.change !== undefined) {
              formattedMarkets.push({
                symbol: key.toUpperCase(),
                name: key === 'btc' ? 'Bitcoin' : key === 'eth' ? 'Ethereum' : key,
                price: value.price,
                change: value.change,
                changePercent: value.changePercent || 0,
              })
            }
          })
        }

        if (data.forex) {
          Object.entries(data.forex).forEach(([key, value]: [string, any]) => {
            if (value.price && value.change !== undefined) {
              formattedMarkets.push({
                symbol: key.toUpperCase(),
                name: key.toUpperCase(),
                price: value.price,
                change: value.change,
                changePercent: value.changePercent || 0,
              })
            }
          })
        }

        if (data.commodities) {
          Object.entries(data.commodities).forEach(([key, value]: [string, any]) => {
            if (value.price && value.change !== undefined) {
              formattedMarkets.push({
                symbol: key.toUpperCase(),
                name: key.toUpperCase(),
                price: value.price,
                change: value.change,
                changePercent: value.changePercent || 0,
              })
            }
          })
        }

        if (formattedMarkets.length > 0) {
          setMarkets(formattedMarkets)
        }
      } catch (err) {
        console.error('[v0] Market data error:', err)
        setIsLive(false)
      }
    }

    fetchMarketData()
    pollIntervalRef.current = setInterval(fetchMarketData, 5000)

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [])

  if (markets.length === 0) {
    return (
      <div className="w-full h-12 bg-card border-b border-border flex items-center px-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">[</span>
          <span className="text-xs text-cyan-400 font-mono animate-pulse">●</span>
          <span className="text-xs text-muted-foreground font-mono">] Loading market data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-card border-b border-border overflow-hidden">
      <div className="flex items-center h-12 ticker-animate" style={{ width: 'max-content' }}>
        {[...markets, ...markets].map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="flex items-center gap-2 px-4 border-r border-border/30 h-full whitespace-nowrap"
          >
            <span className="text-xs text-muted-foreground font-mono">{item.symbol}</span>
            <span className="text-sm font-semibold text-foreground">
              ${item.price.toFixed(2)}
            </span>
            <span
              className={cn(
                'flex items-center gap-1 text-xs font-semibold',
                item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
              )}
            >
              {item.changePercent >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(item.changePercent).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 bg-background rounded text-xs">
        <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-muted'}`} />
        <span className="text-muted-foreground text-xs">{isLive ? 'LIVE' : 'OFFLINE'}</span>
      </div>
    </div>
  )
}
