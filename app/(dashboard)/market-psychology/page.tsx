'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface SentimentData {
  moodGauge: number // 0 = Fear, 50 = Neutral, 100 = Greed
  fear: number
  greed: number
  fomo: number
  uncertainty: number
  bullishAssets: number
  bearishAssets: number
  volatility: number
  narrative: string
  lastUpdated: Date
}

const getMoodLabel = (value: number): string => {
  if (value < 20) return 'Extreme Fear'
  if (value < 40) return 'Fear'
  if (value < 60) return 'Neutral'
  if (value < 80) return 'Greed'
  return 'Extreme Greed'
}

const getMoodColor = (value: number): string => {
  if (value < 20) return 'from-red-600 to-red-500'
  if (value < 40) return 'from-orange-600 to-orange-500'
  if (value < 60) return 'from-yellow-600 to-yellow-500'
  if (value < 80) return 'from-green-600 to-green-500'
  return 'from-emerald-600 to-emerald-500'
}

export default function MarketPsychologyPage() {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSentimentData()
    
    // Auto-update every 30-60 minutes
    const interval = setInterval(fetchSentimentData, 2700000) // 45 minutes
    
    return () => clearInterval(interval)
  }, [])

  const fetchSentimentData = async () => {
    try {
      // Fetch from existing API endpoints
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Analyze current market psychology sentiment: fear (0-100), greed (0-100), FOMO (0-100), uncertainty (0-100), bullish asset count, bearish asset count, volatility (0-100), and provide narrative'
        })
      })
      
      const data = await response.json()
      setSentiment({
        moodGauge: data.moodGauge || 50,
        fear: data.fear || 45,
        greed: data.greed || 35,
        fomo: data.fomo || 40,
        uncertainty: data.uncertainty || 50,
        bullishAssets: data.bullishAssets || 12,
        bearishAssets: data.bearishAssets || 8,
        volatility: data.volatility || 55,
        narrative: data.narrative || 'Market sentiment is mixed with cautious optimism.',
        lastUpdated: new Date()
      })
    } catch (error) {
      console.error('Error fetching sentiment data:', error)
      // Set default data
      setSentiment({
        moodGauge: 50,
        fear: 45,
        greed: 35,
        fomo: 40,
        uncertainty: 50,
        bullishAssets: 12,
        bearishAssets: 8,
        volatility: 55,
        narrative: 'Unable to fetch live sentiment data.',
        lastUpdated: new Date()
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-400">Loading Market Psychology...</div>
      </div>
    )
  }

  if (!sentiment) return null

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Market Psychology</h1>
        <p className="text-gray-400 text-sm">AI-driven emotional state analysis • Updates every 30-60 minutes</p>
      </div>

      {/* Market Mood Gauge */}
      <Card className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Market Mood Gauge</h2>
            <span className={`text-2xl font-bold bg-gradient-to-r ${getMoodColor(sentiment.moodGauge)} bg-clip-text text-transparent`}>
              {getMoodLabel(sentiment.moodGauge)}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>FEAR</span>
              <span>{sentiment.moodGauge}</span>
              <span>GREED</span>
            </div>
            <div className="h-4 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getMoodColor(sentiment.moodGauge)} rounded-full transition-all duration-300`}
                style={{ width: `${sentiment.moodGauge}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Emotion Bars */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gray-900/50 border-gray-800">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-red-400">Fear</span>
              <span className="text-sm font-bold text-red-400">{sentiment.fear}%</span>
            </div>
            <Progress value={sentiment.fear} className="h-2 bg-gray-800" />
          </div>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-gray-800">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-green-400">Greed</span>
              <span className="text-sm font-bold text-green-400">{sentiment.greed}%</span>
            </div>
            <Progress value={sentiment.greed} className="h-2 bg-gray-800" />
          </div>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-gray-800">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-orange-400">FOMO</span>
              <span className="text-sm font-bold text-orange-400">{sentiment.fomo}%</span>
            </div>
            <Progress value={sentiment.fomo} className="h-2 bg-gray-800" />
          </div>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-gray-800">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-purple-400">Uncertainty</span>
              <span className="text-sm font-bold text-purple-400">{sentiment.uncertainty}%</span>
            </div>
            <Progress value={sentiment.uncertainty} className="h-2 bg-gray-800" />
          </div>
        </Card>
      </div>

      {/* Asset Sentiment */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gray-900/50 border-gray-800">
          <div className="text-sm text-gray-400 mb-2">Bullish Assets</div>
          <div className="text-3xl font-bold text-green-400">{sentiment.bullishAssets}</div>
          <p className="text-xs text-gray-500 mt-1">Positive momentum</p>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-gray-800">
          <div className="text-sm text-gray-400 mb-2">Bearish Assets</div>
          <div className="text-3xl font-bold text-red-400">{sentiment.bearishAssets}</div>
          <p className="text-xs text-gray-500 mt-1">Negative momentum</p>
        </Card>
      </div>

      {/* Volatility */}
      <Card className="p-4 bg-gray-900/50 border-gray-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Volatility Indicator</span>
          <span className="text-sm font-bold text-cyan-400">{sentiment.volatility}%</span>
        </div>
        <Progress value={sentiment.volatility} className="h-2 bg-gray-800" />
      </Card>

      {/* AI Narrative */}
      <Card className="p-6 bg-gradient-to-r from-purple-900/20 to-gray-900/20 border-purple-600/30">
        <h3 className="text-lg font-semibold text-purple-300 mb-3">AI Market Narrative</h3>
        <p className="text-gray-300 leading-relaxed">{sentiment.narrative}</p>
        <p className="text-xs text-gray-500 mt-3">Last updated: {sentiment.lastUpdated.toLocaleTimeString()}</p>
      </Card>
    </div>
  )
}
