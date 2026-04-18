'use client'

import { Newspaper } from 'lucide-react'
import { AIPanel } from '@/components/ai-panel'

export default function NewsSignals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-primary" />
          News Signals & Market Intelligence
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-powered news analysis, sentiment tracking, and market-moving events
        </p>
      </div>

      <div className="border border-border/50 rounded-lg bg-card/30 overflow-hidden">
        <AIPanel />
      </div>
    </div>
  )
}
