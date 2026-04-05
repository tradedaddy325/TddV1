'use client'

import { useState, useEffect } from 'react'

interface Prediction {
  asset: string
  bullish: number
  bearish: number
  neutral: number
  scenario: string
  confidence: number
}

export default function PredictiveMarketsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPredictions()
    const interval = setInterval(fetchPredictions, 10800000) // 3 hours
    return () => clearInterval(interval)
  }, [])

  const fetchPredictions = async () => {
    setIsLoading(true)
    try {
      setPredictions([
        {
          asset: 'BTC/USD',
          bullish: 65,
          bearish: 20,
          neutral: 15,
          scenario: 'Uptrend continuation likely',
          confidence: 78,
        },
        {
          asset: 'EUR/USD',
          bullish: 45,
          bearish: 40,
          neutral: 15,
          scenario: 'Consolidation expected',
          confidence: 62,
        },
        {
          asset: 'GOLD',
          bullish: 55,
          bearish: 30,
          neutral: 15,
          scenario: 'Safe haven demand rising',
          confidence: 71,
        },
      ])
    } catch (error) {
      console.error('Error fetching predictions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto bg-black p-6">
        <div className="text-center">
          <p className="font-mono text-green-400">{">"} PROCESSING_PREDICTIONS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-black p-6 space-y-6">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-white font-mono mb-6">PREDICTIVE MARKETS</h1>
        
        <div className="space-y-4">
          {predictions.map((pred) => (
            <div key={pred.asset} className="border border-green-600/30 bg-green-900/10 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-green-400 font-mono">{pred.asset}</h3>
                <div className="text-right">
                  <p className="text-amber-400 font-mono text-sm">CONFIDENCE: {pred.confidence}%</p>
                </div>
              </div>

              <p className="text-gray-300 text-sm">{pred.scenario}</p>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-900/50 rounded p-3">
                  <p className="text-green-400 font-mono text-xs mb-1">BULLISH</p>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-green-500" style={{ width: `${pred.bullish}%` }}></div>
                  </div>
                  <p className="text-gray-300 text-sm">{pred.bullish}%</p>
                </div>
                <div className="bg-gray-900/50 rounded p-3">
                  <p className="text-red-400 font-mono text-xs mb-1">BEARISH</p>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-red-500" style={{ width: `${pred.bearish}%` }}></div>
                  </div>
                  <p className="text-gray-300 text-sm">{pred.bearish}%</p>
                </div>
                <div className="bg-gray-900/50 rounded p-3">
                  <p className="text-cyan-400 font-mono text-xs mb-1">NEUTRAL</p>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-cyan-500" style={{ width: `${pred.neutral}%` }}></div>
                  </div>
                  <p className="text-gray-300 text-sm">{pred.neutral}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
