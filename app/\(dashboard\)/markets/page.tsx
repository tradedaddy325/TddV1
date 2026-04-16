import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Predictive Markets | TRADEDADDY',
  description: 'Market predictions and analysis',
}

const marketPredictions = [
  {
    pair: 'EURUSD',
    current: 1.0850,
    prediction: 1.0920,
    confidence: 78,
    trend: 'BULLISH',
    timeframe: '1W',
  },
  {
    pair: 'GBPUSD',
    current: 1.2645,
    prediction: 1.2580,
    confidence: 65,
    trend: 'BEARISH',
    timeframe: '1W',
  },
  {
    pair: 'USDJPY',
    current: 148.50,
    prediction: 150.00,
    confidence: 82,
    trend: 'BULLISH',
    timeframe: '1M',
  },
  {
    pair: 'Gold',
    current: 2045,
    prediction: 2100,
    confidence: 71,
    trend: 'BULLISH',
    timeframe: '1M',
  },
]

export default function PredictiveMarkets() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Predictive Markets</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered market predictions and technical analysis
        </p>
      </div>

      <div className="grid gap-4">
        {marketPredictions.map((market) => {
          const change = ((market.prediction - market.current) / market.current * 100).toFixed(2)
          const isPositive = parseFloat(change) > 0
          
          return (
            <Card key={market.pair} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{market.pair}</CardTitle>
                    <CardDescription>{market.timeframe} Timeframe</CardDescription>
                  </div>
                  <Badge 
                    className={market.trend === 'BULLISH' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                  >
                    {market.trend === 'BULLISH' ? (
                      <TrendingUp className="w-3 h-3 mr-1 inline" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1 inline" />
                    )}
                    {market.trend}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                    <p className="text-sm font-semibold text-foreground">{market.current}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Target Price</p>
                    <p className="text-sm font-semibold text-primary">{market.prediction}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Expected Move</p>
                    <p className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {isPositive ? '+' : ''}{change}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${market.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground">{market.confidence}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="p-4 border border-border/50 rounded-lg bg-card/50">
        <p className="text-sm text-foreground font-medium mb-2">How Predictions Work</p>
        <p className="text-sm text-muted-foreground">
          Our predictive models analyze historical price action, market structure, volume patterns, and macro factors to generate high-probability price targets. Confidence scores reflect the strength of multiple confirmations. Always use stop losses and practice proper risk management.
        </p>
      </div>
    </div>
  )
}
