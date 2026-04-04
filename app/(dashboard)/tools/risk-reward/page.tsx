'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Target, Info, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function RiskRewardCalculatorPage() {
  const [entryPrice, setEntryPrice] = useState('1.0850')
  const [stopLoss, setStopLoss] = useState('1.0800')
  const [takeProfit, setTakeProfit] = useState('1.1000')
  const [lotSize, setLotSize] = useState('1')
  const [pipValue, setPipValue] = useState('10')

  const result = useMemo(() => {
    const entry = parseFloat(entryPrice) || 0
    const sl = parseFloat(stopLoss) || 0
    const tp = parseFloat(takeProfit) || 0
    const lots = parseFloat(lotSize) || 0
    const pip = parseFloat(pipValue) || 10

    if (entry <= 0 || sl <= 0 || tp <= 0) return null

    // Determine direction (long or short)
    const isLong = tp > entry

    // Calculate pips (assuming 4 decimal places for most pairs)
    const pipMultiplier = entry > 10 ? 100 : 10000 // For JPY pairs vs others
    
    const riskPips = Math.abs(entry - sl) * pipMultiplier
    const rewardPips = Math.abs(tp - entry) * pipMultiplier

    if (riskPips === 0) return null

    // Risk/Reward ratio
    const ratio = rewardPips / riskPips

    // Calculate $ amounts
    const riskAmount = riskPips * pip * lots
    const rewardAmount = rewardPips * pip * lots

    // Break-even win rate (1 / (1 + RR))
    const breakEvenWinRate = (1 / (1 + ratio)) * 100

    return {
      isLong,
      riskPips: riskPips.toFixed(1),
      rewardPips: rewardPips.toFixed(1),
      ratio: ratio.toFixed(2),
      riskAmount: riskAmount.toFixed(2),
      rewardAmount: rewardAmount.toFixed(2),
      breakEvenWinRate: breakEvenWinRate.toFixed(1),
      isGoodRatio: ratio >= 2,
    }
  }, [entryPrice, stopLoss, takeProfit, lotSize, pipValue])

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/tools">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risk/Reward Calculator</h1>
          <p className="text-muted-foreground">
            Calculate risk-to-reward ratios for your trades
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-warning" />
              Trade Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label htmlFor="stopLoss" className="text-destructive">Stop Loss</Label>
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

              <div className="space-y-2">
                <Label htmlFor="takeProfit" className="text-primary">Take Profit</Label>
                <Input
                  id="takeProfit"
                  type="number"
                  step="0.0001"
                  placeholder="1.1000"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="border-primary/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lotSize">Lot Size</Label>
                <Input
                  id="lotSize"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="1"
                  value={lotSize}
                  onChange={(e) => setLotSize(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pipValue">Pip Value ($)</Label>
                <Input
                  id="pipValue"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="10"
                  value={pipValue}
                  onChange={(e) => setPipValue(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className={cn(
            'bg-card',
            result.isGoodRatio ? 'border-primary' : 'border-warning'
          )}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {result.isLong ? (
                  <TrendingUp className="w-5 h-5 text-primary" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-destructive" />
                )}
                {result.isLong ? 'Long' : 'Short'} Trade Analysis
              </CardTitle>
              <CardDescription>
                {result.isGoodRatio 
                  ? 'Good risk/reward ratio (2:1 or better)' 
                  : 'Consider improving your risk/reward ratio'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-secondary rounded text-center">
                  <p className="text-xs text-muted-foreground mb-1">Risk/Reward Ratio</p>
                  <p className={cn(
                    'text-3xl font-bold',
                    result.isGoodRatio ? 'text-primary' : 'text-warning'
                  )}>
                    1:{result.ratio}
                  </p>
                </div>

                <div className="p-4 bg-destructive/10 rounded text-center">
                  <p className="text-xs text-muted-foreground mb-1">Risk (Pips / $)</p>
                  <p className="text-lg font-bold text-destructive">
                    {result.riskPips} / ${result.riskAmount}
                  </p>
                </div>

                <div className="p-4 bg-primary/10 rounded text-center">
                  <p className="text-xs text-muted-foreground mb-1">Reward (Pips / $)</p>
                  <p className="text-lg font-bold text-primary">
                    {result.rewardPips} / ${result.rewardAmount}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-secondary rounded">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Break-Even Win Rate:</strong>{' '}
                  {result.breakEvenWinRate}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  You need to win at least {result.breakEvenWinRate}% of trades with this R:R to break even.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4" />
              Risk/Reward Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-primary">1:2 minimum</strong> - Most traders aim for at least 1:2</li>
              <li><strong className="text-primary">1:3 ideal</strong> - Better protection against losing streaks</li>
              <li>Higher R:R means you can be wrong more often and still profit</li>
              <li>Always consider market conditions when setting targets</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
