'use client'

import { useState, useEffect } from 'react'
import { Globe, TrendingUp, TrendingDown, Clock, RefreshCw, Star, Bell, Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface MarketPrice {
  symbol: string
  name: string
  price: number
  change: number
  category?: string
  high?: number
  low?: number
}

interface EconomicEvent {
  id: string
  time: string
  currency: string
  event: string
  impact: 'high' | 'medium' | 'low'
  forecast?: string
  previous?: string
  actual?: string
}

const economicEvents: EconomicEvent[] = [
  { id: '1', time: '08:30', currency: 'USD', event: 'Non-Farm Payrolls', impact: 'high', forecast: '180K', previous: '175K' },
  { id: '2', time: '10:00', currency: 'USD', event: 'ISM Manufacturing PMI', impact: 'high', forecast: '52.5', previous: '51.8' },
  { id: '3', time: '14:00', currency: 'EUR', event: 'ECB Interest Rate Decision', impact: 'high', forecast: '4.50%', previous: '4.50%' },
  { id: '4', time: '08:00', currency: 'GBP', event: 'GDP m/m', impact: 'medium', forecast: '0.2%', previous: '0.1%' },
  { id: '5', time: '09:30', currency: 'CHF', event: 'CPI m/m', impact: 'medium', forecast: '0.1%', previous: '0.0%' },
  { id: '6', time: '23:50', currency: 'JPY', event: 'Trade Balance', impact: 'low', forecast: '-0.8T', previous: '-0.6T' },
]

const marketNews = [
  { id: '1', title: 'Fed signals potential rate cuts in Q2 2026', source: 'Reuters', time: '2h ago', impact: 'bullish' as const },
  { id: '2', title: 'Gold rallies to new highs amid geopolitical tensions', source: 'Bloomberg', time: '4h ago', impact: 'bullish' as const },
  { id: '3', title: 'EUR/USD breaks key resistance at 1.0950', source: 'FXStreet', time: '5h ago', impact: 'bullish' as const },
  { id: '4', title: 'Oil prices drop on increased US production data', source: 'CNBC', time: '6h ago', impact: 'bearish' as const },
  { id: '5', title: 'Bitcoin approaches $100K as institutional buying continues', source: 'CoinDesk', time: '8h ago', impact: 'bullish' as const },
]

export default function MacroPage() {
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

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
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredPrices =
    selectedCategory === 'all' ? prices : prices.filter((p) => p.category === selectedCategory)

  const categories = ['all', 'forex', 'crypto', 'commodities', 'indices']

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-green-400">{'>'} MACRO_TERMINAL</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Live markets, economic calendar, and global news
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={fetchPrices} disabled={isLoading} className="border-green-500/30">
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
            <Clock className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="news" className="font-mono">
            <Newspaper className="mr-2 h-4 w-4" />
            News
          </TabsTrigger>
        </TabsList>

        <TabsContent value="markets" className="mt-6 space-y-6">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'bg-green-600 text-black' : 'border-green-500/30'}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading && prices.length === 0
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="border-green-500/20 bg-card/50 animate-pulse">
                    <CardContent className="p-4">
                      <div className="mb-2 h-4 w-1/2 rounded bg-muted" />
                      <div className="mb-2 h-8 w-3/4 rounded bg-muted" />
                      <div className="h-3 w-1/4 rounded bg-muted" />
                    </CardContent>
                  </Card>
                ))
              : filteredPrices.map((price) => (
                  <Card key={price.symbol} className="border-green-500/20 bg-card/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold">{price.symbol}</span>
                          <Badge variant="outline" className="border-cyan-500/30 text-xs">
                            {price.category}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Star className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-mono text-2xl font-bold">
                          {price.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: price.symbol.includes('BTC') ? 2 : 4,
                          })}
                        </span>
                      </div>
                      <div
                        className={`mt-1 flex items-center gap-1 font-mono text-sm ${
                          price.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {price.change >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span>
                          {price.change >= 0 ? '+' : ''}
                          {price.change.toFixed(2)}%
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        <span>H: {price.high?.toFixed(2) || 'N/A'}</span>
                        <span>L: {price.low?.toFixed(2) || 'N/A'}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6 space-y-6">
          <Card className="border-green-500/20 bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-mono text-green-400">Economic Calendar</CardTitle>
                  <CardDescription>Today&apos;s high-impact events</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className={getImpactColor('high')}>
                    High
                  </Badge>
                  <Badge variant="outline" className={getImpactColor('medium')}>
                    Medium
                  </Badge>
                  <Badge variant="outline" className={getImpactColor('low')}>
                    Low
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {economicEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between rounded-lg border border-muted-foreground/20 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{event.time}</span>
                      </div>
                      <Badge variant="outline" className="border-cyan-500/30 font-mono text-xs">
                        {event.currency}
                      </Badge>
                      <div>
                        <span className="font-medium">{event.event}</span>
                        <Badge variant="outline" className={`ml-2 ${getImpactColor(event.impact)}`}>
                          {event.impact}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Forecast</p>
                        <p className="font-mono font-medium text-cyan-400">{event.forecast}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Previous</p>
                        <p className="font-mono font-medium">{event.previous || '-'}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Actual</p>
                        <p className="font-mono font-medium text-green-400">{event.actual || '-'}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="mt-6 space-y-6">
          <div className="space-y-4">
            {marketNews.map((news) => (
              <Card key={news.id} className="border-green-500/20 bg-card/50 cursor-pointer transition-colors hover:bg-card/75">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded border ${
                        news.impact === 'bullish'
                          ? 'border-green-500/30 bg-green-500/10'
                          : 'border-red-500/30 bg-red-500/10'
                      }`}
                    >
                      {news.impact === 'bullish' ? (
                        <TrendingUp className="h-5 w-5 text-green-400" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{news.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{news.source}</span>
                        <span>•</span>
                        <span>{news.time}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      news.impact === 'bullish'
                        ? 'border-green-500/30 text-green-400'
                        : 'border-red-500/30 text-red-400'
                    }
                  >
                    {news.impact.toUpperCase()}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
