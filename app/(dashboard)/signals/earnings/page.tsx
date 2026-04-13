'use client'

import { useNeuralEngineData } from '@/hooks/use-neural-engine-data'
import { RefreshCw, DollarSign, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function EarningsPage() {
  const { earningsSignals, loading, refresh } = useNeuralEngineData()

  const signals = earningsSignals || []

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold font-mono">Earnings Signals</h2>
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
            const expectation = signal.expectation?.toLowerCase()
            const expectColor = expectation === 'beat' ? 'text-green-400' : 
                               expectation === 'miss' ? 'text-red-400' : 'text-yellow-400'
            
            return (
              <Card key={i} className="border-accent/20 bg-card/50 hover:bg-card/70 transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-mono font-bold text-base">{signal.company || signal.ticker || `Earnings ${i + 1}`}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{signal.sector}</p>
                      </div>
                      {signal.expectation && (
                        <Badge className={expectColor === 'text-green-400' ? 'bg-green-500/20 border-green-500/30 text-green-400' :
                                        expectColor === 'text-red-400' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
                                        'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'}>
                          {signal.expectation.toUpperCase()}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      {signal.epsEstimate && (
                        <div>
                          <p className="text-muted-foreground font-mono mb-1">EPS Est.</p>
                          <p className="font-mono font-bold">${signal.epsEstimate}</p>
                        </div>
                      )}
                      {signal.revenueEstimate && (
                        <div>
                          <p className="text-muted-foreground font-mono mb-1">Rev. Est.</p>
                          <p className="font-mono font-bold">${signal.revenueEstimate}M</p>
                        </div>
                      )}
                      {signal.earningsDate && (
                        <div>
                          <p className="text-muted-foreground font-mono mb-1">Date</p>
                          <p className="font-mono font-bold">{new Date(signal.earningsDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {signal.volatilityExpected && (
                        <div>
                          <p className="text-muted-foreground font-mono mb-1">Expected Vol.</p>
                          <p className="font-mono font-bold">{signal.volatilityExpected}%</p>
                        </div>
                      )}
                    </div>

                    {signal.analysis && (
                      <p className="text-xs text-foreground/70 pt-2 border-t border-accent/10">
                        {signal.analysis}
                      </p>
                    )}

                    {signal.tradingStrategy && (
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground font-mono mb-1">Strategy</p>
                        <p className="text-xs text-accent font-mono">{signal.tradingStrategy}</p>
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
            <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No earnings signals available
          </CardContent>
        </Card>
      )}
    </div>
  )
}
