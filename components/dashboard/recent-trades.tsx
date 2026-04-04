import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight, Plus, ExternalLink } from 'lucide-react'
import type { JournalEntry } from '@/lib/types'

interface RecentTradesProps {
  trades: JournalEntry[]
}

export function RecentTrades({ trades }: RecentTradesProps) {
  if (trades.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">
            Recent Trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">No trades logged yet</p>
            <Link href="/journal/new">
              <Button variant="default" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Log Your First Trade
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">
            Recent Trades
          </CardTitle>
          <Link href="/journal">
            <Button variant="ghost" size="sm" className="text-xs">
              View All
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground font-medium py-2 px-2">Pair</th>
                <th className="text-left text-xs text-muted-foreground font-medium py-2 px-2">Direction</th>
                <th className="text-left text-xs text-muted-foreground font-medium py-2 px-2">Entry</th>
                <th className="text-left text-xs text-muted-foreground font-medium py-2 px-2">Exit</th>
                <th className="text-left text-xs text-muted-foreground font-medium py-2 px-2">P&L</th>
                <th className="text-left text-xs text-muted-foreground font-medium py-2 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr
                  key={trade.id}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-3 px-2">
                    <Link href={`/journal/${trade.id}`} className="text-sm font-medium text-foreground hover:text-primary">
                      {trade.pair}
                    </Link>
                  </td>
                  <td className="py-3 px-2">
                    <div className={cn(
                      'flex items-center gap-1 text-sm',
                      trade.direction === 'long' ? 'text-primary' : 'text-destructive'
                    )}>
                      {trade.direction === 'long' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {trade.direction.toUpperCase()}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm font-mono text-foreground">
                      {trade.entry_price}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm font-mono text-foreground">
                      {trade.exit_price || '-'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {trade.pnl !== null ? (
                      <span className={cn(
                        'text-sm font-mono font-medium',
                        trade.pnl >= 0 ? 'text-primary' : 'text-destructive'
                      )}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <Badge
                      variant={trade.status === 'open' ? 'default' : trade.status === 'closed' ? 'secondary' : 'outline'}
                      className={cn(
                        'text-xs',
                        trade.status === 'open' && 'bg-accent text-accent-foreground'
                      )}
                    >
                      {trade.status.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
