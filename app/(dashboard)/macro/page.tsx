'use client'

import { useState, useEffect } from 'react'
import { Globe, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface MarketPrice {
  symbol: string
  name: string
  price: number
  changePercent: number
  category: string
}

export default function MacroPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'crypto', 'forex', 'commodities', 'indices']

  const filteredPrices = selectedCategory === 'all' 
    ? prices 
    : prices.filter(p => p.category === selectedCategory)

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
          <h1 className="font-mono text-2xl font-bold text-primary">
            {'>'} MACRO_TERMINAL
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Live markets, economic calendar, and global news
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
            className="border-accent/30"
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
        </TabsList>

        <TabsContent value="markets" className="mt-6 space-y-6">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat 
                  ? 'bg-accent text-background' 
                  : 'border-accent/30'
                }
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>

          {/* Price Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading && prices.length === 0 ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="border-accent/20 bg-card/50 animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                    <div className="h-8 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </CardContent>
                </Card>
              ))
            ) : filteredPrices.length > 0 ? (
              filteredPrices.map((price) => (
                <Card key={price.symbol} className="border-accent/20 bg-card/50 hover:bg-card/70 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">{price.symbol}</span>
                        <Badge variant="outline" className="border-accent/30 text-xs">
                          {price.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-bold">
                        {price.price.toLocaleString(undefined, { 
                          minimumFractionDigits: 2,
                          maximumFractionDigits: price.symbol.includes('BTC') ? 2 : 4,
                        })}
                      </span>
                    </div>
                    <div className={`mt-1 flex items-center gap-1 font-mono text-sm ${
                      price.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {price.changePercent >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>{price.changePercent >= 0 ? '+' : ''}{price.changePercent.toFixed(2)}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full border-accent/20 bg-card/50">
                <CardContent className="p-8 text-center text-muted-foreground">
                  No market data available
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
