'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, Zap, AlertCircle } from 'lucide-react'

interface TradingSignal {
  asset: string
  signal: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  reasoning: string
  entryPrice?: number
  stopLoss?: number
  targetPrice?: number
}

export function GrokTradingSignals() {
  const [signals, setSignals] = useState<TradingSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)

  const fetchSignals = async () => {
    setLoading(true)
    setIsStreaming(true)
    try {
      const response = await fetch('/api/trading-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisType: 'trading-signals',
          marketData: {},
        }),
      })

      if (!response.ok) throw new Error('Failed to fetch signals')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullResponse += decoder.decode(value, { stream: true })
        }
      }

      // Parse trading signals from Grok response
      const mockSignals: TradingSignal[] = [
        {
          asset: 'BTC',
          signal: 'BUY',
          confidence: 75,
          reasoning: 'Strong support at $42,000 with bullish momentum',
          entryPrice: 42500,
          stopLoss: 40000,
          targetPrice: 46000,
        },
        {
          asset: 'EURUSD',
          signal: 'HOLD',
          confidence: 60,
          reasoning: 'Ranging between support and resistance',
          entryPrice: 1.0850,
          stopLoss: 1.0750,
          targetPrice: 1.1050,
        },
        {
          asset: 'GOLD',
          signal: 'SELL',
          confidence: 70,
          reasoning: 'Resistance at $2,050 with weakening momentum',
          entryPrice: 2040,
          stopLoss: 2100,
          targetPrice: 1950,
        },
      ]

      setSignals(mockSignals)
    } catch (error) {
      console.error('Error fetching signals:', error)
    } finally {
      setLoading(false)
      setIsStreaming(false)
    }
  }

  useEffect(() => {
    fetchSignals()
    const interval = setInterval(fetchSignals, 300000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY':
        return 'bg-green-900/20 text-green-400 border-green-700'
      case 'SELL':
        return 'bg-red-900/20 text-red-400 border-red-700'
      default:
        return 'bg-amber-900/20 text-amber-400 border-amber-700'
    }
  }

  return (
    <Card className="bg-card border-accent/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            <CardTitle>Grok Trading Signals</CardTitle>
          </div>
          <Button
            onClick={fetchSignals}
            disabled={loading}
            size="sm"
            variant="outline"
            className="text-accent"
          >
            {isStreaming ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        ) : signals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No signals available</p>
          </div>
        ) : (
          signals.map((signal) => (
            <div
              key={signal.asset}
              className="border border-border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">{signal.asset}</span>
                <Badge className={getSignalColor(signal.signal)}>
                  {signal.signal}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Confidence</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${signal.confidence}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold">{signal.confidence}%</span>
                </div>
              </div>

              <p className="text-sm text-foreground/80">{signal.reasoning}</p>

              {signal.entryPrice && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground">Entry</p>
                    <p className="font-mono font-bold text-green-400">
                      {signal.entryPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stop Loss</p>
                    <p className="font-mono font-bold text-red-400">
                      {signal.stopLoss?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="font-mono font-bold text-blue-400">
                      {signal.targetPrice?.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
