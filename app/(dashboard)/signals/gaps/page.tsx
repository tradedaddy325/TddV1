import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gap Signals | TRADEDADDY',
  description: 'Market gap analysis and trading opportunities',
}

const gapSignals = [
  {
    id: 1,
    symbol: 'Gold',
    gapType: 'Bullish',
    gapSize: '2.45%',
    openLevel: 2045.00,
    gapStart: 2040.00,
    gapEnd: 2090.00,
    timeframe: 'Daily',
    status: 'Filling',
  },
  {
    id: 2,
    symbol: 'EURUSD',
    gapType: 'Bearish',
    gapSize: '0.85%',
    openLevel: 1.0820,
    gapStart: 1.0950,
    gapEnd: 1.0800,
    timeframe: 'Daily',
    status: 'Unfilled',
  },
  {
    id: 3,
    symbol: 'GBPUSD',
    gapType: 'Bullish',
    gapSize: '1.20%',
    openLevel: 1.2580,
    gapStart: 1.2520,
    gapEnd: 1.2700,
    timeframe: 'Weekly',
    status: 'Filled',
  },
]

export default function GapSignals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Gap Signals
        </h1>
        <p className="text-muted-foreground mt-1">
          Market gaps and gap-fill trading opportunities
        </p>
      </div>

      <div className="grid gap-4">
        {gapSignals.map((signal) => (
          <Card key={signal.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{signal.symbol}</CardTitle>
                  <CardDescription>{signal.timeframe} Timeframe</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge 
                    className={signal.gapType === 'Bullish' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                  >
                    {signal.gapType === 'Bullish' ? (
                      <TrendingUp className="w-3 h-3 mr-1 inline" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1 inline" />
                    )}
                    {signal.gapType}
                  </Badge>
                  <Badge variant="outline">{signal.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Gap Size</p>
                  <p className="text-sm font-semibold text-primary">{signal.gapSize}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Open Level</p>
                  <p className="text-sm font-semibold text-foreground">{signal.openLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Gap Range</p>
                  <p className="text-sm font-semibold text-foreground">{signal.gapStart} - {signal.gapEnd}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Next Target</p>
                  <p className="text-sm font-semibold text-green-400">{signal.gapEnd}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 border border-border/50 rounded-lg bg-card/50">
        <p className="text-sm text-foreground font-medium mb-2">Understanding Gaps</p>
        <p className="text-sm text-muted-foreground">
          Market gaps occur when the opening price is significantly different from the previous closing price. Traders often look to "fill" gaps as price tends to return to those levels. Gaps on high volume are more significant than those on low volume.
        </p>
      </div>
    </div>
  )
}
