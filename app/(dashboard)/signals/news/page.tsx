'use client'

import { useState, useEffect } from 'react'
import { Clock, AlertCircle } from 'lucide-react'
import { SignalCard } from '@/components/signals/signal-card'
import { CountdownTimer } from '@/components/signals/countdown-timer'
import { StatusCard } from '@/components/signals/status-card'

const generateNewsSignals = () => {
  const now = new Date()
  return [
    {
      id: 1,
      title: 'EUR CPI Release',
      symbol: 'EURUSD',
      event: 'Consumer Price Index',
      country: 'Eurozone',
      importance: 'High',
      forecast: '2.4%',
      previous: '2.3%',
      releaseTime: new Date(now.getTime() + 3600000), // 1 hour from now
      direction: 'up' as const,
      description: 'Major economic indicator affecting EUR volatility',
      tags: ['Economic Data', 'CPI']
    },
    {
      id: 2,
      title: 'US Non-Farm Payroll',
      symbol: 'NFPUSD',
      event: 'Non-Farm Payroll',
      country: 'United States',
      importance: 'Critical',
      forecast: '215k',
      previous: '265k',
      releaseTime: new Date(now.getTime() + 7200000), // 2 hours from now
      direction: 'down' as const,
      description: 'Most important employment data point',
      tags: ['Economic Data', 'Employment']
    },
    {
      id: 3,
      title: 'GBP Retail Sales',
      symbol: 'GBPUSD',
      event: 'Retail Sales MoM',
      country: 'United Kingdom',
      importance: 'Medium',
      forecast: '0.5%',
      previous: '-0.3%',
      releaseTime: new Date(now.getTime() + 10800000), // 3 hours from now
      direction: 'up' as const,
      description: 'Consumer spending indicator',
      tags: ['Economic Data', 'Retail']
    },
    {
      id: 4,
      title: 'JPY Trade Balance',
      symbol: 'USDJPY',
      event: 'Trade Balance',
      country: 'Japan',
      importance: 'Medium',
      forecast: '500B',
      previous: '450B',
      releaseTime: new Date(now.getTime() + 1800000), // 30 minutes from now
      direction: 'down' as const,
      description: 'Net export balance indicator',
      tags: ['Economic Data', 'Trade']
    },
    {
      id: 5,
      title: 'AUD Employment',
      symbol: 'AUDUSD',
      event: 'Employment Change',
      country: 'Australia',
      importance: 'High',
      forecast: '25k',
      previous: '32.1k',
      releaseTime: new Date(now.getTime() + 14400000), // 4 hours from now
      direction: 'up' as const,
      description: 'Job creation and labor market health',
      tags: ['Economic Data', 'Employment']
    },
    {
      id: 6,
      title: 'CAD Inflation Rate',
      symbol: 'USDCAD',
      event: 'Inflation Rate YoY',
      country: 'Canada',
      importance: 'High',
      forecast: '2.2%',
      previous: '2.3%',
      releaseTime: new Date(now.getTime() + 5400000), // 1.5 hours from now
      direction: 'up' as const,
      description: 'Consumer price inflation measure',
      tags: ['Economic Data', 'Inflation']
    }
  ]
}

export default function NewsSignalsPage() {
  const [signals, setSignals] = useState(generateNewsSignals())
  const [activeTab, setActiveTab] = useState<'upcoming' | 'today' | 'all'>('upcoming')
  const [unlockedSignals, setUnlockedSignals] = useState<number[]>([])

  const handleUnlock = (signalId: number) => {
    setUnlockedSignals(prev => [...new Set([...prev, signalId])])
  }

  const isLocked = (signal: any) => {
    const now = new Date().getTime()
    const releaseTime = new Date(signal.releaseTime).getTime()
    const twoHoursBefore = releaseTime - 2 * 60 * 60 * 1000
    return now < twoHoursBefore && !unlockedSignals.includes(signal.id)
  }

  const importanceColors = {
    'Critical': 'text-red-400',
    'High': 'text-orange-400',
    'Medium': 'text-yellow-400',
    'Low': 'text-gray-400'
  }

  const importanceBg = {
    'Critical': 'border-red-800 bg-red-900/10',
    'High': 'border-orange-800 bg-orange-900/10',
    'Medium': 'border-yellow-800 bg-yellow-900/10',
    'Low': 'border-gray-800 bg-gray-900/10'
  }

  const filteredSignals = signals.filter(s => {
    if (activeTab === 'upcoming') return !isLocked(s)
    if (activeTab === 'today') return true
    return true
  })

  const upcomingSignals = signals.filter(s => !isLocked(s))
  const totalHighImpact = signals.filter(s => s.importance === 'Critical' || s.importance === 'High').length

  return (
    <main className="flex-1 overflow-auto bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black border-b border-gray-800 px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-6 h-6 text-orange-400" />
          <h1 className="text-2xl font-bold text-white">News Signals</h1>
        </div>
        <p className="text-sm text-gray-400">Economic events and data releases with trading signals</p>
      </div>

      <div className="p-6 max-w-5xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatusCard 
            label="Upcoming Events" 
            value={upcomingSignals.length}
            color="orange"
            icon="📅"
          />
          <StatusCard 
            label="High Impact" 
            value={totalHighImpact}
            color="red"
            icon="⚠️"
          />
          <StatusCard 
            label="Today's Events" 
            value={signals.length}
            color="blue"
            icon="📊"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-sm font-mono transition-colors border-b-2 ${
              activeTab === 'upcoming'
                ? 'text-green-400 border-green-400'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-2 text-sm font-mono transition-colors border-b-2 ${
              activeTab === 'today'
                ? 'text-green-400 border-green-400'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
          >
            Today's Events
          </button>
        </div>

        {/* News Signals */}
        <div className="space-y-4">
          {filteredSignals.length > 0 ? (
            filteredSignals.map((signal) => {
              const locked = isLocked(signal)
              return (
                <div
                  key={signal.id}
                  className={`p-4 rounded-xl border transition-all ${importanceBg[signal.importance as keyof typeof importanceBg]} ${
                    locked ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-bold text-white">{signal.event}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                          {signal.country}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-wider ${importanceColors[signal.importance as keyof typeof importanceColors]}`}>
                          {signal.importance}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mb-3">{signal.description}</p>

                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <div className="text-xs text-gray-500">Forecast</div>
                          <div className="text-sm font-mono font-bold text-white">{signal.forecast}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Previous</div>
                          <div className="text-sm font-mono font-bold text-white">{signal.previous}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Symbol</div>
                          <div className="text-sm font-mono font-bold text-white">{signal.symbol}</div>
                        </div>
                      </div>

                      {!locked && <CountdownTimer unlockTime={signal.releaseTime} label="Release in" />}
                    </div>

                    {locked ? (
                      <div className="text-right">
                        <div className="text-3xl mb-2">🔒</div>
                        <p className="text-xs text-gray-400 mb-2">Unlocks 2h before</p>
                        <button className="px-3 py-1 bg-purple-900/30 border border-purple-700 rounded text-xs text-purple-400 hover:bg-purple-900/50 transition-colors">
                          Watch Now
                        </button>
                      </div>
                    ) : (
                      <div className="text-right flex flex-col items-end gap-2">
                        <AlertCircle className="w-5 h-5 text-green-400" />
                        <span className="text-xs text-green-400 font-mono">UNLOCKED</span>
                      </div>
                    )}
                  </div>

                  {!locked && (
                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                      <div className="flex flex-wrap gap-1">
                        {signal.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="py-12 text-center">
              <div className="text-gray-400 text-sm">No signals available in this tab</div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 p-4 rounded-lg border border-gray-800 bg-gray-900/30">
          <p className="text-xs text-gray-400">
            💡 <span className="ml-2">Economic event signals are unlocked 2 hours before the announcement. Monitor these closely as they create high volatility trading opportunities.</span>
          </p>
        </div>
      </div>
    </main>
  )
}
