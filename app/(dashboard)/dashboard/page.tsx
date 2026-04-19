'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TerminalGreeting } from '@/components/dashboard/terminal-greeting'
import { LiveStreamModal } from '@/components/dashboard/live-stream-modal'
import { AIDailyBrief } from '@/components/dashboard/ai-daily-brief'
import { MetricPills } from '@/components/dashboard/metric-pills'
import { DailyIntelligenceWidget } from '@/components/DailyIntelligenceWidget'
import type { Profile } from '@/lib/types'

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showStream, setShowStream] = useState(false)

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
    <main className="flex-1 overflow-auto bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-white font-mono">Market Status</div>
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl">
        <AIDailyBrief />
        <MetricPills />
        <DailyIntelligenceWidget />

        <TerminalGreeting profile={profile} />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/30">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-xs text-gray-400">Active Signals</div>
          </div>

          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/30">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-xs text-gray-400">Active Setups</div>
          </div>
        </div>

        {/* Market Intelligence */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Market Intelligence</h2>

          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
            <h3 className="text-lg font-bold text-white">DXY - Dollar Index</h3>

            <div className="flex items-center gap-3 mt-3">
              <span className="text-4xl font-bold text-white">103.42</span>
              <span className="text-green-400 font-mono">+0.47%</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <CircularMetric label="Dollar pressure" sublabel="Momentum" value="64" color="blue" />
              <CircularMetric label="10Y-2Y spread" sublabel="Curve" value="0.52%" color="orange" />
            </div>
          </div>

          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
            <h3 className="text-lg font-bold text-white">Smart Money Tracker</h3>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <CircularMetric label="Volume pressure" sublabel="Flow" value="45" color="blue" />
              <CircularMetric label="Open interest" sublabel="Futures" value="36" color="purple" />
              <CircularMetric label="Institutional flow" sublabel="Capital" value="48" color="green" />
              <CircularMetric label="Sentiment divergence" sublabel="Retail vs Smart" value="12" color="pink" />
            </div>
          </div>

          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
            <h3 className="text-lg font-bold text-white">Market Sentiment</h3>

            <div className="p-4 mt-4 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center gap-4">
              <CircularMetricLarge
                value="34"
                label="COT"
                sublabel="Risk-Off"
                color="green"
              />

              <div>
                <div className="text-lg font-bold text-white">Risk-Off</div>
                <div className="text-xs text-gray-400">Bearish positioning bias</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border border-green-800 bg-green-900/10 rounded-lg">
            <div className="text-green-400 text-xs">Bitcoin</div>
            <div className="text-green-400 text-xl font-bold">$68,420</div>
          </div>

          <div className="p-4 border border-blue-800 bg-blue-900/10 rounded-lg">
            <div className="text-blue-400 text-xs">Ethereum</div>
            <div className="text-blue-400 text-xl font-bold">$3,842</div>
          </div>

          <div className="p-4 border border-yellow-800 bg-yellow-900/10 rounded-lg">
            <div className="text-yellow-400 text-xs">Gold</div>
            <div className="text-yellow-400 text-xl font-bold">$2,045</div>
          </div>

          <div className="p-4 border border-purple-800 bg-purple-900/10 rounded-lg">
            <div className="text-purple-400 text-xs">DXY</div>
            <div className="text-purple-400 text-xl font-bold">103.42</div>
          </div>
        </div>
      </div>

      <LiveStreamModal isOpen={showStream} onClose={() => setShowStream(false)} />
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
