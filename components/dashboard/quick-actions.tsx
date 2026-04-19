import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Calculator,
  BookOpen,
  MessageSquare,
  CreditCard,
  TrendingUp,
} from 'lucide-react'

const actions = [
  {
    title: 'New Trade',
    description: 'Log a trade in your journal',
    href: '/journal',
    icon: Plus,
    variant: 'default' as const,
  },
  {
    title: 'Risk Calculator',
    description: 'Pip, lot size, risk tools',
    href: '/tools/risk-calculator',
    icon: Calculator,
    variant: 'secondary' as const,
  },
  {
    title: 'Learn',
    description: 'Trading academy lessons',
    href: '/academy',
    icon: BookOpen,
    variant: 'secondary' as const,
  },
  {
    title: 'Chat',
    description: 'Get AI trade insights',
    href: '/chat',
    icon: MessageSquare,
    variant: 'secondary' as const,
  },
  {
    title: 'Buy Credits',
    description: 'Top up your account',
    href: '/credits',
    icon: CreditCard,
    variant: 'secondary' as const,
  },
  {
    title: 'Macro Desk',
    description: 'Economic calendar & news',
    href: '/macro',
    icon: TrendingUp,
    variant: 'secondary' as const,
  },
]

export function QuickActions() {
  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.href} href={action.href} className="block">
              <Button
                variant={action.variant}
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
