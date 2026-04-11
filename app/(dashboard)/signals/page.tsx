'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { SignalCard } from '@/components/signals/signal-card'
import { NavPills } from '@/components/signals/nav-pills'

const mockSignals = [
  {
    id: 1,
    title: 'EUR/USD Breakout',
    symbol: 'EURUSD',
    direction: 'up' as const,
    status: 'active' as const,
    timeframe: '4H',
    confidence: 78,
    entry: 1.0950,
    target: 1.1050,
    description: 'Strong resistance breakthrough with volume confirmation',
    tags: ['Breakout', 'Support']
  },
  {
    id: 2,
    title: 'GBP/USD Retrace',
    symbol: 'GBPUSD',
    direction: 'down' as const,
    status: 'active' as const,
    timeframe: '1H',
    confidence: 65,
    entry: 1.2750,
    target: 1.2680,
    description: 'Fibonacci retracement at 61.8% level',
    tags: ['Retracement', 'Technical']
  },
  {
    id: 3,
    title: 'Gold Reversal',
    symbol: 'XAUUSD',
    direction: 'up' as const,
    status: 'pending' as const,
    timeframe: 'D',
    confidence: 72,
    entry: 2040,
    target: 2100,
    description: 'Daily support holds, bullish reversal pattern forming',
    tags: ['Reversal', 'Daily']
  },
  {
    id: 4,
    title: 'BTC/USD Range',
    symbol: 'BTCUSD',
    direction: 'down' as const,
    status: 'inactive' as const,
    timeframe: '4H',
    confidence: 55,
    entry: 68500,
    target: 67000,
    description: 'Consolidation within support/resistance range',
    tags: ['Range', 'Consolidation']
  },
  {
    id: 5,
    title: 'SPY Momentum',
    symbol: 'SPY',
    direction: 'up' as const,
    status: 'active' as const,
    timeframe: 'W',
    confidence: 82,
    entry: 580,
    target: 610,
    description: 'Weekly uptrend continuation, strong momentum indicators',
    tags: ['Momentum', 'Trend']
  },
  {
    id: 6,
    title: 'Oil Wedge Break',
    symbol: 'USOIL',
    direction: 'up' as const,
    status: 'pending' as const,
    timeframe: '4H',
    confidence: 68,
    entry: 85.5,
    target: 88.0,
    description: 'Ascending wedge breakout with high volume',
    tags: ['Breakout', 'Wedge']
  }
]

const categories = [
  { id: 'all', label: 'All Signals', count: mockSignals.length },
  { id: 'active', label: 'Active', count: mockSignals.filter(s => s.status === 'active').length },
  { id: 'pending', label: 'Pending', count: mockSignals.filter(s => s.status === 'pending').length },
  { id: 'setups', label: 'My Setups', count: 12 }
]

export default function SignalsPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredSignals, setFilteredSignals] = useState(mockSignals)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (!term) {
      setFilteredSignals(mockSignals)
      return
    }
    const filtered = mockSignals.filter(
      signal =>
        signal.title.toLowerCase().includes(term.toLowerCase()) ||
        signal.symbol.toLowerCase().includes(term.toLowerCase()) ||
        signal.description.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredSignals(filtered)
  }

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    if (categoryId === 'all') {
      setFilteredSignals(mockSignals)
    } else if (categoryId === 'active' || categoryId === 'pending') {
      setFilteredSignals(mockSignals.filter(s => s.status === categoryId))
    }
  }

  return (
    <main className="flex-1 overflow-auto bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold text-white mb-4">Signals & Setups</h1>
        <p className="text-sm text-gray-400">Browse active trading signals and market setups</p>
      </div>

      <div className="p-6 max-w-5xl">
        {/* Search and Filter Bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search signals by name, symbol, or description..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-700"
            />
          </div>
          <button className="p-2 px-4 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:border-gray-700 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Category Navigation */}
        <div className="mb-6">
          <NavPills items={categories} active={activeCategory} onSelect={handleCategoryChange} />
        </div>

        {/* Signals Grid */}
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
                entry={signal.entry}
                target={signal.target}
                description={signal.description}
                tags={signal.tags}
              />
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="text-gray-400 text-sm mb-2">No signals found</div>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilteredSignals(mockSignals)
                }}
                className="text-green-400 hover:text-green-300 text-sm"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-4 rounded-lg border border-gray-800 bg-gray-900/30">
          <p className="text-xs text-gray-400">
            💡 <span className="ml-2">All signals are provided for educational purposes only. Always conduct your own analysis and consult with a financial advisor before making investment decisions.</span>
          </p>
        </div>
      </div>
    </main>
  )
}
