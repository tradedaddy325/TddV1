'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, BarChart3, Info, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const retracementLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
const extensionLevels = [0, 0.618, 1, 1.272, 1.618, 2, 2.618]

export default function FibonacciCalculatorPage() {
  const [highPrice, setHighPrice] = useState('1.1000')
  const [lowPrice, setLowPrice] = useState('1.0500')
  const [trend, setTrend] = useState<'uptrend' | 'downtrend'>('uptrend')

  const retracements = useMemo(() => {
    const high = parseFloat(highPrice) || 0
    const low = parseFloat(lowPrice) || 0
    
    if (high <= 0 || low <= 0 || high === low) return null

    const diff = high - low

    if (trend === 'uptrend') {
      // In uptrend, retracements are measured from high going down
      return retracementLevels.map((level) => ({
        level: (level * 100).toFixed(1),
        price: (high - diff * level).toFixed(5),
      }))
    } else {
      // In downtrend, retracements are measured from low going up
      return retracementLevels.map((level) => ({
        level: (level * 100).toFixed(1),
        price: (low + diff * level).toFixed(5),
      }))
    }
  }, [highPrice, lowPrice, trend])

  const extensions = useMemo(() => {
    const high = parseFloat(highPrice) || 0
    const low = parseFloat(lowPrice) || 0
    
    if (high <= 0 || low <= 0 || high === low) return null

    const diff = high - low

    if (trend === 'uptrend') {
      // Extension levels above the high in uptrend
      return extensionLevels.map((level) => ({
        level: (level * 100).toFixed(1),
        price: (high + diff * (level - 1)).toFixed(5),
      }))
    } else {
      // Extension levels below the low in downtrend
      return extensionLevels.map((level) => ({
        level: (level * 100).toFixed(1),
        price: (low - diff * (level - 1)).toFixed(5),
      }))
    }
  }, [highPrice, lowPrice, trend])

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/tools">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fibonacci Calculator</h1>
          <p className="text-muted-foreground">
            Calculate Fibonacci retracement and extension levels
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-warning" />
              Price Range
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={trend === 'uptrend' ? 'default' : 'outline'}
                onClick={() => setTrend('uptrend')}
                className="flex-1"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Uptrend
              </Button>
              <Button
                variant={trend === 'downtrend' ? 'default' : 'outline'}
                onClick={() => setTrend('downtrend')}
                className="flex-1"
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Downtrend
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="highPrice" className="text-primary">High Price</Label>
                <Input
                  id="highPrice"
                  type="number"
                  step="0.0001"
                  placeholder="1.1000"
                  value={highPrice}
                  onChange={(e) => setHighPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lowPrice" className="text-destructive">Low Price</Label>
                <Input
                  id="lowPrice"
                  type="number"
                  step="0.0001"
                  placeholder="1.0500"
                  value={lowPrice}
                  onChange={(e) => setLowPrice(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="retracement" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="retracement">Retracements</TabsTrigger>
            <TabsTrigger value="extension">Extensions</TabsTrigger>
          </TabsList>

          <TabsContent value="retracement">
            {retracements && (
              <Card className="bg-card border-border mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Retracement Levels</CardTitle>
                  <CardDescription>
                    {trend === 'uptrend' ? 'Pullback levels in uptrend' : 'Rally levels in downtrend'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {retracements.map((level, index) => (
                      <div
                        key={level.level}
                        className={cn(
                          'flex items-center justify-between p-3 rounded border',
                          index === 0 && 'bg-primary/10 border-primary',
                          level.level === '38.2' && 'bg-warning/10 border-warning',
                          level.level === '50.0' && 'bg-accent/10 border-accent',
                          level.level === '61.8' && 'bg-warning/10 border-warning',
                          level.level === '100.0' && 'bg-destructive/10 border-destructive',
                          ![0, 38.2, 50, 61.8, 100].includes(parseFloat(level.level)) && 'bg-secondary border-border'
                        )}
                      >
                        <span className="text-sm font-medium">{level.level}%</span>
                        <span className="text-sm font-mono text-foreground">{level.price}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="extension">
            {extensions && (
              <Card className="bg-card border-border mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Extension Levels</CardTitle>
                  <CardDescription>
                    {trend === 'uptrend' ? 'Target levels above swing high' : 'Target levels below swing low'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {extensions.map((level, index) => (
                      <div
                        key={level.level}
                        className={cn(
                          'flex items-center justify-between p-3 rounded border',
                          level.level === '100.0' && 'bg-primary/10 border-primary',
                          level.level === '127.2' && 'bg-warning/10 border-warning',
                          level.level === '161.8' && 'bg-accent/10 border-accent',
                          ![100, 127.2, 161.8].includes(parseFloat(level.level)) && 'bg-secondary border-border'
                        )}
                      >
                        <span className="text-sm font-medium">{level.level}%</span>
                        <span className="text-sm font-mono text-foreground">{level.price}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4" />
              Key Fibonacci Levels
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-warning">38.2%</strong> - Shallow retracement, strong trend</li>
              <li><strong className="text-accent">50%</strong> - Psychological level (not a true Fib)</li>
              <li><strong className="text-warning">61.8%</strong> - Golden ratio, key reversal level</li>
              <li><strong className="text-primary">161.8%</strong> - Common extension target</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
