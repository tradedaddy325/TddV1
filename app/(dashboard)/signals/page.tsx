'use client'

import { useState, useEffect } from 'react'

interface DailySignal {
  id: string
  asset: string
  direction: 'BUY' | 'SELL'
  entry: number
  stopLoss: number
  takeProfit: number
  confidence: number
  timeframe: string
  status: 'Active' | 'Expired' | 'Hit'
  reasoning: string
  generatedAt: Date
}

interface NewsSignal {
  id: string
  event: string
  time: Date
  impact: 'High' | 'Medium' | 'Low'
  expectedMove: string
  tradeIdea: string
  riskWarning: string
  locked: boolean
  countdownMinutes: number
}

export default function SignalsPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'news'>('daily')
  const [dailySignals, setDailySignals] = useState<DailySignal[]>([])
  const [newsSignals, setNewsSignals] = useState<NewsSignal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSignals()
    const interval = setInterval(fetchSignals, 14400000)
    return () => clearInterval(interval)
  }, [])

  const fetchSignals = async () => {
    try {
      const defaultDailySignals: DailySignal[] = [
        {
          id: '1',
          asset: 'EURUSD',
          direction: 'BUY',
          entry: 1.0842,
          stopLoss: 1.0810,
          takeProfit: 1.0920,
          confidence: 78,
          timeframe: '4H',
          status: 'Active',
          reasoning: 'Breaking above key resistance with bullish divergence on RSI',
          generatedAt: new Date(Date.now() - 7200000)
        },
        {
          id: '2',
          asset: 'GBPUSD',
          direction: 'SELL',
          entry: 1.2650,
          stopLoss: 1.2720,
          takeProfit: 1.2520,
          confidence: 65,
          timeframe: 'Daily',
          status: 'Active',
          reasoning: 'Rejecting from resistance with bearish engulfing pattern',
          generatedAt: new Date(Date.now() - 3600000)
        },
        {
          id: '3',
          asset: 'XAUUSD',
          direction: 'BUY',
          entry: 2045,
          stopLoss: 2015,
          takeProfit: 2100,
          confidence: 82,
          timeframe: '1H',
          status: 'Hit',
          reasoning: 'Strong support bounce with volume confirmation',
          generatedAt: new Date(Date.now() - 86400000)
        }
      ]
      
      setDailySignals(defaultDailySignals)
      
      const defaultNewsSignals: NewsSignal[] = [
        {
          id: 'n1',
          event: 'US NFP (Non-Farm Payroll)',
          time: new Date(Date.now() + 172800000),
          impact: 'High',
          expectedMove: 'Will unlock at event',
          tradeIdea: 'Will unlock at event',
          riskWarning: 'High volatility expected',
          locked: true,
          countdownMinutes: 2880
        },
        {
          id: 'n2',
          event: 'ECB Interest Rate Decision',
          time: new Date(Date.now() + 604800000),
          impact: 'High',
          expectedMove: 'Will unlock at event',
          tradeIdea: 'Will unlock at event',
          riskWarning: 'Rate decision affects Euro',
          locked: true,
          countdownMinutes: 10080
        }
      ]
      
      setNewsSignals(defaultNewsSignals)
    } catch (error) {
      console.error('Error fetching signals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto bg-black p-6">
        <div className="text-center">
          <p className="font-mono text-green-400">{">"} GENERATING_SIGNALS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-black p-6 space-y-6">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-white font-mono mb-2">SIGNALS</h1>
        <p className="text-gray-400 text-sm mb-6">AI-generated setups with entry/exit points • Updates every 4 hours</p>

        <div className="flex gap-2 border-b border-gray-800 mb-6">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2 font-mono text-sm transition-colors ${
              activeTab === 'daily'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Daily Signals
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 font-mono text-sm transition-colors ${
              activeTab === 'news'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            News Signals
          </button>
        </div>

        {activeTab === 'daily' && (
          <div className="space-y-4">
            {dailySignals.map(signal => (
              <div key={signal.id} className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl font-bold text-white">{signal.asset}</span>
                      <span className={`px-3 py-1 rounded font-mono text-sm ${
                        signal.direction === 'BUY' 
                          ? 'bg-green-900/50 text-green-400' 
                          : 'bg-red-900/50 text-red-400'
                      }`}>
                        {signal.direction}
                      </span>
                      <span className="px-3 py-1 rounded border border-gray-700 text-gray-300 text-sm font-mono">
                        {signal.timeframe}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Status: {signal.status}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Confidence</div>
                    <div className={`text-2xl font-bold ${
                      signal.confidence >= 75 ? 'text-green-400' :
                      signal.confidence >= 60 ? 'text-yellow-400' :
                      'text-orange-400'
                    }`}>
                      {signal.confidence}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-800">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <p className="text-xs text-gray-400 mb-1">Entry</p>
                    <p className="text-lg font-bold text-white">{signal.entry}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <p className="text-xs text-gray-400 mb-1">Stop Loss</p>
                    <p className="text-lg font-bold text-red-400">{signal.stopLoss}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <p className="text-xs text-gray-400 mb-1">Take Profit</p>
                    <p className="text-lg font-bold text-green-400">{signal.takeProfit}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">AI Reasoning</p>
                  <p className="text-gray-300 text-sm">{signal.reasoning}</p>
                </div>

                <p className="text-xs text-gray-500 mt-3">Generated {Math.round((Date.now() - signal.generatedAt.getTime()) / 60000)} minutes ago</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-4">
            {newsSignals.map(signal => (
              <div key={signal.id} className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg relative overflow-hidden">
                {signal.locked && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-950/80 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">🔒 Unlocks at event ({signal.countdownMinutes} minutes)</p>
                    </div>
                  </div>
                )}

                <div className={signal.locked ? 'opacity-50' : ''}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{signal.event}</h3>
                      <p className="text-sm text-gray-400">
                        {signal.time.toLocaleDateString()} at {signal.time.toLocaleTimeString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded font-mono text-sm ${
                      signal.impact === 'High' ? 'bg-red-900/50 text-red-400' :
                      signal.impact === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-blue-900/50 text-blue-400'
                    }`}>
                      {signal.impact} Impact
                    </span>
                  </div>

                  {!signal.locked && (
                    <div className="space-y-3 pt-4 border-t border-gray-800">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Expected Move</p>
                        <p className="text-white">{signal.expectedMove}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Trade Idea</p>
                        <p className="text-white">{signal.tradeIdea}</p>
                      </div>
                      <div className="bg-red-900/20 border border-red-600/30 p-3 rounded">
                        <p className="text-sm text-red-300">⚠️ {signal.riskWarning}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
