'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface DXYData {
  price: number
  changePercent: number
  spread: number
  trend: 'up' | 'down'
  timestamp: string
}

export function DXYMonitor() {
  const [data, setData] = useState<DXYData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/market/live')
        if (!response.ok) throw new Error('Failed to fetch data')
        
        const marketData = await response.json()
        
        if (marketData.DXY) {
          const changePercent = marketData.DXY.changePercent || 0
          setData({
            price: marketData.DXY.price,
            changePercent,
            spread: Math.random() * 50, // Mock 10Y-2Y spread
            trend: changePercent > 0 ? 'up' : 'down',
            timestamp: new Date().toISOString(),
          })
        }
        setError(null)
      } catch (err) {
        setError('Failed to load DXY data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-card border-accent/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Dollar Index (DXY)</CardTitle>
          {data && (
            <Badge variant="outline" className={data.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
              {data.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(data.changePercent).toFixed(2)}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-32 bg-muted" />
            <Skeleton className="h-4 w-full bg-muted" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : data ? (
          <div className="space-y-3">
            {/* Price */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Current Price</p>
              <p className="text-3xl font-bold text-accent font-mono">{data.price.toFixed(2)}</p>
            </div>

            {/* Yield Spread */}
            <div className="grid grid-cols-2 gap-2 p-2 bg-background/50 rounded border border-accent/20">
              <div>
                <p className="text-xs text-muted-foreground">10Y-2Y Spread</p>
                <p className="text-sm font-mono text-accent">{data.spread.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">24h Change</p>
                <p className={`text-sm font-mono ${data.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {data.trend === 'up' ? '+' : ''}{data.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="text-xs text-muted-foreground">
              <p>Last updated: {new Date(data.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
