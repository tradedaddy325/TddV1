'use client'

import { Metadata } from 'next'
import { Brain } from 'lucide-react'
import { AIPanel } from '@/components/ai-panel'

// export const metadata: Metadata = {
//   title: 'AI Signals | TRADEDADDY',
//   description: 'AI-powered trading signals and predictions',
// }

export default function AISignals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          AI Trading Panel
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-powered trading signals, market analysis, macro briefings, and research insights
        </p>
      </div>

      <div className="border border-border/50 rounded-lg bg-card/30 overflow-hidden">
        <AIPanel />
      </div>
    </div>
  )
}
