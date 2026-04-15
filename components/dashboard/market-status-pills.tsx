'use client'

import { Clock, Radio, Globe, TrendingUp } from 'lucide-react'

export function MarketStatusPills() {
  return (
    <div className="space-y-4">
      {/* Top Row - Status Pills */}
      <div className="flex flex-wrap gap-3">
        {/* New York Open */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-600/40 bg-red-900/10 w-fit">
          <Clock className="w-4 h-4 text-red-400" />
          <span className="text-sm font-medium text-red-400">New York Open</span>
        </div>

        {/* Neutral Sentiment */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-600/40 bg-yellow-900/10 w-fit">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="text-sm font-medium text-yellow-400">Neutral</span>
          <span className="text-sm font-medium text-yellow-400">50</span>
        </div>
      </div>

      {/* Second Row - Monitors */}
      <div className="flex flex-wrap gap-3">
        {/* Trump Social Monitor */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple-600/40 bg-purple-900/10 w-fit">
          <Radio className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-400">TRUMP SOCIAL</span>
          <div className="w-2 h-2 rounded-full bg-purple-400 mx-1" />
          <span className="text-sm font-medium text-purple-400">Neutral USD 60</span>
        </div>
      </div>

      {/* Third Row - Economic Indicators */}
      <div className="flex flex-wrap gap-3">
        {/* FED Rate */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-600/40 bg-cyan-900/10 w-fit">
          <span className="text-sm font-mono text-cyan-400">FED_RATE — 14d 1h</span>
        </div>

        {/* Global */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple-600/40 bg-purple-900/10 w-fit">
          <Globe className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-400">Global</span>
        </div>

        {/* Live Stream */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-600/40 bg-green-900/10 w-fit">
          <span className="text-sm font-medium text-green-400">📺 News Live</span>
          <span className="text-green-400 ml-1">▶</span>
        </div>
      </div>
    </div>
  )
}
