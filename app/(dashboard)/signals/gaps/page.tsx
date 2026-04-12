'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Clock } from 'lucide-react'
import { SignalCard } from '@/components/signals/signal-card'
import { CountdownTimer } from '@/components/signals/countdown-timer'
import { DisclaimerModal } from '@/components/signals/disclaimer-modal'
import { StatusCard } from '@/components/signals/status-card'

const generateGapSignals = () => {
  const now = new Date()
  return [
    {
      id: 1,
      title: 'Asian Session Gap Up',
      symbol: 'EURUSD',
      direction: 'up' as const,
      gapSize: 0.0045,
      gapPercentage: 0.42,
      previousClose: 1.0680,
      currentOpen: 1.0725,
      unlockTime: new Date(now.getTime() + 1800000), // 30 min
      description: 'Expected gap up on positive European sentiment',
      market: 'Asian Open'
    },
    {
      id: 2,
      title: 'London Gap Down',
      symbol: 'GBPUSD',
      direction: 'down' as const,
      gapSize: 0.0065,
      gapPercentage: 0.51,
      previousClose: 1.2750,
      currentOpen: 1.2685,
      unlockTime: new Date(now.getTime() + 3600000), // 1 hour
      description: 'Potential gap down on Brexit headline risk',
      market: 'London Open'
    },
    {
      id: 3,
      title: 'US Session Gap Up',
      symbol: 'USDJPY',
      direction: 'up' as const,
      gapSize: 15.5,
      gapPercentage: 0.38,
      previousClose: 150.25,
      currentOpen: 165.75,
      unlockTime: new Date(now.getTime() + 7200000), // 2 hours
      description: 'Expected gap up on strong US Treasury yield move',
      market: 'US Open'
    },
    {
      id: 4,
      title: 'Sydney Gap Down',
      symbol: 'AUDUSD',
      direction: 'down' as const,
      gapSize: 0.0032,
      gapPercentage: 0.35,
      previousClose: 0.6890,
      currentOpen: 0.6858,
      unlockTime: new Date(now.getTime() + 5400000), // 1.5 hours
      description: 'RBA comments expected to weigh on AUD',
      market: 'Sydney Open'
    },
    {
      id: 5,
      title: 'Tokyo Gap Up',
      symbol: 'NIKKEI',
      direction: 'up' as const,
      gapSize: 850,
      gapPercentage: 1.25,
      previousClose: 28500,
      currentOpen: 29350,
      unlockTime: new Date(now.getTime() + 2700000), // 45 min
      description: 'Tech stocks rallying on US earnings optimism',
      market: 'Tokyo Open'
    },
    {
      id: 6,
      title: 'Frankfurt Gap Down',
      symbol: 'DAX',
      direction: 'down' as const,
      gapSize: 450,
      gapPercentage: 0.68,
      previousClose: 19200,
      currentOpen: 18750,
      unlockTime: new Date(now.getTime() + 4500000), // 1.25 hours
      description: 'European manufacturing slowdown concerns',
      market: 'Frankfurt Open'
    }
  ]
}

export default function GapSignalsPage() {
  const [signals, setSignals] = useState(generateGapSignals())
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [selectedSignal, setSelectedSignal] = useState<any>(null)
  const [unlockedSignals, setUnlockedSignals] = useState<number[]>([])

  const handleSignalClick = (signal: any) => {
    if (isLocked(signal) && !showDisclaimer) {
      setSelectedSignal(signal)
      setShowDisclaimer(true)
    }
  }

  const handleDisclaimerConfirm = () => {
    if (selectedSignal) {
      setUnlockedSignals(prev => [...new Set([...prev, selectedSignal.id])])
      setShowDisclaimer(false)
      setSelectedSignal(null)
    }
  }

  const isLocked = (signal: any) => {
    const now = new Date().getTime()
    const unlockTime = new Date(signal.unlockTime).getTime()
    const oneHourBefore = unlockTime - 60 * 60 * 1000
    return now < oneHourBefore && !unlockedSignals.includes(signal.id)
  }

  const upGaps = signals.filter(s => s.direction === 'up')
  const downGaps = signals.filter(s => s.direction === 'down')
  const totalGaps = signals.length

  return (
    <main className="flex-1 overflow-auto bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black border-b border-gray-800 px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Gap Signals</h1>
        </div>
        <p className="text-sm text-gray-400">Market opening gap trades with countdown unlock system</p>
      </div>

      <div className="p-6 max-w-5xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatusCard 
            label="Gap Up Signals" 
            value={upGaps.length}
            color="green"
            icon="📈"
          />
          <StatusCard 
            label="Gap Down Signals" 
            value={downGaps.length}
            color="red"
            icon="📉"
          />
          <StatusCard 
            label="Today's Gaps" 
            value={totalGaps}
            color="blue"
            icon="⏰"
          />
        </div>

        {/* Unlock Info Banner */}
        <div className="mb-6 p-4 rounded-lg border border-purple-800 bg-purple-900/20">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-purple-300 mb-1">Unlock System</h3>
              <p className="text-xs text-purple-200/70">
                Gap signals are unlocked 1 hour before market open. Click on a locked signal and confirm the disclaimer to view full details early.
              </p>
            </div>
          </div>
        </div>

        {/* Gap Signals List */}
        <div className="space-y-4">
          {signals.map((signal) => {
            const locked = isLocked(signal)
            return (
              <div
                key={signal.id}
                onClick={() => handleSignalClick(signal)}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:border-green-700 ${
                  signal.direction === 'up'
                    ? 'border-green-800 bg-green-900/10'
                    : 'border-red-800 bg-red-900/10'
                } ${locked ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-bold text-white">{signal.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 font-mono">
                        {signal.market}
                      </span>
                      <span className={`text-xs font-bold uppercase tracking-wider ${signal.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {signal.direction === 'up' ? '▲ GAP UP' : '▼ GAP DOWN'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mb-3">{signal.description}</p>

                    <div className="grid grid-cols-4 gap-3 mb-3">
                      <div>
                        <div className="text-xs text-gray-500">Gap Size</div>
                        <div className="text-sm font-mono font-bold text-white">{signal.gapSize.toFixed(4)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Gap %</div>
                        <div className={`text-sm font-mono font-bold ${signal.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                          {signal.direction === 'up' ? '+' : '-'}{signal.gapPercentage.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Previous Close</div>
                        <div className="text-sm font-mono font-bold text-white">{signal.previousClose.toFixed(4)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Symbol</div>
                        <div className="text-sm font-mono font-bold text-white">{signal.symbol}</div>
                      </div>
                    </div>

                    {!locked && (
                      <CountdownTimer unlockTime={signal.unlockTime} label="Market opens in" />
                    )}
                  </div>

                  {locked ? (
                    <div className="text-right">
                      <div className="text-3xl mb-2">🔒</div>
                      <p className="text-xs text-gray-400 mb-2">Unlocks 1h before</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSignalClick(signal)
                        }}
                        className="px-3 py-1 bg-blue-900/30 border border-blue-700 rounded text-xs text-blue-400 hover:bg-blue-900/50 transition-colors cursor-pointer"
                      >
                        Unlock Now
                      </button>
                    </div>
                  ) : (
                    <div className="text-right">
                      <div className={`text-3xl mb-2 ${signal.direction === 'up' ? '📈' : '📉'}`}></div>
                      <span className={`text-xs font-mono font-bold ${signal.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        UNLOCKED
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Gap Trading Info */}
        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-bold text-white">Gap Trading Strategy</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-green-800 bg-green-900/10">
              <div className="text-xs text-green-400 font-bold mb-1">Gap Up Strategy</div>
              <p className="text-xs text-gray-300">Enter on first support, target previous resistance levels</p>
            </div>

            <div className="p-3 rounded-lg border border-red-800 bg-red-900/10">
              <div className="text-xs text-red-400 font-bold mb-1">Gap Down Strategy</div>
              <p className="text-xs text-gray-300">Enter on first resistance, target previous support levels</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 rounded-lg border border-gray-800 bg-gray-900/30">
          <p className="text-xs text-gray-400">
            ⚠️ <span className="ml-2">Gap trading carries high volatility risk. Gaps can reverse quickly. Always use proper risk management and stop losses.</span>
          </p>
        </div>
      </div>

      {/* Disclaimer Modal */}
      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => {
          setShowDisclaimer(false)
          setSelectedSignal(null)
        }}
        onConfirm={handleDisclaimerConfirm}
        title="Gap Signal Unlock Disclaimer"
        message={`You are unlocking the "${selectedSignal?.title}" gap signal before the standard 1-hour unlock time. Gap trading involves significant volatility risk. Gaps can reverse quickly, resulting in rapid losses. Always use proper stop losses and position sizing. Do you understand and accept this risk?`}
        confirmText="I Accept & Unlock"
      />
    </main>
  )
}
