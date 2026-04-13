'use client'

import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Activity, Zap, Newspaper, TrendingUp, DollarSign } from 'lucide-react'

const signalTabs = [
  { value: 'setups', label: 'Setups', icon: Activity },
  { value: 'ai', label: 'AI Signals', icon: Zap },
  { value: 'news', label: 'News', icon: Newspaper },
  { value: 'gaps', label: 'Gaps', icon: TrendingUp },
  { value: 'earnings', label: 'Earnings', icon: DollarSign },
]

export default function SignalsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tab?: string }
}) {
  const router = useRouter()
  const currentTab = params.tab || 'setups'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-primary">
            {'>'} SIGNALS_CENTER
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Trading signals, market setups, and opportunity alerts
          </p>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={(v) => router.push(`/signals/${v}`)} className="w-full">
        <TabsList className="bg-muted/50 grid w-full grid-cols-5">
          {signalTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger key={tab.value} value={tab.value} className="font-mono">
                <Icon className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      {children}
    </div>
  )
}
