'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TerminalGreeting } from '@/components/dashboard/terminal-greeting'
import { LiveStreamModal } from '@/components/dashboard/live-stream-modal'
import { GrokTradingSignals } from '@/components/grok-trading-signals'
import { PostLoginLegalModal } from '@/components/post-login-legal-modal'
import { MacroDeskTerminal } from '@/components/macro-desk-terminal'
import { MarketPsychologyTab } from '@/components/market-psychology-tab'
import { AIPauseBanner } from '@/components/ai-pause-banner'
import type { Profile } from '@/lib/types'

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  
  const [profile, setProfile] = useState<Profile | null>(null)
  const [showStream, setShowStream] = useState(false)
  const [activeTab, setActiveTab] = useState<'home' | 'macro' | 'psychology' | 'signals'>('home')

  useEffect(() => {
    if (tabParam === 'macro' || tabParam === 'psychology' || tabParam === 'signals') {
      setActiveTab(tabParam)
    }
  }, [tabParam])

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
    }

    fetchProfile()
  }, [])

  return (
    <main className="flex-1 overflow-auto bg-black">
      {profile && <PostLoginLegalModal userId={profile.id} />}
      <AIPauseBanner />

      <div className="p-6 space-y-6 max-w-6xl">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="px-4 py-3 rounded-lg border border-yellow-600 bg-yellow-900/20 flex items-center gap-3">
              <span className="text-yellow-400 text-lg">🌙</span>
              <span className="text-yellow-400 font-mono text-sm uppercase tracking-wider">Markets Closed</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-600 bg-yellow-900/20">
                <span className="text-yellow-400 font-mono text-sm">⏰</span>
                <span className="text-yellow-400 font-mono text-sm font-bold">Tokyo Open</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple-600 bg-purple-900/20">
                <span className="text-purple-300 font-mono text-sm">London Open</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-teal-600 bg-teal-900/20">
                <span className="text-teal-400 text-xs font-mono font-bold">TRUMP SOCIAL MONITOR</span>
                <span className="text-teal-300 text-xs font-mono">Bullish USD 80</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple-600 bg-purple-900/20">
                <span className="text-purple-300 font-mono text-sm">FOMC — 3d 10h</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-600 bg-gray-900/20">
                <span className="text-gray-400 font-mono text-sm">Global</span>
              </div>
              <button
                onClick={() => setShowStream(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-600 bg-green-900/20 hover:bg-green-900/40 transition-colors cursor-pointer"
              >
                <span className="text-green-400">📺</span>
                <span className="text-green-400 font-mono text-sm font-bold">Start News Live Stream</span>
                <span className="text-green-400 ml-2">▶</span>
              </button>
            </div>

            <p className="text-green-400 font-mono text-sm">Welcome, {profile?.display_name || 'Trader'}|</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/30">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📈</span>
                  <div>
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-xs text-gray-400 mt-1">Active Signals</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/30">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👁</span>
                  <div>
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-xs text-gray-400 mt-1">Active Setups</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Market Intelligence</h2>

              <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <h3 className="text-base font-bold text-white">AI Daily Brief</h3>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-green-600 bg-green-900/20 ml-auto">
                    <span className="text-green-400 text-xs font-mono font-bold">Risk-Off</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  On April 5, 2026, with institutional positioning indicating a Risk-Off sentiment, WTI Oil is significantly bullish with an 11.15% move, presenting a potential opportunity for traders. Meanwhile, both Silver and Gold show...
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'macro' && <MacroDeskTerminal />}
        {activeTab === 'psychology' && <MarketPsychologyTab />}
        {activeTab === 'signals' && <GrokTradingSignals />}
      </div>

      <LiveStreamModal isOpen={showStream} onClose={() => setShowStream(false)} />
    </main>
  )
}
