'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TickerPrice {
  symbol: string
  price: number
  change: number
}

// Initial prices that will be updated
const initialPrices: TickerPrice[] = [
  { symbol: 'XAU/USD', price: 2350.50, change: 0.45 },
  { symbol: 'BTC', price: 67500, change: 1.88 },
  { symbol: 'ETH', price: 3450, change: -1.29 },
  { symbol: 'EUR/USD', price: 1.0852, change: 0.12 },
  { symbol: 'GBP/USD', price: 1.2698, change: -0.08 },
  { symbol: 'USD/JPY', price: 149.52, change: 0.23 },
  { symbol: 'US30', price: 39485.20, change: 0.35 },
  { symbol: 'US500', price: 5198.45, change: 0.28 },
  { symbol: 'SOL', price: 175.20, change: 5.12 },
  { symbol: 'USD/ZAR', price: 18.25, change: 0.66 },
]

export function PriceTicker() {
  const [prices, setPrices] = useState<TickerPrice[]>(initialPrices)

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((current) =>
        current.map((item) => {
          // Small random price change
          const changeAmount = item.price * (Math.random() - 0.5) * 0.001
          const newPrice = item.price + changeAmount
          const newChange = item.change + (Math.random() - 0.5) * 0.1

          return {
            ...item,
            price: parseFloat(newPrice.toFixed(item.price < 10 ? 4 : 2)),
            change: parseFloat(newChange.toFixed(2)),
          }
        })
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Format price based on value
  const formatPrice = (price: number) => {
    if (price < 1) return price.toFixed(4)
    if (price < 100) return price.toFixed(2)
    if (price > 10000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 })
    return price.toFixed(2)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-card border-b border-border overflow-hidden">
      <div className="flex items-center h-full ticker-animate" style={{ width: 'max-content' }}>
        {/* Duplicate prices for seamless loop */}
        {[...prices, ...prices].map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="flex items-center gap-2 px-4 border-r border-border h-full"
          >
            <span className="text-xs text-muted-foreground">{item.symbol}</span>
            <span className="text-sm font-medium text-foreground">
              {formatPrice(item.price)}
            </span>
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
              {item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Live indicator */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 bg-background rounded">
        <span className="relative flex h-2 w-2">
          <span className="pulse-live absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        <span className="text-xs text-muted-foreground">LIVE</span>
      </div>
    </div>
  )
}
