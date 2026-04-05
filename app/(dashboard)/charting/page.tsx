'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp } from 'lucide-react'

export default function ChartingPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Charting Terminal</h1>
        <p className="text-gray-400">Professional-grade charting with technical analysis tools</p>
      </div>

      {/* Chart Placeholder */}
      <Card className="p-8 bg-gray-900/50 border-gray-800 aspect-video flex flex-col items-center justify-center">
        <TrendingUp className="w-12 h-12 text-gray-600 mb-4" />
        <p className="text-gray-500 text-center">
          Interactive charting platform with TradingView integration
        </p>
        <p className="text-gray-600 text-xs mt-2">Coming soon: Multi-timeframe analysis, indicators, drawings</p>
      </Card>

      {/* Tools */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Available Tools</h2>
        <div className="grid grid-cols-2 gap-3">
          {['Trend Lines', 'Support/Resistance', 'Fibonacci', 'Moving Averages', 'RSI', 'MACD', 'Volume', 'Alerts'].map(tool => (
            <Card key={tool} className="p-3 bg-gray-900/50 border-gray-800 text-center cursor-pointer hover:border-cyan-600/50 transition-colors">
              <p className="text-sm font-semibold text-gray-300">{tool}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
