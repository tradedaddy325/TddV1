'use client'

import { useNeuralEngineData } from '@/hooks/use-neural-engine-data'
import { RefreshCw, TrendingUp, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function GapsPage() {
  const { aiSignals, loading, refresh } = useNeuralEngineData()

  const gaps = aiSignals?.filter((s: any) => s.type === 'gap') || []

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold font-mono">Gap Analysis</h2>
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

      {loading && gaps.length === 0 ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-accent/20 bg-card/50 animate-pulse">
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-6 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : gaps.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {gaps.map((gap, i) => {
            const fillDirection = gap.direction?.toLowerCase() === 'up' ? 'to be filled upward' : 'to be filled downward'
            return (
              <Card key={i} className="border-accent/20 bg-card/50 hover:bg-card/70 transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-mono font-bold">{gap.symbol || `Gap ${i + 1}`}</h3>
                      <Badge variant="outline" className="text-xs border-accent/30">
                        {gap.gapSize || 'Gap'}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      {gap.gapLevel && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-mono">Gap Level:</span>
                          <span className="font-mono font-bold">{gap.gapLevel}</span>
                        </div>
                      )}
                      {gap.direction && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-mono">Direction:</span>
                          <span className={`font-mono font-bold ${gap.direction.toLowerCase() === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                            {gap.direction.toUpperCase()}
                          </span>
                        </div>
                      )}
                      {gap.probability && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-mono">Fill Probability:</span>
                          <span className="font-mono font-bold">{gap.probability}%</span>
                        </div>
                      )}
                      {gap.timeframe && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-mono">Timeframe:</span>
                          <span className="font-mono font-bold">{gap.timeframe}</span>
                        </div>
                      )}
                    </div>

                    {gap.description && (
                      <p className="text-xs text-foreground/70 pt-2 border-t border-accent/10">
                        {gap.description}
                      </p>
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
            <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No gap analysis available
          </CardContent>
        </Card>
      )}
    </div>
  )
}
