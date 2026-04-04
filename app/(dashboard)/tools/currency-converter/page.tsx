'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeftRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
]

// Mock exchange rates (in production, fetch from API)
const mockRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CHF: 0.88,
  AUD: 1.53,
  CAD: 1.36,
  NZD: 1.64,
  ZAR: 18.50,
  CNY: 7.24,
  INR: 83.12,
  MXN: 17.15,
  SGD: 1.34,
  HKD: 7.82,
  SEK: 10.42,
  NOK: 10.68,
}

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState('1000')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('ZAR')
  const [result, setResult] = useState<number | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const calculate = () => {
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum)) return

    const fromRate = mockRates[fromCurrency]
    const toRate = mockRates[toCurrency]
    
    // Convert to USD first, then to target currency
    const inUSD = amountNum / fromRate
    const converted = inUSD * toRate
    
    setResult(converted)
  }

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  useEffect(() => {
    calculate()
  }, [amount, fromCurrency, toCurrency])

  const getExchangeRate = () => {
    const fromRate = mockRates[fromCurrency]
    const toRate = mockRates[toCurrency]
    return toRate / fromRate
  }

  const fromCurrencyData = currencies.find(c => c.code === fromCurrency)
  const toCurrencyData = currencies.find(c => c.code === toCurrency)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tools">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            &larr; Back to Tools
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-mono font-bold text-primary">Currency Converter</h1>
          <p className="text-sm text-muted-foreground font-mono">Convert between major currencies</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="font-mono text-primary flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              CONVERTER
            </CardTitle>
            <CardDescription className="font-mono">
              Real-time currency conversion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-muted-foreground">AMOUNT</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="font-mono text-lg"
                  placeholder="Enter amount"
                />
              </div>

              <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs text-muted-foreground">FROM</Label>
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code} className="font-mono">
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapCurrencies}
                  className="mb-0.5"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>

                <div className="space-y-2">
                  <Label className="font-mono text-xs text-muted-foreground">TO</Label>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code} className="font-mono">
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {result !== null && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">
                <p className="text-sm text-muted-foreground font-mono mb-2">
                  {parseFloat(amount).toLocaleString()} {fromCurrency} =
                </p>
                <p className="text-3xl font-mono font-bold text-primary">
                  {toCurrencyData?.symbol}{result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
                </p>
                <p className="text-xs text-muted-foreground font-mono mt-3">
                  1 {fromCurrency} = {getExchangeRate().toFixed(4)} {toCurrency}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
              <Button variant="ghost" size="sm" onClick={() => setLastUpdate(new Date())}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="font-mono text-primary">QUICK RATES</CardTitle>
            <CardDescription className="font-mono">
              {fromCurrency} exchange rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currencies
                .filter(c => c.code !== fromCurrency)
                .slice(0, 10)
                .map((currency) => {
                  const rate = mockRates[currency.code] / mockRates[fromCurrency]
                  return (
                    <div
                      key={currency.code}
                      className="flex items-center justify-between p-2 rounded bg-muted/30 font-mono text-sm"
                    >
                      <span className="text-muted-foreground">{currency.code}</span>
                      <span className="text-foreground">{rate.toFixed(4)}</span>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
