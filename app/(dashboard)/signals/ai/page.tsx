'use client'

import { useState } from 'react'
import { Brain } from 'lucide-react'
import { SignalCard } from '@/components/signals/signal-card'
import { CurrencyFilter } from '@/components/signals/currency-filter'
import { StatusCard } from '@/components/signals/status-card'

const mockAISignals = [
  {
    id: 1,
    title: 'AI Strong Bullish Signal',
    symbol: 'EURUSD',
    direction: 'up' as const,
    status: 'active' as const,
    timeframe: '1H',
    confidence: 92,
    description: 'ML model detected strong uptrend with multiple confluence factors',
    tags: ['AI', 'ML', 'Bullish'],
    currency: 'EUR'
  },
  {
    id: 2,
    title: 'AI Momentum Divergence',
    symbol: 'GBPUSD',
    direction: 'down' as const,
    status: 'active' as const,
    timeframe: '4H',
    confidence: 85,
    description: 'Neural network identified bearish momentum divergence',
    tags: ['AI', 'Divergence', 'Bearish'],
    currency: 'GBP'
  },
  {
    id: 3,
    title: 'AI Support Bounce',
    symbol: 'USDJPY',
    direction: 'down' as const,
    status: 'pending' as const,
    timeframe: 'D',
    confidence: 78,
    description: 'Deep learning model confirms historical support bounce pattern',
    tags: ['AI', 'Support', 'Pattern'],
    currency: 'JPY'
  },
  {
    id: 4,
    title: 'AI Volatility Breakout',
    symbol: 'AUDUSD',
    direction: 'up' as const,
    status: 'active' as const,
    timeframe: '1H',
    confidence: 88,
    description: 'Algorithm detected unusual volatility compression followed by breakout',
    tags: ['AI', 'Volatility', 'Breakout'],
    currency: 'AUD'
  },
  {
    id: 5,
    title: 'AI Correlation Trade',
    symbol: 'NZDUSD',
    direction: 'up' as const,
    status: 'active' as const,
    timeframe: '4H',
    confidence: 81,
    description: 'Cross-correlation analysis shows bullish setup across multiple timeframes',
    tags: ['AI', 'Correlation', 'Multi-TF'],
    currency: 'NZD'
  },
  {
    id: 6,
    title: 'AI Trend Continuation',
    symbol: 'USDCAD',
    direction: 'down' as const,
    status: 'pending' as const,
    timeframe: '1H',
    confidence: 76,
    description: 'Machine learning model confirms sustained downtrend continuation',
    tags: ['AI', 'Trend', 'Continuation'],
    currency: 'CAD'
  }
]

const currencies = [
  { code: 'EUR', label: 'Euro' },
  { code: 'GBP', label: 'British Pound' },
  { code: 'JPY', label: 'Japanese Yen' },
  { code: 'AUD', label: 'Australian Dollar' },
  { code: 'NZD', label: 'New Zealand Dollar' },
  { code: 'CAD', label: 'Canadian Dollar' },
  { code: 'CHF', label: 'Swiss Franc' }
]

export default function AISignalsPage() {
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([])
  const [filteredSignals, setFilteredSignals] = useState(mockAISignals)

  const handleCurrencySelect = (currency: string) => {
    const updated = selectedCurrencies.includes(currency)
      ? selectedCurrencies.filter(c => c !== currency)
      : [...selectedCurrencies, currency]
    
    setSelectedCurrencies(updated)

    if (updated.length === 0) {
      setFilteredSignals(mockAISignals)
    } else {
      setFilteredSignals(mockAISignals.filter(s => updated.includes(s.currency)))
    }
  }

  const activeSignals = filteredSignals.filter(s => s.status === 'active')
  const avgConfidence = Math.round(
    activeSignals.reduce((sum, s) => sum + s.confidence, 0) / (activeSignals.length || 1)
  )

  return (
    <main className="flex-1 overflow-auto bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black border-b border-gray-800 px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">AI Signals</h1>
        </div>
        <p className="text-sm text-gray-400">Machine learning powered trading signals with advanced pattern recognition</p>
      </div>

      <div className="p-6 max-w-5xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatusCard 
            label="Active AI Signals" 
            value={activeSignals.length}
            color="purple"
            icon="🤖"
          />
          <StatusCard 
            label="Avg Confidence" 
            value={avgConfidence}
            unit="%"
            color="blue"
            icon="📊"
          />
          <StatusCard 
            label="AI Win Rate" 
            value="78"
            unit="%"
            color="green"
            icon="✓"
          />
        </div>

        {/* Currency Filter */}
        <div className="mb-6">
          <label className="text-sm font-bold text-gray-300 mb-3 block">Filter by Currency</label>
          <CurrencyFilter
            currencies={currencies}
            selected={selectedCurrencies}
            onSelect={handleCurrencySelect}
          />
        </div>

        {/* AI Signals List */}
        <div className="space-y-3">
          {filteredSignals.length > 0 ? (
            filteredSignals.map((signal) => (
              <SignalCard
                key={signal.id}
                title={signal.title}
                symbol={signal.symbol}
                direction={signal.direction}
                status={signal.status}
                timeframe={signal.timeframe}
                confidence={signal.confidence}
                description={signal.description}
                tags={signal.tags}
              />
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="text-gray-400 text-sm mb-2">No AI signals for selected currencies</div>
              <button
                onClick={() => {
                  setSelectedCurrencies([])
                  setFilteredSignals(mockAISignals)
                }}
                className="text-green-400 hover:text-green-300 text-sm"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Model Info */}
        <div className="mt-8 space-y-3">
          <h3 className="text-sm font-bold text-white">AI Model Performance</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border border-purple-800 bg-purple-900/10">
              <div className="text-xs text-gray-400">Model Accuracy</div>
              <div className="text-xl font-bold text-purple-400 mt-1">94.2%</div>
              <div className="text-xs text-gray-500 mt-1">on historical data</div>
            </div>

            <div className="p-3 rounded-lg border border-blue-800 bg-blue-900/10">
              <div className="text-xs text-gray-400">Signals Generated</div>
              <div className="text-xl font-bold text-blue-400 mt-1">156</div>
              <div className="text-xs text-gray-500 mt-1">last 7 days</div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 rounded-lg border border-gray-800 bg-gray-900/30">
          <p className="text-xs text-gray-400">
            ⚠️ <span className="ml-2">AI signals are generated by machine learning models and are for educational purposes only. Past performance does not guarantee future results. Always verify signals with your own analysis.</span>
          </p>
        </div>
      </div>
    </main>
  )
}
