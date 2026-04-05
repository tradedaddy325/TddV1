'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TerminalBootScreen } from '@/components/terminal-boot-screen'
import { TerminalGreeting } from '@/components/dashboard/terminal-greeting'
import { LiveStreamModal } from '@/components/dashboard/live-stream-modal'
import { GrokTradingSignals } from '@/components/grok-trading-signals'
import { PostLoginLegalModal } from '@/components/post-login-legal-modal'
import { SessionStatusPills } from '@/components/session-status-pills'
import { MacroDeskTerminal } from '@/components/macro-desk-terminal'
import { MarketPsychologyTab } from '@/components/market-psychology-tab'
import { AIPauseBanner } from '@/components/ai-pause-banner'
import type { Profile } from '@/lib/types'

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showStream, setShowStream] = useState(false)
  const [bootComplete, setBootComplete] = useState(false)
  const [activeTab, setActiveTab] = useState<'home' | 'macro' | 'psychology' | 'signals'>('home')
  const [dropdownOpen, setDropdownOpen] = useState(false)

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
      {/* Terminal Boot Screen - Shows only once after login */}
      {!bootComplete && <TerminalBootScreen onComplete={() => setBootComplete(true)} />}

      {/* Post-Login Legal Modal */}
      {profile && bootComplete && <PostLoginLegalModal userId={profile.id} />}

      {/* AI Pause Banner for Market Closure */}
      <AIPauseBanner />

      {/* Market Status Header */}
      <div className="sticky top-0 z-40 bg-black border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">⏰</span>
              <span className="text-white text-sm font-mono">Market Status</span>
            </div>
          </div>

          {/* Right-Side Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-300 hover:text-green-400 font-mono text-sm transition-colors flex items-center gap-2"
            >
              {activeTab === 'home' && '≡ Menu'}
              {activeTab === 'macro' && 'Macro Desk'}
              {activeTab === 'psychology' && 'Market Psychology'}
              {activeTab === 'signals' && 'Trading Signals'}
              <span className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Dropdown Items */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-700 bg-gray-900 shadow-xl z-50">
                <button
                  onClick={() => {
                    setActiveTab('macro')
                    setDropdownOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-mono transition-colors border-b border-gray-800 last:border-b-0 ${
                    activeTab === 'macro'
                      ? 'bg-green-900/30 text-green-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-green-400'
                  }`}
                >
                  Macro Desk Terminal
                </button>
                <button
                  onClick={() => {
                    setActiveTab('psychology')
                    setDropdownOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-mono transition-colors border-b border-gray-800 last:border-b-0 ${
                    activeTab === 'psychology'
                      ? 'bg-green-900/30 text-green-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-green-400'
                  }`}
                >
                  Market Psychology
                </button>
                <button
                  onClick={() => {
                    setActiveTab('signals')
                    setDropdownOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-mono transition-colors border-b border-gray-800 last:border-b-0 ${
                    activeTab === 'signals'
                      ? 'bg-green-900/30 text-green-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-green-400'
                  }`}
                >
                  Trading Signals
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Session Status Pills */}
        <div className="mt-4">
          <SessionStatusPills />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* HOME PAGE - Default view */}
        {activeTab === 'home' && (
          <div className="space-y-6 max-w-4xl">
            {/* Trump Social Monitor & Market Events */}
            <div className="space-y-3 flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-teal-600 bg-teal-900/20">
                <span className="text-teal-400 text-xs font-mono font-bold">TRUMP SOCIAL MONITOR</span>
                <div className="w-2 h-2 rounded-full bg-teal-400"></div>
                <span className="text-white text-xs font-mono">Bullish USD</span>
                <span className="text-green-400 text-xs ml-2">80</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-purple-600 bg-purple-900/20">
                <span className="text-purple-300 text-xs font-mono">FOMC — 3d 10h</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-purple-600 bg-purple-900/20">
                <span className="text-purple-300 text-xs font-mono">Global</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-green-600 bg-green-900/20 cursor-pointer hover:bg-green-900/40 transition-colors" onClick={() => setShowStream(true)}>
                <span className="text-green-400 text-xs">📺</span>
                <span className="text-green-400 text-xs font-mono">Start News Live Stream</span>
                <span className="text-green-400 ml-2">▶</span>
              </div>
            </div>

            {/* Terminal Greeting */}
            <TerminalGreeting profile={profile} />

            {/* Active Signals & Setups */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/30 hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white">0</div>
                    <div className="text-xs text-gray-400 mt-2">Active Signals</div>
                  </div>
                  <span className="text-3xl">📈</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/30 hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white">0</div>
                    <div className="text-xs text-gray-400 mt-2">Active Setups</div>
                  </div>
                  <span className="text-3xl">👁</span>
                </div>
              </div>
            </div>

            {/* Market Intelligence */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Market Intelligence</h2>

              {/* AI Daily Brief */}
              <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 space-y-4 hover:border-green-600/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <h3 className="text-lg font-bold text-white">AI Daily Brief</h3>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-green-600 bg-green-900/20 ml-auto">
                    <span className="text-green-400 text-xs font-mono font-bold">Risk-Off</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  On April 5, 2026, with institutional positioning indicating a Risk-Off sentiment, WTI Oil is significantly bullish with an 11.15% move, presenting a potential opportunity for traders. Meanwhile, both Silver and Gold show...
                </p>
              </div>
            </div>

            {/* Market Events Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Market Sentiment (COT)</h2>

              <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold text-green-400">34</div>
                    <div className="text-xs text-gray-400 mt-1">POSITIONING GAUGE</div>
                    <div className="text-lg font-bold text-white mt-1">Risk-Off</div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-red-600 bg-red-900/20">
                    <span className="text-red-400 text-sm font-mono font-bold">Risk-Off</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MACRO DESK TERMINAL TAB */}
        {activeTab === 'macro' && <MacroDeskTerminal />}

        {/* MARKET PSYCHOLOGY TAB */}
        {activeTab === 'psychology' && <MarketPsychologyTab />}

        {/* TRADING SIGNALS TAB */}
        {activeTab === 'signals' && <GrokTradingSignals />}
      </div>

      {/* Live Stream Modal */}
      <LiveStreamModal isOpen={showStream} onClose={() => setShowStream(false)} />
    </main>
  )
}
