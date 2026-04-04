'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TrendingUp, Calculator, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function CompoundCalculatorPage() {
  const [initialBalance, setInitialBalance] = useState('1000')
  const [monthlyReturn, setMonthlyReturn] = useState('5')
  const [months, setMonths] = useState('12')
  const [additionalDeposit, setAdditionalDeposit] = useState('0')
  const [results, setResults] = useState<{
    finalBalance: number
    totalGain: number
    totalGainPercent: number
    monthlyData: Array<{ month: number; balance: number; gain: number }>
  } | null>(null)

  const calculate = () => {
    const initial = parseFloat(initialBalance)
    const returnRate = parseFloat(monthlyReturn) / 100
    const numMonths = parseInt(months)
    const deposit = parseFloat(additionalDeposit) || 0

    if (isNaN(initial) || isNaN(returnRate) || isNaN(numMonths)) return

    const monthlyData: Array<{ month: number; balance: number; gain: number }> = []
    let balance = initial

    for (let i = 1; i <= numMonths; i++) {
      const gain = balance * returnRate
      balance = balance + gain + deposit
      monthlyData.push({
        month: i,
        balance,
        gain,
      })
    }

    const totalDeposits = initial + (deposit * numMonths)
    const totalGain = balance - totalDeposits
    const totalGainPercent = (totalGain / initial) * 100

    setResults({
      finalBalance: balance,
      totalGain,
      totalGainPercent,
      monthlyData,
    })
  }

  useEffect(() => {
    calculate()
  }, [initialBalance, monthlyReturn, months, additionalDeposit])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tools">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            &larr; Back to Tools
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-mono font-bold text-primary">Compound Calculator</h1>
          <p className="text-sm text-muted-foreground font-mono">Project your account growth with compounding</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="font-mono text-primary flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              COMPOUND GROWTH
            </CardTitle>
            <CardDescription className="font-mono">
              See the power of compounding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-muted-foreground">STARTING BALANCE ($)</Label>
                <Input
                  type="number"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  className="font-mono"
                  placeholder="1000"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-muted-foreground">MONTHLY RETURN (%)</Label>
                <Input
                  type="number"
                  value={monthlyReturn}
                  onChange={(e) => setMonthlyReturn(e.target.value)}
                  className="font-mono"
                  placeholder="5"
                  step="0.5"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-muted-foreground">TIME PERIOD (MONTHS)</Label>
                <Select value={months} onValueChange={setMonths}>
                  <SelectTrigger className="font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                    <SelectItem value="60">60 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-muted-foreground">MONTHLY DEPOSIT ($)</Label>
                <Input
                  type="number"
                  value={additionalDeposit}
                  onChange={(e) => setAdditionalDeposit(e.target.value)}
                  className="font-mono"
                  placeholder="0"
                />
              </div>
            </div>

            {results && (
              <div className="space-y-4">
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm font-mono text-muted-foreground">FINAL BALANCE</span>
                  </div>
                  <p className="text-3xl font-mono font-bold text-primary">
                    ${results.finalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                    <span className="text-xs font-mono text-muted-foreground">TOTAL PROFIT</span>
                    <p className="text-xl font-mono font-bold text-green-500 mt-1">
                      +${results.totalGain.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
                    <span className="text-xs font-mono text-muted-foreground">TOTAL RETURN</span>
                    <p className="text-xl font-mono font-bold text-cyan-500 mt-1">
                      +{results.totalGainPercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="font-mono text-primary flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              GROWTH PROJECTION
            </CardTitle>
            <CardDescription className="font-mono">
              Month-by-month breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results && (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                <div className="flex items-center justify-between p-2 rounded bg-muted/50 font-mono text-xs text-muted-foreground sticky top-0">
                  <span>MONTH</span>
                  <span>BALANCE</span>
                  <span>GAIN</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/30 font-mono text-sm">
                  <span className="text-muted-foreground">Start</span>
                  <span className="text-foreground">${parseFloat(initialBalance).toLocaleString()}</span>
                  <span className="text-muted-foreground">-</span>
                </div>
                {results.monthlyData.map((data) => (
                  <div
                    key={data.month}
                    className="flex items-center justify-between p-2 rounded bg-muted/30 font-mono text-sm"
                  >
                    <span className="text-muted-foreground">Month {data.month}</span>
                    <span className="text-foreground">${data.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    <span className="text-green-500">+${data.gain.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
