import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import {
  Calculator,
  Percent,
  Scale,
  Target,
  DollarSign,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Clock,
  ArrowDownUp,
  Layers,
  PieChart,
} from 'lucide-react'

export const metadata = {
  title: 'Tools | TRADEDADDY',
  description: 'Trading calculators and tools',
}

const tools = [
  {
    id: 'pip-calculator',
    title: 'Pip Calculator',
    description: 'Calculate pip value for any currency pair',
    icon: Calculator,
    href: '/tools/pip-calculator',
    color: 'text-primary',
  },
  {
    id: 'lot-size',
    title: 'Lot Size Calculator',
    description: 'Determine optimal position size based on risk',
    icon: Scale,
    href: '/tools/lot-size',
    color: 'text-accent',
  },
  {
    id: 'risk-reward',
    title: 'Risk/Reward Calculator',
    description: 'Calculate risk-to-reward ratios for trades',
    icon: Target,
    href: '/tools/risk-reward',
    color: 'text-warning',
  },
  {
    id: 'position-size',
    title: 'Position Size Calculator',
    description: 'Calculate position size based on account and risk',
    icon: Layers,
    href: '/tools/position-size',
    color: 'text-primary',
  },
  {
    id: 'margin-calculator',
    title: 'Margin Calculator',
    description: 'Calculate required margin for positions',
    icon: Percent,
    href: '/tools/margin',
    color: 'text-accent',
  },
  {
    id: 'pnl-calculator',
    title: 'P&L Calculator',
    description: 'Calculate potential profit and loss',
    icon: DollarSign,
    href: '/tools/pnl',
    color: 'text-primary',
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Calculator',
    description: 'Calculate Fibonacci retracement levels',
    icon: BarChart3,
    href: '/tools/fibonacci',
    color: 'text-warning',
  },
  {
    id: 'pivot-points',
    title: 'Pivot Points',
    description: 'Calculate daily pivot points and S/R levels',
    icon: TrendingUp,
    href: '/tools/pivot-points',
    color: 'text-accent',
  },
  {
    id: 'currency-converter',
    title: 'Currency Converter',
    description: 'Convert between major currencies',
    icon: RefreshCw,
    href: '/tools/currency-converter',
    color: 'text-primary',
  },
  {
    id: 'drawdown',
    title: 'Drawdown Calculator',
    description: 'Calculate account drawdown percentage',
    icon: ArrowDownUp,
    href: '/tools/drawdown',
    color: 'text-destructive',
  },
  {
    id: 'compound',
    title: 'Compound Calculator',
    description: 'Calculate compound growth over time',
    icon: PieChart,
    href: '/tools/compound',
    color: 'text-primary',
  },
  {
    id: 'session-times',
    title: 'Session Times',
    description: 'View trading session times worldwide',
    icon: Clock,
    href: '/tools/session-times',
    color: 'text-accent',
  },
]

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Trading Tools</h1>
        <p className="text-muted-foreground">
          Essential calculators and tools for professional trading
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.id} href={tool.href}>
              <Card className="bg-card border-border hover:border-primary/50 transition-colors h-full cursor-pointer group">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className={`w-5 h-5 ${tool.color}`} />
                    </div>
                    <CardTitle className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {tool.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
