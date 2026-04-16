import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, TrendingUp, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Signals | TRADEDADDY',
  description: 'AI-powered trading signals and predictions',
}

const aiSignals = [
  {
    id: 1,
    pair: 'EURUSD',
    prediction: 'BULLISH',
    confidence: 89,
    timeframe: '1H',
    reason: 'Price above key moving averages with strong momentum',
  },
  {
    id: 2,
    pair: 'GBPUSD',
    prediction: 'NEUTRAL',
    confidence: 62,
    timeframe: '4H',
    reason: 'Consolidating between key support and resistance levels',
  },
  {
    id: 3,
    pair: 'USDJPY',
    prediction: 'BULLISH',
    confidence: 76,
    timeframe: '1D',
    reason: 'Strong uptrend continuation with bullish divergence',
  },
]

export default function AISignals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          AI Signals
        </h1>
        <p className="text-muted-foreground mt-1">
          Machine learning powered trading predictions and analysis
        </p>
      </div>

      <div className="grid gap-4">
        {aiSignals.map((signal) => (
          <Card key={signal.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {signal.pair}
                    <Badge variant="outline" className="text-xs">
                      {signal.timeframe}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3" />
                    {signal.reason}
                  </CardDescription>
                </div>
                <Badge 
                  className={signal.prediction === 'BULLISH' ? 'bg-green-500/20 text-green-400' : signal.prediction === 'BEARISH' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}
                >
                  {signal.prediction}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-2">AI Confidence Score</p>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${signal.confidence}%` }}
                    />
                  </div>
                  <p className="text-sm font-semibold text-foreground mt-1">{signal.confidence}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 border border-border/50 rounded-lg bg-primary/5">
        <p className="text-sm text-foreground font-medium mb-2">About AI Signals</p>
        <p className="text-sm text-muted-foreground">
          Our AI model analyzes multiple timeframes, technical indicators, market structure, and historical patterns to provide high-confidence predictions. Always combine AI signals with your own analysis and risk management.
        </p>
      </div>
    </div>
  )
}
