'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Zap, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react'

interface SentimentData {
  emotion: string
  percentage: number
  trend: 'up' | 'down' | 'stable'
  color: string
}

interface PsychologyMetric {
  name: string
  value: number
  description: string
  level: 'critical' | 'warning' | 'normal' | 'extreme'
}

interface CommunityFeed {
  author: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  message: string
  likes: number
  timestamp: string
}

export function MarketPsychologyTab() {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([])
  const [metrics, setMetrics] = useState<PsychologyMetric[]>([])
  const [feed, setFeed] = useState<CommunityFeed[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchPsychologyData()
    const interval = setInterval(fetchPsychologyData, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchPsychologyData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/psychology/sentiment', {
        cache: 'no-store',
      })

      if (!response.ok) throw new Error('Failed to fetch psychology data')

      const data = await response.json()

      setSentimentData(
        data.sentiment || [
          { emotion: 'Greed', percentage: 72, trend: 'up', color: 'text-green-400' },
          { emotion: 'Fear', percentage: 18, trend: 'down', color: 'text-red-400' },
          { emotion: 'Hope', percentage: 45, trend: 'up', color: 'text-blue-400' },
          { emotion: 'Regret', percentage: 25, trend: 'stable', color: 'text-yellow-400' },
        ]
      )

      setMetrics(
        data.metrics || [
          {
            name: 'Fear & Greed Index',
            value: 72,
            description: 'Market sentiment index',
            level: 'extreme',
          },
          {
            name: 'Retail Participation',
            value: 68,
            description: 'Retail trader activity level',
            level: 'normal',
          },
          {
            name: 'Volatility Index (VIX)',
            value: 18,
            description: 'Market volatility measure',
            level: 'normal',
          },
          {
            name: 'Social Sentiment',
            value: 81,
            description: 'Community social media sentiment',
            level: 'extreme',
          },
        ]
      )

      setFeed(
        data.feed || [
          {
            author: 'TraderJoe23',
            sentiment: 'bullish',
            message: 'Strong support holding at this level. Looking for a breakout.',
            likes: 234,
            timestamp: '2 minutes ago',
          },
          {
            author: 'CryptoSarah',
            sentiment: 'bearish',
            message: 'Taking profits here. This looks like a bear flag forming.',
            likes: 156,
            timestamp: '5 minutes ago',
          },
          {
            author: 'MacroMike',
            sentiment: 'neutral',
            message: 'Waiting for the FOMC announcement. Market consolidating.',
            likes: 89,
            timestamp: '8 minutes ago',
          },
        ]
      )
    } catch (err) {
      console.error('[v0] Psychology data error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-400 bg-red-900/20'
      case 'warning':
        return 'text-yellow-400 bg-yellow-900/20'
      case 'normal':
        return 'text-green-400 bg-green-900/20'
      case 'extreme':
        return 'text-cyan-400 bg-cyan-900/20'
      default:
        return 'text-muted-foreground'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'bg-green-900/20 border-green-700/50 text-green-400'
      case 'bearish':
        return 'bg-red-900/20 border-red-700/50 text-red-400'
      default:
        return 'bg-blue-900/20 border-blue-700/50 text-blue-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-6 h-6 text-cyan-400" />
            Market Psychology & Sentiment
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time emotional analysis powered by AI sentiment detection
          </p>
        </div>
      </div>

      <Tabs defaultValue="sentiment" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sentiment" className="gap-2">
            <Zap className="w-4 h-4" />
            Sentiment
          </TabsTrigger>
          <TabsTrigger value="metrics" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="community" className="gap-2">
            <Brain className="w-4 h-4" />
            Community
          </TabsTrigger>
        </TabsList>

        {/* Sentiment Tab */}
        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sentimentData.map((item) => (
              <Card key={item.emotion} className="border-border/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{item.emotion}</h3>
                      {item.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                      {item.trend === 'down' && <TrendingUp className="w-4 h-4 rotate-180 text-red-400" />}
                      {item.trend === 'stable' && <div className="w-4 h-4 border-b-2 border-yellow-400" />}
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className={`text-3xl font-bold ${item.color}`}>
                          {item.percentage}%
                        </span>
                      </div>

                      {/* Sentiment Bar */}
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color.replace('text-', 'bg-')}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="space-y-3">
            {metrics.map((metric) => (
              <Card key={metric.name} className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{metric.name}</h3>
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded text-sm font-semibold ${getLevelColor(metric.level)}`}>
                      {metric.value}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        metric.level === 'extreme'
                          ? 'bg-cyan-500'
                          : metric.level === 'critical'
                            ? 'bg-red-500'
                            : metric.level === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-3">
          {feed.map((post, idx) => (
            <Card key={idx} className={`border ${getSentimentColor(post.sentiment)}`}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-bold text-background">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{post.author}</p>
                        <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold uppercase px-2 py-1 bg-background rounded">
                      {post.sentiment}
                    </span>
                  </div>

                  <p className="text-foreground text-sm leading-relaxed">{post.message}</p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Zap className="w-3 h-3" />
                    <span>{post.likes} traders agree</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
