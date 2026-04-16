import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Economic Calendar | TRADEDADDY',
  description: 'Track economic events that impact the markets',
}

const economicEvents = [
  {
    date: 'Apr 15, 2024',
    time: '13:30 GMT',
    country: 'US',
    event: 'CPI (Core)',
    impact: 'HIGH',
    forecast: '3.8%',
    previous: '3.8%',
    actual: '-',
  },
  {
    date: 'Apr 16, 2024',
    time: '09:00 GMT',
    country: 'UK',
    event: 'Retail Sales',
    impact: 'MEDIUM',
    forecast: '1.2%',
    previous: '-0.5%',
    actual: '-',
  },
  {
    date: 'Apr 18, 2024',
    time: '13:00 GMT',
    country: 'US',
    event: 'Initial Jobless Claims',
    impact: 'HIGH',
    forecast: '218K',
    previous: '200K',
    actual: '-',
  },
]

export default function EconomicCalendar() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          Economic Calendar
        </h1>
        <p className="text-muted-foreground mt-1">
          Key economic events affecting currency and stock markets
        </p>
      </div>

      <div className="space-y-4">
        {economicEvents.map((event, idx) => (
          <Card key={idx} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{event.event}</CardTitle>
                  <CardDescription>{event.date} at {event.time}</CardDescription>
                </div>
                <Badge 
                  className={event.impact === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}
                >
                  {event.impact}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Country</p>
                  <Badge variant="outline">{event.country}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Forecast</p>
                  <p className="text-sm font-semibold text-foreground">{event.forecast}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Previous</p>
                  <p className="text-sm font-semibold text-gray-400">{event.previous}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Actual</p>
                  <p className="text-sm font-semibold text-primary">{event.actual}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 border border-border/50 rounded-lg bg-card/50">
        <p className="text-sm text-foreground font-medium mb-2">Impact Levels</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div>🔴 <strong>HIGH:</strong> Major market moves, wide spreads, increased volatility</div>
          <div>🟡 <strong>MEDIUM:</strong> Moderate impact, noticeable but not explosive</div>
          <div>🟢 <strong>LOW:</strong> Minor impact, typically trader interest oriented</div>
        </div>
      </div>
    </div>
  )
}
