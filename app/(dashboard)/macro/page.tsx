'use client'

import { Globe } from 'lucide-react'
import { AIPanel } from '@/components/ai-panel'

export default function MacroPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono text-2xl font-bold text-primary">
          {'>'} MACRO_TERMINAL
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          AI-powered macro analysis, economic data, and market intelligence
        </p>
      </div>

      <div className="border border-border/50 rounded-lg bg-card/30 overflow-hidden">
        <AIPanel />
      </div>
    </div>
  )
}
