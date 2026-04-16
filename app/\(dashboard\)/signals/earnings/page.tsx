import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Earnings Signals | TRADEDADDY',
  description: 'Earnings announcements and stock trading signals',
}

const earningsSignals = [
  {
    id: 1,
    company: 'Apple Inc.',
    ticker: 'AAPL',
    date: 'Apr 25, 2024',
    expectedEPS: '1.20',
    priorEPS: '1.52',
    marketCap: '2.8T',
    sentiment: 'Mixed',
    volatilityExpected: 'High',
  },
  {
    id: 2,
    company: 'Microsoft Corp.',
    ticker: 'MSFT',
    date: 'Apr 25, 2024',
    expectedEPS: '2.94',
    priorEPS: '2.75',
    marketCap: '3.0T',
    sentiment: 'Bullish',
    volatilityExpected: 'Moderate',
  },
  {
    id: 3,
    company: 'Amazon.com Inc.',
    ticker: 'AMZN',
    date: 'Apr 30, 2024',
    expectedEPS: '0.98',
    priorEPS: '0.65',
    marketCap: '1.8T',
    sentiment: 'Bullish',
    volatilityExpected: 'High',
  },
]

export default function EarningsSignals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-primary" />
          Earnings Signals
        </h1>
        <p className="text-muted-foreground mt-1">
          Upcoming earnings announcements and trading opportunities
        </p>
      </div>

      <div className="grid gap-4">
        {earningsSignals.map((signal) => {
          const epsBeats = parseFloat(signal.expectedEPS) > parseFloat(signal.priorEPS)
          
          return (
            <Card key={signal.id} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{signal.company}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{signal.ticker}</Badge>
                      {signal.date}
                    </CardDescription>
                  </div>
                  <Badge 
                    className={signal.sentiment === 'Bullish' ? 'bg-green-500/20 text-green-400' : signal.sentiment === 'Bearish' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}
                  >
                    {signal.sentiment === 'Bullish' ? (
                      <TrendingUp className="w-3 h-3 mr-1 inline" />
                    ) : signal.sentiment === 'Bearish' ? (
                      <TrendingDown className="w-3 h-3 mr-1 inline" />
                    ) : null}
                    {signal.sentiment}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Expected EPS</p>
                    <p className={`text-sm font-semibold ${epsBeats ? 'text-green-400' : 'text-red-400'}`}>
                      {signal.expectedEPS}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Prior EPS</p>
                    <p className="text-sm font-semibold text-foreground">{signal.priorEPS}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
                    <p className="text-sm font-semibold text-foreground">{signal.marketCap}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Volatility</p>
                    <Badge variant="outline" className="text-xs">{signal.volatilityExpected}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">EPS Change</p>
                    <p className={`text-sm font-semibold ${epsBeats ? 'text-green-400' : 'text-red-400'}`}>
                      {epsBeats ? '+' : '-'}{Math.abs((parseFloat(signal.expectedEPS) - parseFloat(signal.priorEPS)) / parseFloat(signal.priorEPS) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="p-4 border border-border/50 rounded-lg bg-card/50">
        <p className="text-sm text-foreground font-medium mb-2">Earnings Trading Tips</p>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Earnings can cause massive price swings - adjust position sizes accordingly</li>
          <li>• IV (Implied Volatility) typically spikes before earnings - consider options strategies</li>
          <li>• Support and resistance levels are critical during earnings moves</li>
          <li>• Set your stops wider to avoid being stopped out by intraday volatility</li>
        </ul>
      </div>
    </div>
  )
}
