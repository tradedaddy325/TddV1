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

const demoPrices: TickerPrice[] = MARKET_SYMBOLS.map((s) => ({
  symbol: s.symbol,
  displayName: s.display,
  price: Math.random() * 100000,
  change: (Math.random() - 0.5) * 5,
}))

export function PriceTicker() {
  const [prices, setPrices] = useState<TickerPrice[]>(demoPrices)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const priceMap = new Map<string, TickerPrice>()
    let fetchInterval: NodeJS.Timeout | null = null

    MARKET_SYMBOLS.forEach((s) => {
      priceMap.set(s.symbol, {
        symbol: s.symbol,
        displayName: s.display,
        price: demoPrices.find((p) => p.symbol === s.symbol)?.price || 0,
        change: 0,
      })
    })

    const updatePrices = async () => {
      try {
        const response = await fetch('/api/market/live')
        if (!response.ok) throw new Error('Failed to fetch market data')

        const data = await response.json()
        const updatedMap = new Map(priceMap)

        if (data.crypto) {
          Object.entries(data.crypto).forEach(([key, value]: [string, any]) => {
            const symbol = key.toUpperCase()
            if (value.price) {
              const prev = updatedMap.get(symbol)
              const change = prev ? ((value.price - prev.price) / prev.price) * 100 : 0
              const found = MARKET_SYMBOLS.find((s) => s.symbol === symbol)
              if (found) {
                updatedMap.set(symbol, {
                  symbol,
                  displayName: found.display,
                  price: value.price,
                  change: isNaN(change) ? 0 : change,
                })
              }
            }
          })
        }

        if (data.forex) {
          Object.entries(data.forex).forEach(([key, value]: [string, any]) => {
            const symbol = key.toUpperCase()
            if (value.price) {
              const prev = updatedMap.get(symbol)
              const change = prev ? ((value.price - prev.price) / prev.price) * 100 : 0
              const found = MARKET_SYMBOLS.find((s) => s.symbol === symbol)
              if (found) {
                updatedMap.set(symbol, {
                  symbol,
                  displayName: found.display,
                  price: value.price,
                  change: isNaN(change) ? 0 : change,
                })
              }
            }
          })
        }

        if (data.commodities) {
          Object.entries(data.commodities).forEach(([key, value]: [string, any]) => {
            const symbol = key.toUpperCase()
            if (value.price) {
              const prev = updatedMap.get(symbol)
              const change = prev ? ((value.price - prev.price) / prev.price) * 100 : 0
              const found = MARKET_SYMBOLS.find((s) => s.symbol === symbol)
              if (found) {
                updatedMap.set(symbol, {
                  symbol,
                  displayName: found.display,
                  price: value.price,
                  change: isNaN(change) ? 0 : change,
                })
              }
            }
          })
        }

        if (data.indices) {
          Object.entries(data.indices).forEach(([key, value]: [string, any]) => {
            const symbol = key.toUpperCase()
            if (value.price) {
              const prev = updatedMap.get(symbol)
              const change = prev ? ((value.price - prev.price) / prev.price) * 100 : 0
              const found = MARKET_SYMBOLS.find((s) => s.symbol === symbol)
              if (found) {
                updatedMap.set(symbol, {
                  symbol,
                  displayName: found.display,
                  price: value.price,
                  change: isNaN(change) ? 0 : change,
                })
              }
            }
          })
        }

        const updatedPrices = MARKET_SYMBOLS.map((s) => updatedMap.get(s.symbol) || demoPrices.find((p) => p.symbol === s.symbol)!)
        setPrices(updatedPrices)
        setIsLive(true)
      } catch (err) {
        setIsLive(false)
        setPrices((current) =>
          current.map((p) => ({
            ...p,
            price: p.price * (1 + (Math.random() - 0.5) * 0.001),
            change: p.change + (Math.random() - 0.5) * 0.1,
          }))
        )
      }
    }

    updatePrices()
    fetchInterval = setInterval(updatePrices, 3000)

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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-card border-b border-border overflow-hidden">
      <div className="flex items-center h-full ticker-animate" style={{ width: 'max-content' }}>
        {[...prices, ...prices].map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="flex items-center gap-2 px-4 border-r border-border h-full whitespace-nowrap"
          >
            <span className="text-xs text-muted-foreground">{item.displayName}</span>
            <span className="text-sm font-medium text-foreground">{formatPrice(item.price)}</span>
            <span
              className={cn(
                'flex items-center gap-0.5 text-xs font-medium',
                item.change >= 0 ? 'text-primary' : 'text-destructive'
              )}
            >
              {item.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {item.change >= 0 ? '+' : ''}
              {Math.abs(item.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 bg-background rounded text-xs">
        <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
        <span className="text-muted-foreground">{isLive ? 'LIVE' : 'DEMO'}</span>
      </div>
    </div>
  )
}
