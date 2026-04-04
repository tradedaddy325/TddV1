'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calculator, Info } from 'lucide-react'
import Link from 'next/link'

const currencyPairs = [
  { value: 'EUR/USD', label: 'EUR/USD', pipDecimal: 4 },
  { value: 'GBP/USD', label: 'GBP/USD', pipDecimal: 4 },
  { value: 'USD/JPY', label: 'USD/JPY', pipDecimal: 2 },
  { value: 'USD/CHF', label: 'USD/CHF', pipDecimal: 4 },
  { value: 'AUD/USD', label: 'AUD/USD', pipDecimal: 4 },
  { value: 'USD/CAD', label: 'USD/CAD', pipDecimal: 4 },
  { value: 'NZD/USD', label: 'NZD/USD', pipDecimal: 4 },
  { value: 'EUR/GBP', label: 'EUR/GBP', pipDecimal: 4 },
  { value: 'EUR/JPY', label: 'EUR/JPY', pipDecimal: 2 },
  { value: 'GBP/JPY', label: 'GBP/JPY', pipDecimal: 2 },
  { value: 'XAU/USD', label: 'XAU/USD (Gold)', pipDecimal: 2 },
  { value: 'USD/ZAR', label: 'USD/ZAR', pipDecimal: 4 },
]

const accountCurrencies = ['USD', 'EUR', 'GBP', 'ZAR']

export default function PipCalculatorPage() {
  const [pair, setPair] = useState('EUR/USD')
  const [lotSize, setLotSize] = useState('1')
  const [accountCurrency, setAccountCurrency] = useState('USD')
  const [exchangeRate, setExchangeRate] = useState('1')

  const result = useMemo(() => {
    const pairConfig = currencyPairs.find((p) => p.value === pair)
    if (!pairConfig) return null

    const lots = parseFloat(lotSize) || 0
    const rate = parseFloat(exchangeRate) || 1

    // Standard lot = 100,000 units
    const units = lots * 100000

    // Pip value calculation
    let pipValue: number
    const pipSize = pairConfig.pipDecimal === 2 ? 0.01 : 0.0001

    if (pair.endsWith('/USD') || pair === 'XAU/USD') {
      // For pairs where USD is quote currency
      pipValue = pipSize * units
    } else if (pair.startsWith('USD/')) {
      // For pairs where USD is base currency
      pipValue = (pipSize * units) / rate
    } else {
      // Cross pairs - simplified calculation
      pipValue = pipSize * units * rate
    }

    // Convert to account currency
    let pipValueInAccountCurrency = pipValue
    if (accountCurrency !== 'USD') {
      pipValueInAccountCurrency = pipValue / rate
    }

    return {
      pipValue: pipValue.toFixed(2),
      pipValueAccount: pipValueInAccountCurrency.toFixed(2),
      pipSize: pipSize,
      units: units.toLocaleString(),
    }
  }, [pair, lotSize, accountCurrency, exchangeRate])

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/tools">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pip Calculator</h1>
          <p className="text-muted-foreground">
            Calculate pip value for any currency pair
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Input Values
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="lotSize">Lot Size</Label>
                <Input
                  id="lotSize"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="1.00"
                  value={lotSize}
                  onChange={(e) => setLotSize(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountCurrency">Account Currency</Label>
                <Select value={accountCurrency} onValueChange={setAccountCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountCurrencies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exchangeRate">
                  Exchange Rate {accountCurrency !== 'USD' && `(USD/${accountCurrency})`}
                </Label>
                <Input
                  id="exchangeRate"
                  type="number"
                  step="0.0001"
                  min="0"
                  placeholder="1.0000"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  disabled={accountCurrency === 'USD'}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="bg-card border-primary">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Results</CardTitle>
              <CardDescription>
                Pip value for {pair} at {lotSize} lot(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary rounded">
                  <p className="text-xs text-muted-foreground mb-1">Pip Value (USD)</p>
                  <p className="text-2xl font-bold text-primary">${result.pipValue}</p>
                </div>
                <div className="p-4 bg-secondary rounded">
                  <p className="text-xs text-muted-foreground mb-1">Pip Value ({accountCurrency})</p>
                  <p className="text-2xl font-bold text-accent">
                    {accountCurrency === 'ZAR' ? 'R' : accountCurrency === 'GBP' ? '£' : accountCurrency === 'EUR' ? '€' : '$'}
                    {result.pipValueAccount}
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded">
                  <p className="text-xs text-muted-foreground mb-1">Pip Size</p>
                  <p className="text-lg font-medium text-foreground">{result.pipSize}</p>
                </div>
                <div className="p-4 bg-secondary rounded">
                  <p className="text-xs text-muted-foreground mb-1">Position Units</p>
                  <p className="text-lg font-medium text-foreground">{result.units}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4" />
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              The pip calculator helps you determine the monetary value of a single pip movement
              for your chosen currency pair and position size.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>1 standard lot = 100,000 units of base currency</li>
              <li>1 mini lot = 0.1 lots = 10,000 units</li>
              <li>1 micro lot = 0.01 lots = 1,000 units</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
