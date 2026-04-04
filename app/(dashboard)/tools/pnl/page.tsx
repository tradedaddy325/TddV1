'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function PnLCalculatorPage() {
  const [direction, setDirection] = useState<'long' | 'short'>('long')
  const [entryPrice, setEntryPrice] = useState('1.0850')
  const [exitPrice, setExitPrice] = useState('1.0950')
  const [lotSize, setLotSize] = useState('1')
  const [pipValue, setPipValue] = useState('10')

  const result = useMemo(() => {
    const entry = parseFloat(entryPrice) || 0
    const exit = parseFloat(exitPrice) || 0
    const lots = parseFloat(lotSize) || 0
    const pip = parseFloat(pipValue) || 10

    if (entry <= 0 || exit <= 0 || lots <= 0) return null

    // Calculate price difference
    const priceDiff = exit - entry

    // Calculate pips (assuming 4 decimal places)
    const pipMultiplier = entry > 10 ? 100 : 10000
    const pips = priceDiff * pipMultiplier

    // Adjust for direction
    const adjustedPips = direction === 'long' ? pips : -pips

    // Calculate P&L
    const pnl = adjustedPips * pip * lots
    const pnlPercent = ((exit - entry) / entry) * 100
    const adjustedPnlPercent = direction === 'long' ? pnlPercent : -pnlPercent

    return {
      pips: adjustedPips.toFixed(1),
      pnl: pnl.toFixed(2),
      pnlPercent: adjustedPnlPercent.toFixed(2),
      isProfit: pnl > 0,
    }
  }, [direction, entryPrice, exitPrice, lotSize, pipValue])

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/tools">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">P&L Calculator</h1>
          <p className="text-muted-foreground">
            Calculate potential profit and loss
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Trade Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={direction === 'long' ? 'default' : 'outline'}
                onClick={() => setDirection('long')}
                className="flex-1"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Long (Buy)
              </Button>
              <Button
                variant={direction === 'short' ? 'default' : 'outline'}
                onClick={() => setDirection('short')}
                className="flex-1"
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Short (Sell)
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="exitPrice">Exit Price</Label>
                <Input
                  id="exitPrice"
                  type="number"
                  step="0.0001"
                  placeholder="1.0950"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                />
              </div>

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
            result.isProfit ? 'border-primary' : 'border-destructive'
          )}>
            <CardHeader>
              <CardTitle className={cn(
                'text-lg flex items-center gap-2',
                result.isProfit ? 'text-primary' : 'text-destructive'
              )}>
                {result.isProfit ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                {result.isProfit ? 'Profit' : 'Loss'}
              </CardTitle>
              <CardDescription>
                {direction === 'long' ? 'Long' : 'Short'} position at {lotSize} lot(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className={cn(
                  'p-4 rounded text-center',
                  result.isProfit ? 'bg-primary/10' : 'bg-destructive/10'
                )}>
                  <p className="text-xs text-muted-foreground mb-1">P&L ($)</p>
                  <p className={cn(
                    'text-2xl font-bold',
                    result.isProfit ? 'text-primary' : 'text-destructive'
                  )}>
                    {result.isProfit ? '+' : ''}${result.pnl}
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded text-center">
                  <p className="text-xs text-muted-foreground mb-1">Pips</p>
                  <p className={cn(
                    'text-2xl font-bold',
                    parseFloat(result.pips) >= 0 ? 'text-primary' : 'text-destructive'
                  )}>
                    {parseFloat(result.pips) >= 0 ? '+' : ''}{result.pips}
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded text-center">
                  <p className="text-xs text-muted-foreground mb-1">Percentage</p>
                  <p className={cn(
                    'text-2xl font-bold',
                    parseFloat(result.pnlPercent) >= 0 ? 'text-primary' : 'text-destructive'
                  )}>
                    {parseFloat(result.pnlPercent) >= 0 ? '+' : ''}{result.pnlPercent}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
