'use client'

import { DollarSign } from 'lucide-react'
import { AIPanel } from '@/components/ai-panel'

export default function EarningsSignals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-primary" />
          AI Earnings Signals
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-powered earnings analysis, sentiment tracking, and trading opportunities
        </p>
      </div>

      <div className="border border-border/50 rounded-lg bg-card/30 overflow-hidden">
        <AIPanel />
      </div>
    </div>
  )
}
