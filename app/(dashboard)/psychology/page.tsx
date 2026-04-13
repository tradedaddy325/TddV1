'use client'

import { useNeuralEngineData } from '@/hooks/use-neural-engine-data'
import { Brain, RefreshCw, BarChart3, Gauge } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function PsychologyPage() {
  const { psychologyData, loading, refresh } = useNeuralEngineData()

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'bullish':
      case 'positive':
      case 'up':
        return 'bg-green-500/20 border-green-500/30 text-green-400'
      case 'bearish':
      case 'negative':
      case 'down':
        return 'bg-red-500/20 border-red-500/30 text-red-400'
      default:
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-primary">
            {'>'} MARKET_PSYCHOLOGY
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Sentiment analysis, investor behavior, and market mood indicators
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

      {loading && !psychologyData ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-accent/20 bg-card/50 animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-1/3" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-6 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : psychologyData ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview" className="font-mono">
              <Brain className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="font-mono">
              <BarChart3 className="mr-2 h-4 w-4" />
              Sentiment
            </TabsTrigger>
            <TabsTrigger value="metrics" className="font-mono">
              <Gauge className="mr-2 h-4 w-4" />
              Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-4">
            <Card className="border-accent/20 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Market Sentiment Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {psychologyData?.overview && (
                  <p className="text-sm leading-relaxed">{psychologyData.overview}</p>
                )}
                {psychologyData?.dominantSentiment && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-muted-foreground">Dominant Sentiment:</span>
                    <Badge className={getSentimentColor(psychologyData.dominantSentiment)}>
                      {psychologyData.dominantSentiment.toUpperCase()}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(psychologyData?.sentiment || {}).map(([key, value]: [string, any]) => (
                <Card key={key} className="border-accent/20 bg-card/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-mono capitalize">{key}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground font-mono">Score</span>
                        <span className="font-mono font-bold">{(value?.score || 0).toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded h-2">
                        <div 
                          className="h-full rounded bg-accent"
                          style={{ width: `${Math.min((value?.score || 0) / 100 * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    {value?.trend && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono">Trend:</span>
                        <Badge variant="outline" className="text-xs">{value.trend}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(psychologyData?.metrics || {}).map(([key, value]: [string, any]) => (
                <Card key={key} className="border-accent/20 bg-card/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-mono">{key}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-mono text-2xl font-bold mb-1">{value}</div>
                    {psychologyData?.metricsLabels?.[key] && (
                      <p className="text-xs text-muted-foreground">{psychologyData.metricsLabels[key]}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="border-accent/20 bg-card/50">
          <CardContent className="p-8 text-center text-muted-foreground">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No psychology data available
          </CardContent>
        </Card>
      )}
    </div>
  )
}
