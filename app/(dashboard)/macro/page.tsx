'use client'

import { useState, useEffect } from 'react'
import { Globe, TrendingUp, TrendingDown, Clock, Calendar, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface MarketPrice {
  symbol: string
  name: string
  price: number
  change: number
  high?: number
  low?: number
  category?: string
}

export default function MacroPage() {
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchPrices = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/market/live')
      const data = await response.json()
      if (data.prices) {
        setPrices(data.prices)
      }
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error fetching market prices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold">
            {'>'} MACRO_TERMINAL
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Live markets and global data
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPrices}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="markets" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="markets" className="font-mono">
            <Globe className="mr-2 h-4 w-4" />
            Markets
          </TabsTrigger>
          <TabsTrigger value="calendar" className="font-mono">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="markets" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading && prices.length === 0 ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="border-border/50 bg-card/50 animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                    <div className="h-8 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </CardContent>
                </Card>
              ))
            ) : (
              prices.map((price) => (
                <Card key={price.symbol} className="border-border/50 bg-card/50 hover:border-border transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-sm">{price.symbol}</span>
                      {price.category && (
                        <Badge variant="outline" className="text-xs">
                          {price.category}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="font-mono text-2xl font-bold">
                        {price.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className={`mt-2 flex items-center gap-1 font-mono text-sm ${
                      price.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {price.change >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>{price.change >= 0 ? '+' : ''}{price.change.toFixed(2)}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="font-mono">Economic Calendar</CardTitle>
              <CardDescription>Monitor key economic indicators and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm mt-1">14:30 UTC</span>
                    </div>
                    <div>
                      <p className="font-medium">US Core CPI</p>
                      <Badge variant="outline" className="text-xs mt-1">High Impact</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Forecast</p>
                      <p className="font-mono font-medium text-cyan-400">3.2%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Previous</p>
                      <p className="font-mono font-medium">3.3%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
