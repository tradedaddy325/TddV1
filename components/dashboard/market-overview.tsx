'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MarketPrice {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

// Initial market data
const initialData: Record<string, MarketPrice[]> = {
  gold: [
    { symbol: 'XAU/USD', name: 'Gold Spot', price: 2350.50, change: 12.30, changePercent: 0.53 },
    { symbol: 'XAG/USD', name: 'Silver Spot', price: 27.85, change: -0.22, changePercent: -0.78 },
  ],
  forex: [
    { symbol: 'EUR/USD', name: 'Euro / Dollar', price: 1.0852, change: 0.0012, changePercent: 0.11 },
    { symbol: 'GBP/USD', name: 'Pound / Dollar', price: 1.2698, change: -0.0018, changePercent: -0.14 },
    { symbol: 'USD/JPY', name: 'Dollar / Yen', price: 149.52, change: 0.35, changePercent: 0.23 },
    { symbol: 'USD/ZAR', name: 'Dollar / Rand', price: 18.25, change: 0.12, changePercent: 0.66 },
    { symbol: 'AUD/USD', name: 'Aussie / Dollar', price: 0.6612, change: 0.0008, changePercent: 0.12 },
  ],
  crypto: [
    { symbol: 'BTC/USD', name: 'Bitcoin', price: 67500, change: 1250, changePercent: 1.88 },
    { symbol: 'ETH/USD', name: 'Ethereum', price: 3450, change: -45, changePercent: -1.29 },
    { symbol: 'SOL/USD', name: 'Solana', price: 175.20, change: 8.50, changePercent: 5.10 },
    { symbol: 'XRP/USD', name: 'Ripple', price: 0.52, change: 0.02, changePercent: 4.00 },
  ],
  indices: [
    { symbol: 'US30', name: 'Dow Jones', price: 39485.20, change: 138.50, changePercent: 0.35 },
    { symbol: 'US500', name: 'S&P 500', price: 5198.45, change: 14.80, changePercent: 0.29 },
    { symbol: 'US100', name: 'Nasdaq 100', price: 18245.30, change: -42.10, changePercent: -0.23 },
    { symbol: 'UK100', name: 'FTSE 100', price: 8125.60, change: 28.40, changePercent: 0.35 },
  ],
}

export function MarketOverview() {
  const [data, setData] = useState(initialData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null)

  // Simulate live price updates
  useEffect(() => {
    // Set initial time on mount
    setLastUpdateTime(new Date().toLocaleTimeString())

    const interval = setInterval(() => {
      setData((current) => {
        const updated: Record<string, MarketPrice[]> = {}
        for (const [category, prices] of Object.entries(current)) {
          updated[category] = prices.map((item) => {
            const changeAmount = item.price * (Math.random() - 0.5) * 0.002
            const newPrice = item.price + changeAmount
            const newChangePercent = item.changePercent + (Math.random() - 0.5) * 0.1
            return {
              ...item,
              price: parseFloat(newPrice.toFixed(item.price < 10 ? 4 : 2)),
              change: parseFloat((newPrice - (item.price - item.change)).toFixed(item.price < 10 ? 4 : 2)),
              changePercent: parseFloat(newChangePercent.toFixed(2)),
            }
          })
        }
        return updated
      })
      setLastUpdateTime(new Date().toLocaleTimeString())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setLastUpdateTime(new Date().toLocaleTimeString())
      setIsRefreshing(false)
    }, 500)
  }

  const formatPrice = (price: number) => {
    if (price < 1) return price.toFixed(4)
    if (price < 100) return price.toFixed(2)
    if (price > 10000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 })
    return price.toFixed(2)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">
            Market Overview
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastUpdateTime && (
              <span className="text-xs text-muted-foreground">
                Last: {lastUpdateTime}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn('h-3 w-3', isRefreshing && 'animate-spin')} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gold" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-secondary">
            <TabsTrigger value="gold" className="text-xs">GOLD</TabsTrigger>
            <TabsTrigger value="forex" className="text-xs">FOREX</TabsTrigger>
            <TabsTrigger value="crypto" className="text-xs">CRYPTO</TabsTrigger>
            <TabsTrigger value="indices" className="text-xs">INDICES</TabsTrigger>
          </TabsList>

          {Object.entries(data).map(([category, prices]) => (
            <TabsContent key={category} value={category} className="mt-4">
              <div className="space-y-2">
                {prices.map((item) => (
                  <div
                    key={item.symbol}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded border border-border hover:border-primary/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.symbol}</p>
                      <p className="text-xs text-muted-foreground">{item.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-medium text-foreground">
                        {formatPrice(item.price)}
                      </p>
                      <div className={cn(
                        'flex items-center justify-end gap-1 text-xs',
                        item.changePercent >= 0 ? 'text-primary' : 'text-destructive'
                      )}>
                        {item.changePercent >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>
                          {item.changePercent >= 0 ? '+' : ''}
                          {item.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
