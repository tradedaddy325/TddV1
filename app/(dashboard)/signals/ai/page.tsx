'use client'

import { useNeuralEngineData } from '@/hooks/use-neural-engine-data'
import { RefreshCw, Zap, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AISignalsPage() {
  const { aiSignals, loading, refresh } = useNeuralEngineData()

  const signals = aiSignals || []

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold font-mono">AI Trading Signals</h2>
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

      {loading && signals.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-accent/20 bg-card/50 animate-pulse">
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-6 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : signals.length > 0 ? (
        <div className="space-y-3">
          {signals.map((signal, i) => {
            const isBullish = signal.direction?.toLowerCase() === 'up' || signal.signal?.toLowerCase() === 'buy'
            return (
              <Card key={i} className="border-accent/20 bg-card/50 hover:bg-card/70 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className={`h-4 w-4 ${isBullish ? 'text-green-400' : 'text-red-400'}`} />
                        <h3 className="font-mono font-bold">{signal.symbol || signal.asset || `Signal ${i + 1}`}</h3>
                        <Badge className={isBullish ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-red-500/20 border-red-500/30 text-red-400'}>
                          {isBullish ? 'BUY' : 'SELL'}
                        </Badge>
                      </div>
                      
                      {signal.analysis && (
                        <p className="text-sm text-foreground/80 mb-3">{signal.analysis}</p>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        {signal.price && (
                          <div>
                            <p className="text-muted-foreground font-mono mb-1">Current Price</p>
                            <p className="font-mono font-bold">${signal.price}</p>
                          </div>
                        )}
                        {signal.target && (
                          <div>
                            <p className="text-muted-foreground font-mono mb-1">Target</p>
                            <p className="font-mono font-bold text-green-400">${signal.target}</p>
                          </div>
                        )}
                        {signal.strength && (
                          <div>
                            <p className="text-muted-foreground font-mono mb-1">Strength</p>
                            <p className="font-mono font-bold">{signal.strength}</p>
                          </div>
                        )}
                        {signal.timeframe && (
                          <div>
                            <p className="text-muted-foreground font-mono mb-1">Timeframe</p>
                            <p className="font-mono font-bold">{signal.timeframe}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {signal.confidence && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground font-mono mb-1">Confidence</p>
                        <p className="font-mono text-lg font-bold text-accent">{signal.confidence}%</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-accent/20 bg-card/50">
          <CardContent className="p-8 text-center text-muted-foreground">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No AI signals available
          </CardContent>
        </Card>
      )}
    </div>
  )
}
