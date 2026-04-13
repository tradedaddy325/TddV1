'use client'

import { useNeuralEngineData } from '@/hooks/use-neural-engine-data'
import { RefreshCw, Newspaper, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function NewsSignalsPage() {
  const { newsSignals, loading, refresh } = useNeuralEngineData()

  const signals = newsSignals || []

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold font-mono">News Signals</h2>
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
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-accent/20 bg-card/50 animate-pulse">
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-6 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : signals.length > 0 ? (
        <div className="space-y-3">
          {signals.map((signal, i) => {
            const impactLevel = signal.impact?.toLowerCase() || 'neutral'
            const impactColor = impactLevel === 'high' ? 'bg-red-500/20 border-red-500/30 text-red-400' : 
                              impactLevel === 'medium' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' :
                              'bg-green-500/20 border-green-500/30 text-green-400'
            
            return (
              <Card key={i} className="border-accent/20 bg-card/50 hover:bg-card/70 transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Newspaper className="h-4 w-4 text-accent" />
                          <h3 className="font-mono font-bold text-base">{signal.headline || signal.title || `News ${i + 1}`}</h3>
                          {impactLevel !== 'neutral' && (
                            <Badge className={impactColor}>
                              {impactLevel.toUpperCase()} IMPACT
                            </Badge>
                          )}
                        </div>
                      </div>
                      {signal.timestamp && (
                        <span className="text-xs text-muted-foreground font-mono whitespace-nowrap ml-2">
                          {new Date(signal.timestamp).toLocaleTimeString()}
                        </span>
                      )}
                    </div>

                    {signal.content && (
                      <p className="text-sm text-foreground/80">{signal.content}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      {signal.affectedAssets && (
                        <div>
                          <p className="text-muted-foreground font-mono mb-1">Assets</p>
                          <p className="font-mono font-bold">{signal.affectedAssets}</p>
                        </div>
                      )}
                      {signal.sentiment && (
                        <div>
                          <p className="text-muted-foreground font-mono mb-1">Sentiment</p>
                          <p className="font-mono font-bold">{signal.sentiment}</p>
                        </div>
                      )}
                      {signal.source && (
                        <div>
                          <p className="text-muted-foreground font-mono mb-1">Source</p>
                          <p className="font-mono font-bold">{signal.source}</p>
                        </div>
                      )}
                      {signal.relevance && (
                        <div>
                          <p className="text-muted-foreground font-mono mb-1">Relevance</p>
                          <p className="font-mono font-bold">{signal.relevance}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-accent/20 bg-card/50">
          <CardContent className="p-8 text-center text-muted-foreground">
            <Newspaper className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No news signals available
          </CardContent>
        </Card>
      )}
    </div>
  )
}
