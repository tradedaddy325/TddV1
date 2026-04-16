import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Newspaper } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Market News | TRADEDADDY',
  description: 'Latest market news and analysis',
}

const newsItems = [
  {
    id: 1,
    title: 'Fed Signals Pause in Rate Hikes',
    source: 'Bloomberg',
    time: '2 hours ago',
    impact: 'Strong dollar weakens on dovish comments',
    category: 'Forex',
  },
  {
    id: 2,
    title: 'Oil Prices Surge on Supply Concerns',
    source: 'Reuters',
    time: '4 hours ago',
    impact: 'Energy stocks climb as crude rallies 2.5%',
    category: 'Commodities',
  },
  {
    id: 3,
    title: 'Stock Market Rally Continues',
    source: 'MarketWatch',
    time: '6 hours ago',
    impact: 'Tech sector leads gains amid earnings optimism',
    category: 'Equities',
  },
  {
    id: 4,
    title: 'Bitcoin Breaks Key Resistance',
    source: 'CoinDesk',
    time: '8 hours ago',
    impact: 'Crypto market sees positive momentum',
    category: 'Crypto',
  },
]

export default function MarketNews() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-primary" />
          Market News
        </h1>
        <p className="text-muted-foreground mt-1">
          Latest trading news and market analysis
        </p>
      </div>

      <div className="space-y-4">
        {newsItems.map((item) => (
          <Card key={item.id} className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg mb-2 hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.impact}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{item.source}</span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                </div>
                <div className="px-3 py-1 rounded bg-primary/10 text-primary text-xs font-semibold whitespace-nowrap">
                  {item.category}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 border border-border/50 rounded-lg bg-card/50">
        <p className="text-sm text-foreground font-medium mb-2">News Trading Strategy</p>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>✓ Monitor news during scheduled economic releases</li>
          <li>✓ Look for deviation from forecast vs actual</li>
          <li>✓ Position sizing should be larger for expected moves</li>
          <li>✓ Set stops before major announcements</li>
        </ul>
      </div>
    </div>
  )
}
