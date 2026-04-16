import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Signals & Setups | TRADEDADDY',
  description: 'Trading signals and setups',
}

const mockSignals = [
  {
    id: 1,
    pair: 'EURUSD',
    type: 'BUY',
    setup: 'Break and Retest',
    confidence: 85,
    entryLevel: 1.0850,
    targetLevel: 1.0920,
    stopLevel: 1.0800,
  },
  {
    id: 2,
    pair: 'GBPUSD',
    type: 'SELL',
    setup: 'Resistance Bounce',
    confidence: 72,
    entryLevel: 1.2650,
    targetLevel: 1.2580,
    stopLevel: 1.2700,
  },
  {
    id: 3,
    pair: 'USDJPY',
    type: 'BUY',
    setup: 'Support Bounce',
    confidence: 78,
    entryLevel: 148.50,
    targetLevel: 150.20,
    stopLevel: 147.80,
  },
]

export default function SignalsSetups() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Signals & Setups
        </h1>
        <p className="text-muted-foreground mt-1">
          Real-time trading signals and technical setups
        </p>
      </div>

      <div className="grid gap-4">
        {mockSignals.map((signal) => (
          <Card key={signal.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{signal.pair}</CardTitle>
                  <CardDescription>{signal.setup}</CardDescription>
                </div>
                <Badge 
                  className={signal.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                >
                  {signal.type === 'BUY' ? (
                    <TrendingUp className="w-3 h-3 mr-1 inline" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1 inline" />
                  )}
                  {signal.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                  <p className="text-sm font-semibold text-foreground">{signal.confidence}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Entry</p>
                  <p className="text-sm font-semibold text-foreground">{signal.entryLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Target</p>
                  <p className="text-sm font-semibold text-green-400">{signal.targetLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Stop</p>
                  <p className="text-sm font-semibold text-red-400">{signal.stopLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Risk/Reward</p>
                  <p className="text-sm font-semibold text-primary">1:3.5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 border border-border/50 rounded-lg bg-card/50 flex gap-3">
        <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Always Manage Risk</p>
          <p>Use stop losses on all positions and never risk more than 1-2% of your account on a single trade.</p>
        </div>
      </div>
    </div>
  )
}
