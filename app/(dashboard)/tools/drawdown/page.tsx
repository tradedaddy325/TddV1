'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrendingDown, AlertTriangle, Target } from 'lucide-react'
import Link from 'next/link'

export default function DrawdownCalculatorPage() {
  const [peakBalance, setPeakBalance] = useState('10000')
  const [currentBalance, setCurrentBalance] = useState('8500')
  const [targetRecovery, setTargetRecovery] = useState('')
  const [results, setResults] = useState<{
    drawdown: number
    drawdownPercent: number
    recoveryNeeded: number
    winsNeeded: number
  } | null>(null)

  const calculate = () => {
    const peak = parseFloat(peakBalance)
    const current = parseFloat(currentBalance)
    
    if (isNaN(peak) || isNaN(current) || peak <= 0) return

    const drawdown = peak - current
    const drawdownPercent = (drawdown / peak) * 100
    const recoveryNeeded = ((peak - current) / current) * 100
    
    // Calculate wins needed assuming 2% risk per trade with 1:2 RR
    const avgWinPercent = 4 // 2% risk * 2 RR
    const winsNeeded = Math.ceil(recoveryNeeded / avgWinPercent)

    setResults({
      drawdown,
      drawdownPercent,
      recoveryNeeded,
      winsNeeded,
    })
  }

  useEffect(() => {
    calculate()
  }, [peakBalance, currentBalance])

  const getDrawdownSeverity = (percent: number) => {
    if (percent < 10) return { label: 'LOW', color: 'text-green-500' }
    if (percent < 20) return { label: 'MODERATE', color: 'text-yellow-500' }
    if (percent < 30) return { label: 'HIGH', color: 'text-orange-500' }
    return { label: 'CRITICAL', color: 'text-red-500' }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tools">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            &larr; Back to Tools
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-mono font-bold text-primary">Drawdown Calculator</h1>
          <p className="text-sm text-muted-foreground font-mono">Calculate drawdown and recovery requirements</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="font-mono text-primary flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              DRAWDOWN ANALYSIS
            </CardTitle>
            <CardDescription className="font-mono">
              Enter your account balances
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-muted-foreground">PEAK BALANCE ($)</Label>
                <Input
                  type="number"
                  value={peakBalance}
                  onChange={(e) => setPeakBalance(e.target.value)}
                  className="font-mono"
                  placeholder="10000"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-muted-foreground">CURRENT BALANCE ($)</Label>
                <Input
                  type="number"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value)}
                  className="font-mono"
                  placeholder="8500"
                />
              </div>
            </div>

            {results && (
              <div className="space-y-4">
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono text-muted-foreground">DRAWDOWN</span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      getDrawdownSeverity(results.drawdownPercent).color
                    } bg-current/10`}>
                      {getDrawdownSeverity(results.drawdownPercent).label}
                    </span>
                  </div>
                  <p className="text-3xl font-mono font-bold text-destructive">
                    -{results.drawdownPercent.toFixed(2)}%
                  </p>
                  <p className="text-sm text-muted-foreground font-mono mt-1">
                    ${results.drawdown.toLocaleString()} loss from peak
                  </p>
                </div>

                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-mono text-muted-foreground">RECOVERY NEEDED</span>
                  </div>
                  <p className="text-3xl font-mono font-bold text-primary">
                    +{results.recoveryNeeded.toFixed(2)}%
                  </p>
                  <p className="text-sm text-muted-foreground font-mono mt-1">
                    To return to ${parseFloat(peakBalance).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
                  <span className="text-sm font-mono text-muted-foreground">ESTIMATED WINS NEEDED</span>
                  <p className="text-2xl font-mono font-bold text-cyan-500 mt-1">
                    ~{results.winsNeeded} trades
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    Assuming 2% risk, 1:2 RR, 100% win rate
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="font-mono text-primary flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              RECOVERY TABLE
            </CardTitle>
            <CardDescription className="font-mono">
              Recovery required for different drawdown levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[5, 10, 15, 20, 25, 30, 40, 50, 60, 75].map((dd) => {
                const recovery = (dd / (100 - dd)) * 100
                return (
                  <div
                    key={dd}
                    className="flex items-center justify-between p-2 rounded bg-muted/30 font-mono text-sm"
                  >
                    <span className={dd <= 10 ? 'text-green-500' : dd <= 20 ? 'text-yellow-500' : dd <= 30 ? 'text-orange-500' : 'text-red-500'}>
                      -{dd}% drawdown
                    </span>
                    <span className="text-foreground">+{recovery.toFixed(1)}% to recover</span>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-4 text-center">
              The larger the drawdown, the harder the recovery
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
