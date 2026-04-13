'use client'

import { useNeuralEngineData } from '@/hooks/use-neural-engine-data'
import { TrendingUp, TrendingDown, RefreshCw, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PredictiveMarketsPage() {
  const { predictiveMarkets, loading, refresh } = useNeuralEngineData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-primary">
            {'>'} PREDICTIVE_MARKETS
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            AI-powered market predictions and opportunity identification
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refresh}
          disabled={loading}
          className="border-accent/30"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading && !predictiveMarkets ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-accent/20 bg-card/50 animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : predictiveMarkets ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(predictiveMarkets).map(([key, value]: [string, any]) => {
            const isPositive = value?.confidence > 50 || value?.direction === 'up'
            return (
              <Card key={key} className="border-accent/20 bg-card/50 hover:bg-card/70 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-mono">{key.toUpperCase()}</CardTitle>
                    <Badge variant="outline" className={`${isPositive ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}`}>
                      {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {isPositive ? 'Bullish' : 'Bearish'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground font-mono mb-1">Confidence</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted/50 rounded h-2">
                        <div 
                          className={`h-full rounded ${isPositive ? 'bg-green-500/70' : 'bg-red-500/70'}`}
                          style={{ width: `${(value?.confidence || 0) / 100 * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-sm font-bold">{(value?.confidence || 0).toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  {value?.target && (
                    <div>
                      <p className="text-xs text-muted-foreground font-mono mb-1">Price Target</p>
                      <p className="font-mono text-lg font-bold">${value.target.toFixed(2)}</p>
                    </div>
                  )}
                  
                  {value?.timeframe && (
                    <div>
                      <p className="text-xs text-muted-foreground font-mono mb-1">Timeframe</p>
                      <p className="font-mono text-sm">{value.timeframe}</p>
                    </div>
                  )}

                  {value?.reasoning && (
                    <div className="pt-2 border-t border-accent/10">
                      <p className="text-xs text-muted-foreground font-mono mb-1">Analysis</p>
                      <p className="text-xs leading-relaxed text-foreground/80">{value.reasoning}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-accent/20 bg-card/50">
          <CardContent className="p-8 text-center text-muted-foreground">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No predictive market data available
          </CardContent>
        </Card>
      )}
    </div>
  )
}
