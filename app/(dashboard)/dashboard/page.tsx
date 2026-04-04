import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MarketOverview } from '@/components/dashboard/market-overview'
import { QuickStats } from '@/components/dashboard/quick-stats'
import { RecentTrades } from '@/components/dashboard/recent-trades'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { TerminalGreeting } from '@/components/dashboard/terminal-greeting'
import { AIIntelligence } from '@/components/dashboard/ai-intelligence'
import type { Profile, JournalEntry } from '@/lib/types'

export const metadata = {
  title: 'Dashboard | TRADEDADDY',
  description: 'Your trading command center',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch recent journal entries
  const { data: recentTrades } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Calculate stats
  const { data: allTrades } = await supabase
    .from('journal_entries')
    .select('pnl, status')
    .eq('user_id', user.id)

  const stats = calculateStats(allTrades || [])

  return (
    <div className="space-y-6">
      {/* Terminal Greeting */}
      <TerminalGreeting profile={profile as Profile} />

      {/* Quick Stats */}
      <QuickStats stats={stats} profile={profile as Profile} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Overview - 2 columns */}
        <div className="lg:col-span-2">
          <MarketOverview />
        </div>

        {/* AI Intelligence */}
        <div>
          <AIIntelligence />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Trades */}
      <RecentTrades trades={(recentTrades || []) as JournalEntry[]} />
    </div>
  )
}

function calculateStats(trades: { pnl: number | null; status: string }[]) {
  const closedTrades = trades.filter((t) => t.status === 'closed')
  const totalTrades = closedTrades.length
  const winningTrades = closedTrades.filter((t) => t.pnl && t.pnl > 0).length
  const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0)
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

  return {
    totalTrades,
    winRate: winRate.toFixed(1),
    totalPnl: totalPnl.toFixed(2),
    openTrades: trades.filter((t) => t.status === 'open').length,
  }
}
