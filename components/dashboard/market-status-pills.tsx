'use client'

import { useState } from 'react'
import { Clock, Radio, Globe, TrendingUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MarketStatusPills() {
  const [showYouTube, setShowYouTube] = useState(false)

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

        {/* Live Stream Button */}
        <Button
          onClick={() => setShowYouTube(!showYouTube)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-600/40 bg-green-900/10 hover:bg-green-900/20 transition-colors h-auto"
          variant="ghost"
        >
          <span className="text-sm font-medium text-green-400">📺 News Live</span>
          <span className="text-green-400">▶</span>
        </Button>
      </div>

      {/* YouTube Live Stream */}
      {showYouTube && (
        <div className="rounded-lg border border-green-600/40 bg-green-900/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-green-400">Live Market News Stream</h3>
            <Button
              onClick={() => setShowYouTube(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          <div className="relative w-full overflow-hidden rounded-lg bg-black" style={{ aspectRatio: '16/9' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/iEpJwprxDdk?si=36pg9UaewpPeTPIs&autoplay=1"
              title="Trade Daddy Live Market News"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            />
          </div>
        </div>
      )}
    </div>
  )
}
