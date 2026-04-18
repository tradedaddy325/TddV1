import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Market Heatmap | TRADEDADDY',
  description: 'Visual representation of market performance',
}

export default function MarketHeatmap() {
  const heatmapData = [
    { symbol: 'EURUSD', change: 1.25, performance: 'strong' },
    { symbol: 'GBPUSD', change: -0.45, performance: 'weak' },
    { symbol: 'USDJPY', change: 0.85, performance: 'moderate' },
    { symbol: 'AUDUSD', change: 1.60, performance: 'strong' },
    { symbol: 'NZDUSD', change: 0.30, performance: 'neutral' },
    { symbol: 'USDCAD', change: -0.75, performance: 'weak' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Market Heatmap
        </h1>
        <p className="text-muted-foreground mt-1">
          Visual market performance overview
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Currency Pairs Performance</CardTitle>
          <CardDescription>24-hour change by percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heatmapData.map((item) => {
              const bgColor = 
                item.performance === 'strong' ? 'bg-green-500/20 border-green-500/50' :
                item.performance === 'weak' ? 'bg-red-500/20 border-red-500/50' :
                'bg-gray-500/20 border-gray-500/50'
              
              const textColor = 
                item.performance === 'strong' ? 'text-green-400' :
                item.performance === 'weak' ? 'text-red-400' :
                'text-gray-400'

              return (
                <div key={item.symbol} className={`p-4 border rounded-lg ${bgColor}`}>
                  <p className="text-sm font-semibold text-foreground mb-2">{item.symbol}</p>
                  <div className="flex items-end justify-between">
                    <div className="flex-1">
                      <div className="w-full h-6 bg-secondary rounded mb-2">
                        <div 
                          className={`h-full rounded transition-all ${item.performance === 'strong' ? 'bg-green-500' : item.performance === 'weak' ? 'bg-red-500' : 'bg-gray-500'}`}
                          style={{ width: `${Math.min(Math.abs(item.change) * 20, 100)}%` }}
                        />
                      </div>
                    </div>
                    <p className={`text-lg font-bold ml-3 ${textColor}`}>
                      {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}%
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-500/10 border-green-500/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Strong Gainers</p>
            <p className="text-2xl font-bold text-green-400">AUDUSD</p>
            <p className="text-sm text-green-400 mt-2">+1.60%</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-500/10 border-gray-500/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Most Active</p>
            <p className="text-2xl font-bold text-gray-400">EURUSD</p>
            <p className="text-sm text-gray-400 mt-2">High Volume</p>
          </CardContent>
        </Card>

        <Card className="bg-red-500/10 border-red-500/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Biggest Losers</p>
            <p className="text-2xl font-bold text-red-400">USDCAD</p>
            <p className="text-sm text-red-400 mt-2">-0.75%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
