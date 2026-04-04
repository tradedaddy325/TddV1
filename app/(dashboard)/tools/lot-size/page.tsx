'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Scale, Info } from 'lucide-react'
import Link from 'next/link'

const currencyPairs = [
  { value: 'EUR/USD', label: 'EUR/USD', pipDecimal: 4 },
  { value: 'GBP/USD', label: 'GBP/USD', pipDecimal: 4 },
  { value: 'USD/JPY', label: 'USD/JPY', pipDecimal: 2 },
  { value: 'USD/CHF', label: 'USD/CHF', pipDecimal: 4 },
  { value: 'AUD/USD', label: 'AUD/USD', pipDecimal: 4 },
  { value: 'USD/CAD', label: 'USD/CAD', pipDecimal: 4 },
  { value: 'XAU/USD', label: 'XAU/USD (Gold)', pipDecimal: 2 },
  { value: 'USD/ZAR', label: 'USD/ZAR', pipDecimal: 4 },
]

export default function LotSizeCalculatorPage() {
  const [accountBalance, setAccountBalance] = useState('10000')
  const [riskPercent, setRiskPercent] = useState('1')
  const [stopLossPips, setStopLossPips] = useState('50')
  const [pair, setPair] = useState('EUR/USD')

  const result = useMemo(() => {
    const balance = parseFloat(accountBalance) || 0
    const risk = parseFloat(riskPercent) || 0
    const stopLoss = parseFloat(stopLossPips) || 0

    if (balance <= 0 || risk <= 0 || stopLoss <= 0) return null

    const pairConfig = currencyPairs.find((p) => p.value === pair)
    if (!pairConfig) return null

    // Amount willing to risk
    const riskAmount = balance * (risk / 100)

    // Pip value per standard lot (simplified for USD pairs)
    const pipValuePerLot = pair.endsWith('/USD') || pair === 'XAU/USD' ? 10 : 10

    // Calculate lot size
    const lotSize = riskAmount / (stopLoss * pipValuePerLot)

    // Convert to different lot types
    const miniLots = lotSize * 10
    const microLots = lotSize * 100

    return {
      riskAmount: riskAmount.toFixed(2),
      standardLots: lotSize.toFixed(2),
      miniLots: miniLots.toFixed(2),
      microLots: microLots.toFixed(2),
      units: (lotSize * 100000).toLocaleString(),
    }
  }, [accountBalance, riskPercent, stopLossPips, pair])

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/tools">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lot Size Calculator</h1>
          <p className="text-muted-foreground">
            Calculate optimal position size based on risk
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Scale className="w-5 h-5 text-accent" />
              Input Values
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountBalance">Account Balance ($)</Label>
                <Input
                  id="accountBalance"
                  type="number"
                  step="100"
                  min="0"
                  placeholder="10000"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskPercent">Risk Per Trade (%)</Label>
                <Input
                  id="riskPercent"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="1"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stopLossPips">Stop Loss (Pips)</Label>
                <Input
                  id="stopLossPips"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="50"
                  value={stopLossPips}
                  onChange={(e) => setStopLossPips(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pair">Currency Pair</Label>
                <Select value={pair} onValueChange={setPair}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pair" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyPairs.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="bg-card border-accent">
            <CardHeader>
              <CardTitle className="text-lg text-accent">Results</CardTitle>
              <CardDescription>
                Risking ${result.riskAmount} ({riskPercent}%) with {stopLossPips} pip stop loss
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-secondary rounded">
                  <p className="text-xs text-muted-foreground mb-1">Standard Lots</p>
                  <p className="text-2xl font-bold text-primary">{result.standardLots}</p>
                </div>
                <div className="p-4 bg-secondary rounded">
                  <p className="text-xs text-muted-foreground mb-1">Mini Lots</p>
                  <p className="text-2xl font-bold text-accent">{result.miniLots}</p>
                </div>
                <div className="p-4 bg-secondary rounded">
                  <p className="text-xs text-muted-foreground mb-1">Micro Lots</p>
                  <p className="text-lg font-bold text-foreground">{result.microLots}</p>
                </div>
                <div className="p-4 bg-secondary rounded">
                  <p className="text-xs text-muted-foreground mb-1">Units</p>
                  <p className="text-lg font-medium text-foreground">{result.units}</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded">
                <p className="text-sm text-destructive">
                  Risk Amount: ${result.riskAmount} ({riskPercent}% of account)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4" />
              Position Sizing Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-foreground">Conservative:</strong> Risk 0.5-1% per trade</li>
              <li><strong className="text-foreground">Moderate:</strong> Risk 1-2% per trade</li>
              <li><strong className="text-foreground">Aggressive:</strong> Risk 2-3% per trade</li>
              <li>Never risk more than you can afford to lose</li>
              <li>Adjust lot size based on your stop loss distance</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
