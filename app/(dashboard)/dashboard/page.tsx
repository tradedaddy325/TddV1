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
      {/* Market Status Header */}
      <div className="sticky top-0 z-40 bg-black border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">⏰</span>
              <span className="text-white text-sm font-mono">New York Open</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-600 bg-yellow-900/20">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <span className="text-yellow-400 text-sm font-mono">Neutral 50</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple-600 bg-purple-900/20">
            <span className="text-purple-300 text-sm font-mono uppercase font-bold">TRUMP SOCIAL MONITOR</span>
            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            <span className="text-white text-sm font-mono">Neutral USD 55</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl">
        {/* Terminal Greeting */}
        <TerminalGreeting profile={profile} />

        {/* Market Events */}
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

        {/* Terminal Welcome */}
        <div className="font-mono text-green-400 text-sm">
          Welcome, {profile?.display_name || 'Trader'}|
        </div>

        {/* Active Signals & Setups */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-xs text-gray-400 mt-1">Active Signals</div>
              </div>
              <span className="text-3xl text-green-400">📈</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-xs text-gray-400 mt-1">Active Setups</div>
              </div>
              <span className="text-3xl text-green-400">👁</span>
            </div>
          </div>
        </div>

        {/* Market Intelligence Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Market Intelligence</h2>

          {/* AI Daily Brief */}
          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl text-green-400">✨</span>
              <h3 className="text-lg font-bold text-white">AI Daily Brief</h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-green-600 bg-green-900/20 ml-auto">
                <span className="text-green-400 text-xs font-mono font-bold">Risk-Off</span>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Today, the market is in a Risk-Off environment with no major economic events affecting trading. The notable gain in WTI Oil, up 11.15%, signals a bullish opportunity amidst bearish movements in Silver and Gold, which are showing extreme weakness...
            </p>
          </div>

          {/* Dollar Index */}
          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 space-y-4">
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">(DXY)</h3>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-4xl font-bold text-white">27.86</span>
                  <span className="text-green-400 text-xl font-mono">↗ 0.47%</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-green-600 bg-green-900/20 w-fit">
                <span className="text-green-400 text-xs font-mono whitespace-nowrap">Healthy positive curve</span>
              </div>
            </div>

            {/* Metric Cards with Circular Indicators */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <CircularMetric label="Dollar pressure" sublabel="Momentum" value="64" color="blue" />
              <CircularMetric label="10Y-2Y spread" sublabel="Healthy curve" value="0.52%" color="orange" />
            </div>
          </div>

          {/* Smart Money Tracker */}
          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-green-400">⚡</span> Smart Money Tracker
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <CircularMetric label="Volume pressure" sublabel="Current flow vs normal activity" value="45" color="blue" />
              <CircularMetric label="Open interest pulse" sublabel="Participation across futures" value="36" color="purple" />
              <CircularMetric label="Institutional flow" sublabel="Capital leaning in or out" value="48" color="green" />
              <CircularMetric label="Sentiment divergence" sublabel="Smart money vs retail proxy" value="12" color="pink" />
            </div>
          </div>

          {/* Market Sentiment */}
          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Market Sentiment (COT)</h3>
                <div className="text-xs text-gray-400 mt-1">Latest CFTC week • Mar 31, 2026</div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-red-600 bg-red-900/20">
                <span className="text-red-400 text-xs font-mono font-bold">Risk-Off</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center gap-4">
              <CircularMetricLarge value="34" label="COT" sublabel="Risk-Off" color="green" />
              <div>
                <div className="text-sm font-mono text-gray-400 uppercase">POSITIONING GAUGE</div>
                <div className="text-lg font-bold text-white mt-2">Risk-Off</div>
                <div className="text-xs text-gray-500 mt-2">Positioning remains bearish</div>
              </div>
            </div>

            <div className="text-xs text-gray-400 uppercase tracking-wider">AI INTERPRETATION</div>
            <p className="text-sm text-gray-300 leading-relaxed">
              The latest CFTC data indicates a Risk-Off sentiment, with gold showing an extreme bearish label despite a modest weekly increase in managed money positions. The EUR/USD reflects a moderate bearish positioning...
            </p>
          </div>

          {/* Neural Expansion */}
          <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/30 cursor-pointer hover:bg-gray-900/50 transition">
            <div className="flex items-center justify-between">
              <span className="text-white font-mono">▼ Neural Expansion</span>
            </div>
          </div>
        </div>

        {/* Live Market Data - with glowing green indicator */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Live Market Data</h2>
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-green-800 bg-green-900/10">
              <div className="text-xs text-green-400 font-mono uppercase mb-2">Bitcoin</div>
              <div className="text-2xl font-bold text-green-400">$68,420</div>
              <div className="text-xs text-green-300 mt-1">▲ 2.34%</div>
            </div>

            <div className="p-4 rounded-lg border border-blue-800 bg-blue-900/10">
              <div className="text-xs text-blue-400 font-mono uppercase mb-2">Ethereum</div>
              <div className="text-2xl font-bold text-blue-400">$3,842</div>
              <div className="text-xs text-blue-300 mt-1">▲ 1.87%</div>
            </div>

            <div className="p-4 rounded-lg border border-yellow-800 bg-yellow-900/10">
              <div className="text-xs text-yellow-400 font-mono uppercase mb-2">Gold</div>
              <div className="text-2xl font-bold text-yellow-400">$2,045</div>
              <div className="text-xs text-yellow-300 mt-1">▼ -0.52%</div>
            </div>

            <div className="p-4 rounded-lg border border-purple-800 bg-purple-900/10">
              <div className="text-xs text-purple-400 font-mono uppercase mb-2">DXY</div>
              <div className="text-2xl font-bold text-purple-400">103.42</div>
              <div className="text-xs text-purple-300 mt-1">▲ 0.18%</div>
            </div>
          </div>
        </div>

        {/* Grok Trading Signals */}
        <div className="mt-8">
          <GrokTradingSignals />
        </div>
      </div>

      {/* Live Stream Modal */}
      <LiveStreamModal isOpen={showStream} onClose={() => setShowStream(false)} />
    </main>
  )
}
