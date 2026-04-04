'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Layers, Info } from 'lucide-react'
import Link from 'next/link'

export default function PositionSizeCalculatorPage() {
  const [accountSize, setAccountSize] = useState('10000')
  const [riskPercent, setRiskPercent] = useState('2')
  const [entryPrice, setEntryPrice] = useState('1.0850')
  const [stopLoss, setStopLoss] = useState('1.0800')

  const result = useMemo(() => {
    const account = parseFloat(accountSize) || 0
    const risk = parseFloat(riskPercent) || 0
    const entry = parseFloat(entryPrice) || 0
    const sl = parseFloat(stopLoss) || 0

    if (account <= 0 || risk <= 0 || entry <= 0 || sl <= 0) return null

    const riskAmount = account * (risk / 100)
    const stopDistance = Math.abs(entry - sl)
    
    if (stopDistance === 0) return null

    // Calculate position size in units
    const positionSize = riskAmount / stopDistance
    
    // Convert to lots (1 standard lot = 100,000 units)
    const standardLots = positionSize / 100000
    const miniLots = standardLots * 10
    const microLots = standardLots * 100

    return {
      riskAmount: riskAmount.toFixed(2),
      stopDistancePrice: stopDistance.toFixed(5),
      stopDistancePips: (stopDistance * 10000).toFixed(1),
      positionUnits: positionSize.toFixed(0),
      standardLots: standardLots.toFixed(2),
      miniLots: miniLots.toFixed(2),
      microLots: microLots.toFixed(2),
    }
  }, [accountSize, riskPercent, entryPrice, stopLoss])

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/tools">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Position Size Calculator</h1>
          <p className="text-muted-foreground">
            Calculate position size based on account and risk
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Account & Risk Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountSize">Account Size ($)</Label>
                <Input
                  id="accountSize"
                  type="number"
                  step="100"
                  min="0"
                  placeholder="10000"
                  value={accountSize}
                  onChange={(e) => setAccountSize(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskPercent">Risk Percentage (%)</Label>
                <Input
                  id="riskPercent"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="2"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryPrice">Entry Price</Label>
                <Input
                  id="entryPrice"
                  type="number"
                  step="0.0001"
                  placeholder="1.0850"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stopLoss" className="text-destructive">Stop Loss Price</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.0001"
                  placeholder="1.0800"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="border-destructive/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="bg-card border-primary">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Position Size Results</CardTitle>
              <CardDescription>
                Based on ${accountSize} account with {riskPercent}% risk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-destructive/10 rounded">
                  <p className="text-xs text-muted-foreground mb-1">Risk Amount</p>
                  <p className="text-xl font-bold text-destructive">${result.riskAmount}</p>
                </div>
                <div className="p-4 bg-secondary rounded">
                  <p className="text-xs text-muted-foreground mb-1">Stop Distance</p>
                  <p className="text-xl font-bold text-foreground">{result.stopDistancePips} pips</p>
                </div>
                <div className="p-4 bg-secondary rounded">
                  <p className="text-xs text-muted-foreground mb-1">Position Units</p>
                  <p className="text-xl font-bold text-foreground">{parseInt(result.positionUnits).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-primary/10 rounded text-center">
                  <p className="text-xs text-muted-foreground mb-1">Standard Lots</p>
                  <p className="text-2xl font-bold text-primary">{result.standardLots}</p>
                </div>
                <div className="p-4 bg-accent/10 rounded text-center">
                  <p className="text-xs text-muted-foreground mb-1">Mini Lots</p>
                  <p className="text-2xl font-bold text-accent">{result.miniLots}</p>
                </div>
                <div className="p-4 bg-secondary rounded text-center">
                  <p className="text-xs text-muted-foreground mb-1">Micro Lots</p>
                  <p className="text-2xl font-bold text-foreground">{result.microLots}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4" />
              Position Sizing Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>Never risk more than 2% of your account on a single trade</li>
              <li>Wider stop losses require smaller position sizes</li>
              <li>Round down to the nearest tradeable lot size</li>
              <li>Account for spread when calculating position size</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
