import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Newspaper, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'News Signals | TRADEDADDY',
  description: 'News-based trading signals and market events',
}

const newsSignals = [
  {
    id: 1,
    title: 'ECB Interest Rate Decision',
    impact: 'HIGH',
    country: 'EU',
    time: '13:15 GMT',
    previous: '4.25%',
    forecast: '4.00%',
    affectedPairs: ['EURUSD', 'EURGBP', 'EURJPY'],
  },
  {
    id: 2,
    title: 'US Non-Farm Payrolls',
    impact: 'HIGH',
    country: 'US',
    time: '13:30 GMT',
    previous: '275K',
    forecast: '180K',
    affectedPairs: ['USDJPY', 'EURUSD', 'GBPUSD'],
  },
  {
    id: 3,
    title: 'UK Retail Sales',
    impact: 'MEDIUM',
    country: 'UK',
    time: '09:00 GMT',
    previous: '0.5%',
    forecast: '0.2%',
    affectedPairs: ['GBPUSD', 'EURGBP'],
  },
]

export default function NewsSignals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-primary" />
          News Signals
        </h1>
        <p className="text-muted-foreground mt-1">
          Economic events and news that impact the markets
        </p>
      </div>

      <div className="grid gap-4">
        {newsSignals.map((signal) => (
          <Card key={signal.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{signal.title}</CardTitle>
                  <CardDescription className="mt-1">{signal.time} - {signal.country}</CardDescription>
                </div>
                <Badge 
                  className={signal.impact === 'HIGH' ? 'bg-red-500/20 text-red-400' : signal.impact === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}
                >
                  {signal.impact === 'HIGH' ? <AlertTriangle className="w-3 h-3 mr-1 inline" /> : null}
                  {signal.impact}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Previous</p>
                  <p className="text-sm font-semibold text-foreground">{signal.previous}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Forecast</p>
                  <p className="text-sm font-semibold text-primary">{signal.forecast}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Expected</p>
                  <p className="text-sm font-semibold text-gray-400">TBD</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Affected Pairs</p>
                <div className="flex flex-wrap gap-2">
                  {signal.affectedPairs.map((pair) => (
                    <Badge key={pair} variant="outline" className="text-xs">
                      {pair}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 border border-border/50 rounded-lg bg-yellow-500/5">
        <p className="text-sm text-foreground font-medium mb-2">Pro Tip</p>
        <p className="text-sm text-muted-foreground">
          Be cautious around high-impact news events. Volatility can spike dramatically, creating both opportunities and risks. Consider reducing position sizes or staying in cash before major announcements.
        </p>
      </div>
    </div>
  )
}
