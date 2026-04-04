import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Target, Zap, BarChart3, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/types'

interface QuickStatsProps {
  stats: {
    totalTrades: number
    winRate: string
    totalPnl: string
    openTrades: number
  }
  profile: Profile
}

export function QuickStats({ stats, profile }: QuickStatsProps) {
  const pnlValue = parseFloat(stats.totalPnl)
  const isProfit = pnlValue >= 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {/* Total Trades */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            TOTAL TRADES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">{stats.totalTrades}</p>
        </CardContent>
      </Card>

      {/* Win Rate */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
            <Target className="w-3 h-3" />
            WIN RATE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={cn(
            'text-2xl font-bold',
            parseFloat(stats.winRate) >= 50 ? 'text-primary' : 'text-destructive'
          )}>
            {stats.winRate}%
          </p>
        </CardContent>
      </Card>

      {/* Total P&L */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            TOTAL P&L
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1">
            {isProfit ? (
              <TrendingUp className="w-4 h-4 text-primary" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
            <p className={cn(
              'text-2xl font-bold',
              isProfit ? 'text-primary' : 'text-destructive'
            )}>
              ${Math.abs(pnlValue).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Open Positions */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            OPEN TRADES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-accent">{stats.openTrades}</p>
        </CardContent>
      </Card>

      {/* Credits */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="w-3 h-3" />
            CREDITS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-warning">{profile?.credits || 0}</p>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground">
            TIER
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary uppercase">
            {profile?.subscription_tier || 'FREE'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
