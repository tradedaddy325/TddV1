'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { QuickStats } from '@/components/dashboard/quick-stats'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { MarketOverview } from '@/components/dashboard/market-overview'
import { AIDailyBrief } from '@/components/dashboard/ai-daily-brief'
import { DailyIntelligenceWidget } from '@/components/dashboard/daily-intelligence-widget'
import { RecentTrades } from '@/components/dashboard/recent-trades'
import { MarketStatusPills } from '@/components/dashboard/market-status-pills'
import { SystemsOperational } from '@/components/dashboard/systems-operational'
import { WelcomeMessage } from '@/components/dashboard/welcome-message'
import type { Profile, JournalEntry } from '@/lib/types'

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [trades, setTrades] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        setProfile(profileData)

        // Fetch recent trades
        const { data: tradesData } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        setTrades(tradesData || [])
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const stats = {
    totalTrades: 247,
    winRate: '62.5',
    totalPnl: '12450.50',
    openTrades: 3,
  }

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="p-6 space-y-6 max-w-7xl">
        {/* Market Status Pills */}
        <MarketStatusPills />

        {/* Systems Operational */}
        <SystemsOperational />

        {/* Welcome Message */}
        {profile && <WelcomeMessage displayName={profile.display_name || undefined} />}

        {/* Quick Stats */}
        {profile && <QuickStats stats={stats} profile={profile} />}

        {/* Quick Actions */}
        <QuickActions />

        {/* Market Overview */}
        <MarketOverview />

        {/* Daily Intelligence Widget */}
        <DailyIntelligenceWidget />

        {/* AI Daily Brief */}
        <AIDailyBrief />

        {/* Recent Trades */}
        <RecentTrades trades={trades} />
      </div>
    </main>
  )
}
