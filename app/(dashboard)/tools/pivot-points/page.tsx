'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ArrowLeft, TrendingUp, Info } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function PivotPointsPage() {
  const [high, setHigh] = useState('1.1000')
  const [low, setLow] = useState('1.0800')
  const [close, setClose] = useState('1.0900')

  const pivots = useMemo(() => {
    const h = parseFloat(high) || 0
    const l = parseFloat(low) || 0
    const c = parseFloat(close) || 0

    if (h <= 0 || l <= 0 || c <= 0) return null

    // Standard Pivot Point
    const pp = (h + l + c) / 3

    // Support levels
    const s1 = 2 * pp - h
    const s2 = pp - (h - l)
    const s3 = l - 2 * (h - pp)

    // Resistance levels
    const r1 = 2 * pp - l
    const r2 = pp + (h - l)
    const r3 = h + 2 * (pp - l)

    return {
      pp: pp.toFixed(5),
      r1: r1.toFixed(5),
      r2: r2.toFixed(5),
      r3: r3.toFixed(5),
      s1: s1.toFixed(5),
      s2: s2.toFixed(5),
      s3: s3.toFixed(5),
    }
  }, [high, low, close])

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/tools">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pivot Points</h1>
          <p className="text-muted-foreground">
            Calculate daily pivot points and S/R levels
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Previous Day Prices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="high" className="text-primary">High</Label>
                <Input
                  id="high"
                  type="number"
                  step="0.0001"
                  placeholder="1.1000"
                  value={high}
                  onChange={(e) => setHigh(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="low" className="text-destructive">Low</Label>
                <Input
                  id="low"
                  type="number"
                  step="0.0001"
                  placeholder="1.0800"
                  value={low}
                  onChange={(e) => setLow(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="close">Close</Label>
                <Input
                  id="close"
                  type="number"
                  step="0.0001"
                  placeholder="1.0900"
                  value={close}
                  onChange={(e) => setClose(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {pivots && (
          <Card className="bg-card border-accent">
            <CardHeader>
              <CardTitle className="text-lg text-accent">Pivot Levels</CardTitle>
              <CardDescription>Standard Floor Pivot Points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Resistance levels */}
                <div className="flex justify-between p-3 bg-primary/10 rounded border border-primary/20">
                  <span className="text-sm font-medium text-primary">R3</span>
                  <span className="font-mono text-foreground">{pivots.r3}</span>
                </div>
                <div className="flex justify-between p-3 bg-primary/10 rounded border border-primary/20">
                  <span className="text-sm font-medium text-primary">R2</span>
                  <span className="font-mono text-foreground">{pivots.r2}</span>
                </div>
                <div className="flex justify-between p-3 bg-primary/10 rounded border border-primary/20">
                  <span className="text-sm font-medium text-primary">R1</span>
                  <span className="font-mono text-foreground">{pivots.r1}</span>
                </div>
                
                {/* Pivot Point */}
                <div className="flex justify-between p-3 bg-accent/20 rounded border border-accent">
                  <span className="text-sm font-bold text-accent">PP</span>
                  <span className="font-mono font-bold text-foreground">{pivots.pp}</span>
                </div>
                
                {/* Support levels */}
                <div className="flex justify-between p-3 bg-destructive/10 rounded border border-destructive/20">
                  <span className="text-sm font-medium text-destructive">S1</span>
                  <span className="font-mono text-foreground">{pivots.s1}</span>
                </div>
                <div className="flex justify-between p-3 bg-destructive/10 rounded border border-destructive/20">
                  <span className="text-sm font-medium text-destructive">S2</span>
                  <span className="font-mono text-foreground">{pivots.s2}</span>
                </div>
                <div className="flex justify-between p-3 bg-destructive/10 rounded border border-destructive/20">
                  <span className="text-sm font-medium text-destructive">S3</span>
                  <span className="font-mono text-foreground">{pivots.s3}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4" />
              Using Pivot Points
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>Price above PP suggests bullish bias</li>
              <li>Price below PP suggests bearish bias</li>
              <li>S/R levels act as potential reversal zones</li>
              <li>Use with other indicators for confirmation</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
