'use client'

import { useNeuralEngineData } from '@/hooks/use-neural-engine-data'
import { RefreshCw, Activity, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function SetupsPage() {
  const { aiSignals, loading, refresh } = useNeuralEngineData()

  const setups = aiSignals || []

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold font-mono">Market Setups</h2>
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

      {loading && setups.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-accent/20 bg-card/50 animate-pulse">
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-6 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : setups.length > 0 ? (
        <div className="space-y-3">
          {setups.map((setup, i) => (
            <Card key={i} className="border-accent/20 bg-card/50 hover:bg-card/70 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-accent" />
                      <h3 className="font-mono font-bold">{setup.symbol || setup.name || `Setup ${i + 1}`}</h3>
                      {setup.type && (
                        <Badge variant="outline" className="text-xs border-accent/30">
                          {setup.type}
                        </Badge>
                      )}
                    </div>
                    {setup.description && (
                      <p className="text-sm text-foreground/80 mb-2">{setup.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {setup.entry && (
                        <div>
                          <p className="text-muted-foreground font-mono">Entry:</p>
                          <p className="font-mono font-bold">{setup.entry}</p>
                        </div>
                      )}
                      {setup.target && (
                        <div>
                          <p className="text-muted-foreground font-mono">Target:</p>
                          <p className="font-mono font-bold text-green-400">{setup.target}</p>
                        </div>
                      )}
                      {setup.stopLoss && (
                        <div>
                          <p className="text-muted-foreground font-mono">Stop Loss:</p>
                          <p className="font-mono font-bold text-red-400">{setup.stopLoss}</p>
                        </div>
                      )}
                      {setup.timeframe && (
                        <div>
                          <p className="text-muted-foreground font-mono">Timeframe:</p>
                          <p className="font-mono font-bold">{setup.timeframe}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {setup.confidence && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-mono mb-1">Confidence</p>
                      <p className="font-mono text-lg font-bold text-accent">{setup.confidence}%</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-accent/20 bg-card/50">
          <CardContent className="p-8 text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No setups available
          </CardContent>
        </Card>
      )}
    </div>
  )
}
