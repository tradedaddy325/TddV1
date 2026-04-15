'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { QuickStats } from '@/components/dashboard/quick-stats'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { MarketOverview } from '@/components/dashboard/market-overview'
import { AIIntelligence } from '@/components/dashboard/ai-intelligence'
import { AIDailyBrief } from '@/components/dashboard/ai-daily-brief'
import { RecentTrades } from '@/components/dashboard/recent-trades'
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

  const stats = {
    totalTrades: 247,
    winRate: '62.5',
    totalPnl: '12450.50',
    openTrades: 3,
  }

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="p-6 space-y-6 max-w-7xl">
        {/* Quick Stats */}
        {profile && <QuickStats stats={stats} profile={profile} />}

        {/* Quick Actions */}
        <QuickActions />

        {/* Market Overview */}
        <MarketOverview />

        {/* AI Intelligence */}
        <AIIntelligence />

        {/* AI Daily Brief */}
        <AIDailyBrief />

        {/* Recent Trades */}
        <RecentTrades />
      </div>
    </main>
  )
}
