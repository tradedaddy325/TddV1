'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

interface IntelligenceData {
  brief: string
  riskSentiment: string
  explanation: string
  cached: boolean
  mock?: boolean
  message?: string
}

export function AIIntelligence() {
  const [data, setData] = useState<IntelligenceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchIntelligence = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/intelligence', {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to fetch intelligence')
      const result = await response.json()
      setData(result)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIntelligence()

    // Auto-refresh every 90 seconds
    const interval = setInterval(fetchIntelligence, 90000)
    return () => clearInterval(interval)
  }, [])

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'risk-on':
        return 'bg-green-900/20 text-green-300 border-green-700'
      case 'risk-off':
        return 'bg-red-900/20 text-red-300 border-red-700'
      default:
        return 'bg-amber-900/20 text-amber-300 border-amber-700'
    }
  }

  return (
    <Card className="bg-card border-accent/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">AI Market Intelligence</CardTitle>
            {data?.cached && (
              <Badge variant="outline" className="text-xs">
                {data.mock ? 'Mock' : 'Cached'}
              </Badge>
            )}
          </div>
          <Button
            onClick={fetchIntelligence}
            disabled={loading}
            variant="outline"
            size="sm"
            className="text-accent"
          >
            {loading ? 'Updating...' : 'Refresh'}
          </Button>
        </div>
        {data?.message && (
          <p className="text-xs text-muted-foreground mt-2">{data.message}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && !data ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-3/4 bg-muted" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-400">
            <p>Error: {error}</p>
            <Button
              onClick={fetchIntelligence}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        ) : data ? (
          <div className="space-y-3">
            {/* Brief */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Daily Brief</p>
              <p className="text-sm leading-relaxed">{data.brief}</p>
            </div>

            {/* Risk Sentiment */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Risk Sentiment</p>
              <Badge className={`${getSentimentColor(data.riskSentiment)} border`}>
                {data.riskSentiment}
              </Badge>
            </div>

            {/* Explanation */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Analysis</p>
              <p className="text-sm text-muted-foreground italic">
                {data.explanation}
              </p>
            </div>

            {/* Last Updated */}
            {lastUpdated && (
              <div className="text-xs text-muted-foreground pt-2 border-t border-accent/20">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
