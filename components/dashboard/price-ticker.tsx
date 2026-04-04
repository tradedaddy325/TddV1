'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TickerPrice {
  symbol: string
  price: number
  change: number
  displayName: string
}

const MARKET_SYMBOLS = [
  { symbol: 'BTCUSD', display: 'BTC/USD' },
  { symbol: 'ETHUSD', display: 'ETH/USD' },
  { symbol: 'XAUUSD', display: 'XAU/USD' },
  { symbol: 'EURUSD', display: 'EUR/USD' },
  { symbol: 'US30', display: 'US30' },
  { symbol: 'USOIL', display: 'USOIL' },
]

export function PriceTicker() {
  const [prices, setPrices] = useState<TickerPrice[]>([])
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const priceMap = new Map<string, TickerPrice>()
    let fetchInterval: NodeJS.Timeout | null = null

    const updatePrices = async () => {
      try {
        const response = await fetch('/api/market/live')
        if (!response.ok) throw new Error('Failed to fetch market data')

        const data = await response.json()
        let hasData = false

        if (data.crypto) {
          Object.entries(data.crypto).forEach(([key, value]: [string, any]) => {
            const symbol = key.toUpperCase() + 'USD'
            if (value.price) {
              const prev = priceMap.get(symbol)
              const change = prev ? ((value.price - prev.price) / prev.price) * 100 : 0
              const found = MARKET_SYMBOLS.find((s) => s.symbol === symbol)
              if (found) {
                priceMap.set(symbol, {
                  symbol,
                  displayName: found.display,
                  price: value.price,
                  change: isNaN(change) ? 0 : change,
                })
                hasData = true
              }
            }
          })
        }

        if (data.forex) {
          Object.entries(data.forex).forEach(([key, value]: [string, any]) => {
            const symbol = key.toUpperCase()
            if (value.price) {
              const prev = priceMap.get(symbol)
              const change = prev ? ((value.price - prev.price) / prev.price) * 100 : 0
              const found = MARKET_SYMBOLS.find((s) => s.symbol === symbol)
              if (found) {
                priceMap.set(symbol, {
                  symbol,
                  displayName: found.display,
                  price: value.price,
                  change: isNaN(change) ? 0 : change,
                })
                hasData = true
              }
            }
          })
        }

        if (data.commodities) {
          Object.entries(data.commodities).forEach(([key, value]: [string, any]) => {
            const symbol = key.toUpperCase()
            if (value.price) {
              const prev = priceMap.get(symbol)
              const change = prev ? ((value.price - prev.price) / prev.price) * 100 : 0
              const found = MARKET_SYMBOLS.find((s) => s.symbol === symbol)
              if (found) {
                priceMap.set(symbol, {
                  symbol,
                  displayName: found.display,
                  price: value.price,
                  change: isNaN(change) ? 0 : change,
                })
                hasData = true
              }
            }
          })
        }

        if (data.indices) {
          Object.entries(data.indices).forEach(([key, value]: [string, any]) => {
            const symbol = key.toUpperCase()
            if (value.price) {
              const prev = priceMap.get(symbol)
              const change = prev ? ((value.price - prev.price) / prev.price) * 100 : 0
              const found = MARKET_SYMBOLS.find((s) => s.symbol === symbol)
              if (found) {
                priceMap.set(symbol, {
                  symbol,
                  displayName: found.display,
                  price: value.price,
                  change: isNaN(change) ? 0 : change,
                })
                hasData = true
              }
            }
          })
        }

        if (hasData) {
          const updatedPrices = MARKET_SYMBOLS.map((s) => priceMap.get(s.symbol)).filter((p): p is TickerPrice => p !== undefined)
          setPrices(updatedPrices)
          setIsLive(true)
        }
      } catch (err) {
        console.error('[PriceTicker] Error:', err)
        setIsLive(false)
      }
    }

    updatePrices()
    fetchInterval = setInterval(updatePrices, 30000)

    return () => {
      if (fetchInterval) clearInterval(fetchInterval)
    }
  }, [])

  const formatPrice = (price: number) => {
    if (price < 1) return price.toFixed(4)
    if (price < 100) return price.toFixed(2)
    if (price > 10000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 })
    return price.toFixed(2)
  }

  if (prices.length === 0) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-card border-b border-border flex items-center px-4">
        <span className="text-xs text-muted-foreground">Loading market prices...</span>
      </div>
    )
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-card border-b border-border overflow-hidden">
      <div className="flex items-center h-full ticker-animate" style={{ width: 'max-content' }}>
        {[...prices, ...prices].map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="flex items-center gap-2 px-3 border-r border-border h-full whitespace-nowrap"
          >
            <span className="text-xs text-muted-foreground font-medium">{item.displayName}</span>
            <span className="text-sm font-semibold text-foreground">{formatPrice(item.price)}</span>
            <span
              className={cn(
                'flex items-center gap-1 text-xs font-semibold',
                item.change >= 0 ? 'text-primary' : 'text-destructive'
              )}
            >
              {item.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="hidden sm:inline">
                {item.change >= 0 ? '+' : ''}
                {Math.abs(item.change).toFixed(2)}%
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 bg-background rounded text-xs">
        <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
        <span className="text-muted-foreground text-xs">{isLive ? 'LIVE' : 'OFFLINE'}</span>
      </div>
    </div>
  )
}
