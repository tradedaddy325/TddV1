'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TerminalGreeting } from '@/components/dashboard/terminal-greeting'
import { LiveStreamModal } from '@/components/dashboard/live-stream-modal'
import { GrokTradingSignals } from '@/components/grok-trading-signals'
import { PostLoginLegalModal } from '@/components/post-login-legal-modal'
import { LiveMarketCarousel } from '@/components/live-market-carousel'
import { SessionStatusPills } from '@/components/session-status-pills'
import { MacroDeskTerminal } from '@/components/macro-desk-terminal'
import { MarketPsychologyTab } from '@/components/market-psychology-tab'
import { AIPauseBanner } from '@/components/ai-pause-banner'
import type { Profile } from '@/lib/types'

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showStream, setShowStream] = useState(false)
  const [activeTab, setActiveTab] = useState<'macro' | 'psychology' | 'signals'>('macro')

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  return (
    <main className="flex-1 overflow-auto bg-black">
      {/* Post-Login Legal Modal */}
      {profile && <PostLoginLegalModal userId={profile.id} />}

      {/* AI Pause Banner for Market Closure */}
      <AIPauseBanner />

      {/* Market Status Header with Session Status Pills */}
      <div className="sticky top-0 z-40 bg-black border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <SessionStatusPills />
        </div>
      </div>

      {/* Live Market Data Carousel */}
      <div className="px-6 py-4 bg-gray-900/30 border-b border-gray-800">
        <LiveMarketCarousel />
      </div>

      <div className="p-6 space-y-6 max-w-7xl">
        {/* Terminal Greeting */}
        <TerminalGreeting profile={profile} />

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('macro')}
            className={`px-4 py-2 font-mono text-sm transition-colors ${
              activeTab === 'macro'
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Macro Desk Terminal
          </button>
          <button
            onClick={() => setActiveTab('psychology')}
            className={`px-4 py-2 font-mono text-sm transition-colors ${
              activeTab === 'psychology'
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Market Psychology
          </button>
          <button
            onClick={() => setActiveTab('signals')}
            className={`px-4 py-2 font-mono text-sm transition-colors ${
              activeTab === 'signals'
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Trading Signals
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'macro' && <MacroDeskTerminal />}
          {activeTab === 'psychology' && <MarketPsychologyTab />}
          {activeTab === 'signals' && <GrokTradingSignals />}
        </div>

        {/* Legacy Market Events - Kept for reference */}
        {activeTab === 'macro' && (
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold text-white">Market Events</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-600 bg-red-900/20 w-fit">
                <span className="text-red-400 text-sm font-mono">FOMC — 4d 2h</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-600 bg-gray-900/20 w-fit">
                <span className="text-gray-400 text-sm font-mono">Global</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-600 bg-green-900/20 cursor-pointer hover:bg-green-900/40 transition-colors" onClick={() => setShowStream(true)}>
                <span className="text-green-400 text-sm">📺</span>
                <span className="text-green-400 text-sm font-mono">Start News Live Stream</span>
                <span className="text-green-400 ml-auto">▶</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Stream Modal */}
      <LiveStreamModal isOpen={showStream} onClose={() => setShowStream(false)} />
    </main>
  )
}
