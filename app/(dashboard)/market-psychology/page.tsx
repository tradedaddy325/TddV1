'use client'

import { useState, useEffect } from 'react'

interface SentimentData {
  moodGauge: number
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

export default function MarketPsychologyPage() {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSentiment()
    const interval = setInterval(fetchSentiment, 1800000) // 30 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchSentiment = async () => {
    setIsLoading(true)
    try {
      setSentiment({
        moodGauge: 45,
        fear: 35,
        greed: 20,
        fomo: 25,
        uncertainty: 45,
        bullishAssets: 12,
        bearishAssets: 8,
        volatility: 32,
        narrative: 'Market showing neutral sentiment with cautious optimism',
        lastUpdated: new Date(),
      })
    } catch (error) {
      console.error('Error fetching sentiment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto bg-black p-6">
        <div className="text-center">
          <p className="font-mono text-green-400">{">"} ANALYZING_MARKET_PSYCHOLOGY...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-black p-6 space-y-6">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-white font-mono mb-6">MARKET PSYCHOLOGY</h1>
        
        {sentiment && (
          <div className="space-y-4">
            <div className="border border-cyan-600/30 bg-cyan-900/10 rounded-lg p-6">
              <p className="text-cyan-400 font-mono mb-4">MOOD_GAUGE: {getMoodLabel(sentiment.moodGauge)}</p>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" 
                  style={{ width: `${sentiment.moodGauge}%` }}
                ></div>
              </div>
              <p className="text-gray-300 mt-2">{sentiment.moodGauge.toFixed(0)}% toward Greed</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Fear', value: sentiment.fear, colorClass: 'text-red-400' },
                { label: 'Greed', value: sentiment.greed, colorClass: 'text-green-400' },
                { label: 'FOMO', value: sentiment.fomo, colorClass: 'text-yellow-400' },
                { label: 'Uncertainty', value: sentiment.uncertainty, colorClass: 'text-cyan-400' },
              ].map((metric) => (
                <div key={metric.label} className="border border-gray-700/50 bg-gray-900/30 rounded-lg p-4">
                  <p className="text-gray-400 font-mono text-xs mb-2">{metric.label}</p>
                  <p className={`text-2xl font-bold ${metric.colorClass}`}>{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="border border-green-600/30 bg-green-900/10 rounded-lg p-4">
              <p className="text-green-400 font-mono text-sm mb-2">{">"} NARRATIVE:</p>
              <p className="text-gray-300">{sentiment.narrative}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-green-600/30 bg-green-900/10 rounded-lg p-4">
                <p className="text-green-400 font-mono text-sm">BULLISH_ASSETS: {sentiment.bullishAssets}</p>
              </div>
              <div className="border border-red-600/30 bg-red-900/10 rounded-lg p-4">
                <p className="text-red-400 font-mono text-sm">BEARISH_ASSETS: {sentiment.bearishAssets}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
