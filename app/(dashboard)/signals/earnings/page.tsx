'use client'

import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { EarningsCard } from '@/components/signals/earnings-card'
import { NavPills } from '@/components/signals/nav-pills'
import { StatusCard } from '@/components/signals/status-card'

const mockEarnings = [
  {
    id: 1,
    company: 'Apple Inc.',
    ticker: 'AAPL',
    sector: 'Technology',
    reportTime: 'Today 4:30 PM ET',
    lastEPS: 1.97,
    estimate: 2.10,
    epsExpectation: 6.6,
    sentiment: 'bullish' as const,
    keyMetrics: {
      revenue: '92.3B',
      revenueChange: '+4.2%',
      margin: '28.5%'
    }
  },
  {
    id: 2,
    company: 'Microsoft Corporation',
    ticker: 'MSFT',
    sector: 'Technology',
    reportTime: 'Tomorrow 4:30 PM ET',
    lastEPS: 2.94,
    estimate: 3.15,
    epsExpectation: 7.1,
    sentiment: 'bullish' as const,
    keyMetrics: {
      revenue: '61.9B',
      revenueChange: '+12.3%',
      margin: '42.1%'
    }
  },
  {
    id: 3,
    company: 'JPMorgan Chase',
    ticker: 'JPM',
    sector: 'Financial',
    reportTime: 'Friday 7:00 AM ET',
    lastEPS: 3.80,
    estimate: 4.05,
    epsExpectation: 6.6,
    sentiment: 'neutral' as const,
    keyMetrics: {
      revenue: '38.5B',
      revenueChange: '+2.1%',
      margin: '35.2%'
    }
  },
  {
    id: 4,
    company: 'Tesla Inc.',
    ticker: 'TSLA',
    sector: 'Automotive',
    reportTime: 'Next Week',
    lastEPS: 0.93,
    estimate: 1.05,
    epsExpectation: -12.9,
    sentiment: 'bearish' as const,
    keyMetrics: {
      revenue: '24.9B',
      revenueChange: '-9.3%',
      margin: '14.5%'
    }
  },
  {
    id: 5,
    company: 'Amazon.com Inc.',
    ticker: 'AMZN',
    sector: 'Technology',
    reportTime: 'Next Week',
    lastEPS: 0.95,
    estimate: 1.02,
    epsExpectation: 7.4,
    sentiment: 'bullish' as const,
    keyMetrics: {
      revenue: '169.2B',
      revenueChange: '+11.2%',
      margin: '5.8%'
    }
  },
  {
    id: 6,
    company: 'Meta Platforms',
    ticker: 'META',
    sector: 'Technology',
    reportTime: 'Next Week',
    lastEPS: 5.16,
    estimate: 5.41,
    epsExpectation: 4.8,
    sentiment: 'neutral' as const,
    keyMetrics: {
      revenue: '36.5B',
      revenueChange: '+23.2%',
      margin: '40.1%'
    }
  },
  {
    id: 7,
    company: 'Nvidia Corporation',
    ticker: 'NVDA',
    sector: 'Technology',
    reportTime: 'Next Week',
    lastEPS: 0.81,
    estimate: 0.95,
    epsExpectation: 17.3,
    sentiment: 'bullish' as const,
    keyMetrics: {
      revenue: '60.9B',
      revenueChange: '126.4%',
      margin: '55.8%'
    }
  },
  {
    id: 8,
    company: 'Goldman Sachs',
    ticker: 'GS',
    sector: 'Financial',
    reportTime: 'Friday 7:30 AM ET',
    lastEPS: 10.18,
    estimate: 11.25,
    epsExpectation: 10.5,
    sentiment: 'bearish' as const,
    keyMetrics: {
      revenue: '14.3B',
      revenueChange: '-8.2%',
      margin: '28.3%'
    }
  }
]

const sectors = [
  { id: 'all', label: 'All Sectors', count: mockEarnings.length },
  { id: 'technology', label: 'Technology', count: mockEarnings.filter(e => e.sector === 'Technology').length },
  { id: 'financial', label: 'Financial', count: mockEarnings.filter(e => e.sector === 'Financial').length },
  { id: 'automotive', label: 'Automotive', count: mockEarnings.filter(e => e.sector === 'Automotive').length }
]

const sentiments = [
  { id: 'all', label: 'All Sentiments', count: mockEarnings.length },
  { id: 'bullish', label: 'Bullish', count: mockEarnings.filter(e => e.sentiment === 'bullish').length },
  { id: 'neutral', label: 'Neutral', count: mockEarnings.filter(e => e.sentiment === 'neutral').length },
  { id: 'bearish', label: 'Bearish', count: mockEarnings.filter(e => e.sentiment === 'bearish').length }
]

export default function EarningsReportsPage() {
  const [activeSector, setActiveSector] = useState('all')
  const [activeSentiment, setActiveSentiment] = useState('all')

  const filteredEarnings = mockEarnings.filter(e => {
    const sectorMatch = activeSector === 'all' || e.sector.toLowerCase() === activeSector
    const sentimentMatch = activeSentiment === 'all' || e.sentiment === activeSentiment
    return sectorMatch && sentimentMatch
  })

  const bullishCount = mockEarnings.filter(e => e.sentiment === 'bullish').length
  const bearishCount = mockEarnings.filter(e => e.sentiment === 'bearish').length
  const avgEpsChange = Math.round(
    mockEarnings.reduce((sum, e) => sum + e.epsExpectation, 0) / mockEarnings.length
  )

  return (
    <main className="flex-1 overflow-auto bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black border-b border-gray-800 px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-yellow-400" />
          <h1 className="text-2xl font-bold text-white">Earnings Reports</h1>
        </div>
        <p className="text-sm text-gray-400">Free earnings analysis and sentiment tracking</p>
      </div>

      <div className="p-6 max-w-5xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatusCard 
            label="Bullish Outlook" 
            value={bullishCount}
            color="green"
            icon="📈"
          />
          <StatusCard 
            label="Bearish Outlook" 
            value={bearishCount}
            color="red"
            icon="📉"
          />
          <StatusCard 
            label="Avg EPS Change" 
            value={avgEpsChange}
            unit="%"
            color="blue"
            icon="📊"
          />
        </div>

        {/* Sector Filter */}
        <div className="mb-6">
          <label className="text-sm font-bold text-gray-300 mb-3 block">Filter by Sector</label>
          <NavPills items={sectors} active={activeSector} onSelect={setActiveSector} />
        </div>

        {/* Sentiment Filter */}
        <div className="mb-6">
          <label className="text-sm font-bold text-gray-300 mb-3 block">Filter by Sentiment</label>
          <NavPills items={sentiments} active={activeSentiment} onSelect={setActiveSentiment} />
        </div>

        {/* Earnings Cards */}
        <div className="space-y-3">
          {filteredEarnings.length > 0 ? (
            filteredEarnings.map((earnings) => (
              <EarningsCard
                key={earnings.id}
                company={earnings.company}
                ticker={earnings.ticker}
                reportTime={earnings.reportTime}
                epsExpectation={earnings.epsExpectation}
                sentiment={earnings.sentiment}
                lastEPS={earnings.lastEPS}
                estimate={earnings.estimate}
              />
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="text-gray-400 text-sm mb-2">No earnings found with selected filters</div>
              <button
                onClick={() => {
                  setActiveSector('all')
                  setActiveSentiment('all')
                }}
                className="text-green-400 hover:text-green-300 text-sm"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Earnings Analysis */}
        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-bold text-white">Key Metrics Breakdown</h3>

          <div className="grid grid-cols-2 gap-3">
            {filteredEarnings.length > 0 && (
              <>
                <div className="p-3 rounded-lg border border-green-800 bg-green-900/10">
                  <div className="text-xs text-green-400 font-bold mb-1">Avg Revenue Growth</div>
                  <p className="text-sm text-gray-300">
                    {(
                      filteredEarnings.reduce((sum, e) => {
                        const change = parseFloat(e.keyMetrics.revenueChange)
                        return sum + change
                      }, 0) / filteredEarnings.length
                    ).toFixed(1)}%
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-blue-800 bg-blue-900/10">
                  <div className="text-xs text-blue-400 font-bold mb-1">Avg Profit Margin</div>
                  <p className="text-sm text-gray-300">
                    {(
                      filteredEarnings.reduce((sum, e) => {
                        const margin = parseFloat(e.keyMetrics.margin)
                        return sum + margin
                      }, 0) / filteredEarnings.length
                    ).toFixed(1)}%
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Earnings Calendar */}
          <div className="mt-4 p-4 rounded-lg border border-gray-800 bg-gray-900/30">
            <h4 className="text-sm font-bold text-white mb-2">Earnings Calendar Timeline</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div>📅 <span className="text-gray-300">Today: {mockEarnings.filter(e => e.reportTime.includes('Today')).length} reports</span></div>
              <div>📅 <span className="text-gray-300">Tomorrow: {mockEarnings.filter(e => e.reportTime.includes('Tomorrow')).length} reports</span></div>
              <div>📅 <span className="text-gray-300">This Week: {mockEarnings.filter(e => e.reportTime.includes('Friday')).length} reports</span></div>
              <div>📅 <span className="text-gray-300">Next Week: {mockEarnings.filter(e => e.reportTime.includes('Next Week')).length} reports</span></div>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-4 rounded-lg border border-gray-800 bg-gray-900/30">
          <p className="text-xs text-gray-400">
            💡 <span className="ml-2">All earnings analysis is provided for educational purposes. EPS expectations are consensus estimates and actual results may vary. Always do your own due diligence before trading around earnings.</span>
          </p>
        </div>
      </div>
    </main>
  )
}
