import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Copy Trade Daddy Strategy | TRADEDADDY',
  description: 'Copy Trade Daddy\'s proven trading strategy',
}

export default function CopyStrategy() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Copy className="w-6 h-6 text-primary" />
          Copy Trade Daddy Strategy
        </h1>
        <p className="text-muted-foreground mt-1">
          Learn and copy the proven strategy used by Trade Daddy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Win Rate</p>
            <p className="text-3xl font-bold text-green-400">72%</p>
            <p className="text-xs text-muted-foreground mt-2">Average across all pairs</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Avg RRR</p>
            <p className="text-3xl font-bold text-primary">1:3.2</p>
            <p className="text-xs text-muted-foreground mt-2">Risk to reward ratio</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Trades/Month</p>
            <p className="text-3xl font-bold text-primary">15-20</p>
            <p className="text-xs text-muted-foreground mt-2">High quality setups</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Strategy Overview</CardTitle>
          <CardDescription>Core principles and entry rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Market Structure Analysis</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Identify support and resistance zones</li>
              <li>Look for price structure breaks</li>
              <li>Confirm with volume analysis</li>
              <li>Wait for retest of broken level</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Entry Signals</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Price closes above/below broken level</li>
              <li>Moving average confirmation (200 EMA)</li>
              <li>Momentum indicators show agreement</li>
              <li>Wait for retest and bounce</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Risk Management</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Risk 1-2% per trade</li>
              <li>Stop loss at recent swing low/high</li>
              <li>Target 3x risk minimum</li>
              <li>Move stops to breakeven at 50% target</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/10 border-primary/50">
        <CardHeader>
          <CardTitle className="text-primary">Get Setup Instructions</CardTitle>
          <CardDescription>Learn the exact strategy with step-by-step guide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground">
            Download the complete strategy guide with chart examples, specific entry/exit rules, and Trade Daddy's analysis of real trades.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Guide
            </Button>
            <Button variant="outline">View Examples</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
