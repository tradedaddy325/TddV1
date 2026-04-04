'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Percent, Info } from 'lucide-react'
import Link from 'next/link'

const leverageOptions = ['1:10', '1:20', '1:30', '1:50', '1:100', '1:200', '1:500']

export default function MarginCalculatorPage() {
  const [positionSize, setPositionSize] = useState('100000')
  const [leverage, setLeverage] = useState('1:100')
  const [currentPrice, setCurrentPrice] = useState('1.0850')
  const [accountCurrency, setAccountCurrency] = useState('USD')

  const result = useMemo(() => {
    const size = parseFloat(positionSize) || 0
    const price = parseFloat(currentPrice) || 0
    const leverageRatio = parseInt(leverage.split(':')[1]) || 1

    if (size <= 0 || price <= 0) return null

    // Position value in quote currency
    const positionValue = size * price

    // Required margin
    const requiredMargin = positionValue / leverageRatio

    // Margin percentage
    const marginPercentage = (1 / leverageRatio) * 100

    return {
      positionValue: positionValue.toFixed(2),
      requiredMargin: requiredMargin.toFixed(2),
      marginPercentage: marginPercentage.toFixed(2),
      leverageRatio: leverageRatio,
    }
  }, [positionSize, leverage, currentPrice])

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/tools">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Margin Calculator</h1>
          <p className="text-muted-foreground">
            Calculate required margin for your positions
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Percent className="w-5 h-5 text-accent" />
              Position Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="positionSize">Position Size (Units)</Label>
                <Input
                  id="positionSize"
                  type="number"
                  step="1000"
                  min="0"
                  placeholder="100000"
                  value={positionSize}
                  onChange={(e) => setPositionSize(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leverage">Leverage</Label>
                <Select value={leverage} onValueChange={setLeverage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leverage" />
                  </SelectTrigger>
                  <SelectContent>
                    {leverageOptions.map((lev) => (
                      <SelectItem key={lev} value={lev}>
                        {lev}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPrice">Current Price</Label>
                <Input
                  id="currentPrice"
                  type="number"
                  step="0.0001"
                  placeholder="1.0850"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountCurrency">Account Currency</Label>
                <Select value={accountCurrency} onValueChange={setAccountCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="ZAR">ZAR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="bg-card border-accent">
            <CardHeader>
              <CardTitle className="text-lg text-accent">Margin Requirements</CardTitle>
              <CardDescription>
                For {parseInt(positionSize).toLocaleString()} units at {leverage}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary rounded">
                  <p className="text-xs text-muted-foreground mb-1">Position Value</p>
                  <p className="text-2xl font-bold text-foreground">${parseInt(result.positionValue).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-primary/10 rounded">
                  <p className="text-xs text-muted-foreground mb-1">Required Margin</p>
                  <p className="text-2xl font-bold text-primary">${parseInt(result.requiredMargin).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-secondary rounded">
                  <p className="text-xs text-muted-foreground mb-1">Margin Percentage</p>
                  <p className="text-lg font-bold text-foreground">{result.marginPercentage}%</p>
                </div>
                <div className="p-4 bg-secondary rounded">
                  <p className="text-xs text-muted-foreground mb-1">Leverage Ratio</p>
                  <p className="text-lg font-bold text-foreground">{result.leverageRatio}:1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4" />
              Margin Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>Higher leverage = lower margin required but higher risk</li>
              <li>Keep free margin above 100% to avoid margin calls</li>
              <li>Consider broker margin requirements for specific instruments</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
