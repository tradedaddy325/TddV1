'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface SmartMoneyData {
  symbol: string
  price: number
  volume: number
  openInterest: number
  flowScore: number
  trend: 'bullish' | 'bearish' | 'neutral'
}

export function SmartMoneyTracker() {
  const [data, setData] = useState<SmartMoneyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/market/live')
        if (!response.ok) throw new Error('Failed to fetch data')

        const marketData = await response.json()
        const btc = marketData.BTC

        if (btc) {
          const flowScore = Math.random() * 100
          const trend =
            flowScore > 60
              ? 'bullish'
              : flowScore < 40
              ? 'bearish'
              : 'neutral'

          setData({
            symbol: 'BTC',
            price: btc.price,
            volume: Math.random() * 1000000000,
            openInterest: Math.random() * 500000000,
            flowScore,
            trend,
          })
        }
        setError(null)
      } catch (err) {
        setError('Failed to load smart money data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 120000) // Update every 2 minutes
    return () => clearInterval(interval)
  }, [])

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return 'bg-green-900/20 text-green-300 border-green-700'
      case 'bearish':
        return 'bg-red-900/20 text-red-300 border-red-700'
      default:
        return 'bg-amber-900/20 text-amber-300 border-amber-700'
    }
  }

  return (
    <Card className="bg-card border-accent/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Smart Money Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Loading State */}
          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-3/4 bg-muted" />
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {/* Data Display */}
          {!loading && data && (
            <>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <p className="text-sm text-muted-foreground">Asset</p>
                <Badge variant="outline" className="text-sm">
                  {data.symbol}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-sm font-medium">${data.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <p className="text-sm text-muted-foreground">Flow Score</p>
                <p className="text-sm font-medium">{data.flowScore.toFixed(1)}%</p>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <p className="text-sm text-muted-foreground">Trend</p>
                <Badge className={`${getTrendColor(data.trend)}`}>
                  {data.trend.toUpperCase()}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-accent/20">
                <p>Volume: ${(data.volume / 1_000_000).toFixed(1)}M</p>
                <p>Open Interest: ${(data.openInterest / 1_000_000).toFixed(1)}M</p>
              </div>
            </>
          )}

          {/* No Data Fallback */}
          {!loading && !error && !data && (
            <p className="text-sm text-muted-foreground">No data available</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
