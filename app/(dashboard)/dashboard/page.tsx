'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Menu } from 'lucide-react'
import { Clock, TrendingUp, Eye, Zap } from 'lucide-react'
import type { Profile } from '@/lib/types'

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

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
    <main className="flex-1 overflow-auto bg-black min-h-screen">
      {/* Terminal Header */}
      <div className="sticky top-0 z-40 bg-black border-b border-gray-800 px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Trade Daddy <span className="text-purple-400">Terminal</span></h1>
              <p className="text-xs text-gray-400">Powered by Claude & Gemini</p>
            </div>
          </div>

          {/* Menu Button */}
          <button className="p-3 bg-green-400 rounded-2xl hover:bg-green-500 transition-colors">
            <Menu className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-5xl">
        {/* Metric Pills - Terminal Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 px-4 py-3 rounded-full border border-red-600 bg-red-900/20 w-fit">
            <Clock className="w-4 h-4 text-red-400" />
            <span className="text-sm font-mono text-red-400">New York Open</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-full border border-yellow-600 bg-yellow-900/20 w-fit">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="text-sm font-mono text-yellow-400">Neutral</span>
            <span className="text-sm font-mono text-yellow-400">50</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-full border border-purple-600 bg-purple-900/20 w-fit">
            <span className="text-sm font-mono text-purple-400">TRUMP SOCIAL MONITOR</span>
            <div className="w-3 h-3 rounded-full bg-purple-400 ml-1" />
            <span className="text-sm font-mono text-purple-400">Neutral USD</span>
            <span className="text-sm font-mono text-purple-400">60</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-full border border-cyan-600 bg-cyan-900/20 w-fit">
            <span className="text-sm font-mono text-cyan-400">FED_RATE — 14d 1h</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-full border border-purple-600 bg-purple-900/20 w-fit">
            <span className="text-sm font-mono text-purple-400">Global</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-full border border-green-600 bg-green-900/20 w-fit">
            <span className="text-sm font-mono text-green-400">📺 Start News Live Stream</span>
            <span className="text-sm font-mono text-green-400 ml-1">▶</span>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-green-400 font-mono text-sm">
          Welcome, {profile?.display_name || 'trader'}|
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">1</div>
                <div className="text-xs text-gray-400">Active Signals</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">0</div>
                <div className="text-xs text-gray-400">Active Setups</div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Intelligence */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Market Intelligence</h2>

          <div className="p-6 rounded-xl border border-green-800 bg-green-900/20 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <h3 className="text-lg font-bold text-white">AI Daily Brief</h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-green-600 bg-green-900/20 ml-auto">
                <span className="text-green-400 text-xs font-mono font-bold">Risk-Off</span>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              On April 14, 2026, with no major economic events and a risk-off sentiment prevailing in institutional positioning, key movers include WTI Oil gaining 2.92%, while Silver shows a bearish trend with a decline of 1.16%. The...
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

/* ================= COMPONENTS ================= */

function CircularMetric({
  label,
  sublabel,
  value,
  color,
}: {
  label: string
  sublabel: string
  value: string
  color: string
}) {
  const map: Record<string, { color: string }> = {
    blue: { color: '#3b82f6' },
    green: { color: '#10b981' },
    purple: { color: '#a855f7' },
    pink: { color: '#ec4899' },
    orange: { color: '#f59e0b' },
  }

  const c = map[color] ?? map.blue

  return (
    <div className="p-4 rounded-lg border border-gray-700 bg-gray-900/30 flex flex-col items-center">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-xs text-gray-500">{sublabel}</div>

      <svg className="w-24 h-24 mt-2" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="2" />
        <circle cx="50" cy="50" r="45" fill="none" stroke={c.color} strokeWidth="3" />
        <text x="50" y="55" textAnchor="middle" fill="white" fontSize="16">
          {value}
        </text>
      </svg>
    </div>
  )
}

function CircularMetricLarge({
  value,
  label,
  sublabel,
  color,
}: {
  value: string
  label: string
  sublabel: string
  color: string
}) {
  const map: Record<string, { color: string }> = {
    blue: { color: '#3b82f6' },
    green: { color: '#10b981' },
    purple: { color: '#a855f7' },
    pink: { color: '#ec4899' },
  }

  const c = map[color] ?? map.green

  return (
    <div className="flex flex-col items-center">
      <svg className="w-28 h-28" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="2" />
        <circle cx="50" cy="50" r="45" fill="none" stroke={c.color} strokeWidth="4" />
        <text x="50" y="55" textAnchor="middle" fill="white" fontSize="20">
          {value}
        </text>
      </svg>

      <div className="text-xs text-gray-400 mt-2">{label}</div>
      <div className="text-xs text-gray-500">{sublabel}</div>
    </div>
  )
}
