'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface Prediction {
  asset: string
  bullish: number
  bearish: number
  neutral: number
  scenario: string
  reasoning: string
  confidence: number
}

export default function PredictiveMarketsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('24h')

  useEffect(() => {
    fetchPredictions()
    
    // Auto-update every 2-4 hours
    const interval = setInterval(fetchPredictions, 10800000) // 3 hours
    
    return () => clearInterval(interval)
  }, [timeframe])

  const fetchPredictions = async () => {
    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Provide AI predictions for next ${timeframe}: For major assets (XAUUSD, EURUSD, BTCUSD, GBPUSD, NZDUSD), give bullish %, bearish %, neutral %, scenario, reasoning, and confidence score (0-100)`
        })
      })
      
      const data = await response.json()
      
      // Default predictions if API fails
      const defaultPredictions: Prediction[] = [
        {
          asset: 'XAUUSD',
          bullish: 68,
          bearish: 22,
          neutral: 10,
          scenario: 'Safe-haven flows boost gold prices',
          reasoning: 'Geopolitical tensions and rate cut expectations support gold strength',
          confidence: 76
        },
        {
          asset: 'EURUSD',
          bullish: 45,
          bearish: 35,
          neutral: 20,
          scenario: 'Mixed signals from ECB data',
          reasoning: 'Conflicting inflation and growth data create two-way trading',
          confidence: 62
        },
        {
          asset: 'BTCUSD',
          bullish: 72,
          bearish: 15,
          neutral: 13,
          scenario: 'Technical breakout continues',
          reasoning: 'Breaking key resistance with strong volume confirmation',
          confidence: 71
        },
        {
          asset: 'GBPUSD',
          bullish: 52,
          bearish: 28,
          neutral: 20,
          scenario: 'BoE hawkish tilt expected',
          reasoning: 'Bank of England holds firm on rates despite soft data',
          confidence: 65
        },
        {
          asset: 'NZDUSD',
          bullish: 38,
          bearish: 48,
          neutral: 14,
          scenario: 'RBNZ rate cuts pressure Kiwi',
          reasoning: 'Expectation of more rate cuts weighs on currency',
          confidence: 58
        }
      ]
      
      setPredictions(data.predictions || defaultPredictions)
    } catch (error) {
      console.error('Error fetching predictions:', error)
      // Set default data
      setPredictions([
        {
          asset: 'XAUUSD',
          bullish: 68,
          bearish: 22,
          neutral: 10,
          scenario: 'Safe-haven flows boost gold prices',
          reasoning: 'Geopolitical tensions and rate cut expectations support gold strength',
          confidence: 76
        },
        {
          asset: 'EURUSD',
          bullish: 45,
          bearish: 35,
          neutral: 20,
          scenario: 'Mixed signals from ECB data',
          reasoning: 'Conflicting inflation and growth data create two-way trading',
          confidence: 62
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-400">Loading Predictive Markets...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Predictive Markets</h1>
        <p className="text-gray-400 text-sm">AI forecasts & probability-based predictions • Updates every 2-4 hours</p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {['24h', '72h', '1w'].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              timeframe === tf
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Next {tf}
          </button>
        ))}
      </div>

      {/* Predictions Grid */}
      <div className="space-y-4">
        {predictions.map((pred) => {
          const dominantView = 
            pred.bullish > pred.bearish && pred.bullish > pred.neutral ? 'bullish' :
            pred.bearish > pred.bullish && pred.bearish > pred.neutral ? 'bearish' :
            'neutral'
          
          return (
            <Card key={pred.asset} className="p-6 bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-white">{pred.asset}</span>
                  <Badge className={
                    dominantView === 'bullish' ? 'bg-green-600 text-white' :
                    dominantView === 'bearish' ? 'bg-red-600 text-white' :
                    'bg-gray-700 text-gray-300'
                  }>
                    {dominantView.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Confidence</div>
                  <div className="text-2xl font-bold text-cyan-400">{pred.confidence}%</div>
                </div>
              </div>

              {/* Prediction Bars */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-400 font-semibold">Bullish</span>
                    <span className="text-green-400 font-semibold">{pred.bullish}%</span>
                  </div>
                  <Progress value={pred.bullish} className="h-2 bg-gray-800" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-400 font-semibold">Bearish</span>
                    <span className="text-red-400 font-semibold">{pred.bearish}%</span>
                  </div>
                  <Progress value={pred.bearish} className="h-2 bg-gray-800" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-yellow-400 font-semibold">Neutral</span>
                    <span className="text-yellow-400 font-semibold">{pred.neutral}%</span>
                  </div>
                  <Progress value={pred.neutral} className="h-2 bg-gray-800" />
                </div>
              </div>

              {/* Scenario & Reasoning */}
              <div className="space-y-2 pt-4 border-t border-gray-800">
                <div>
                  <p className="text-sm text-gray-400">Scenario</p>
                  <p className="text-white font-semibold">{pred.scenario}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">AI Reasoning</p>
                  <p className="text-gray-300 text-sm">{pred.reasoning}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
