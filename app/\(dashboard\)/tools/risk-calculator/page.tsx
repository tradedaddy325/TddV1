import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calculator } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Risk Calculator | TRADEDADDY',
  description: 'Calculate your trading risk and position size',
}

export default function RiskCalculator() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          Risk Calculator
        </h1>
        <p className="text-muted-foreground mt-1">
          Calculate position size based on your risk parameters
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Calculate Position Size</CardTitle>
          <CardDescription>Enter your trading parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account">Account Size</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">R</span>
                <Input 
                  id="account"
                  type="number" 
                  placeholder="50000"
                  className="bg-secondary border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="risk-percent">Risk %</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="risk-percent"
                  type="number" 
                  placeholder="2"
                  className="bg-secondary border-border"
                />
                <span className="text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entry">Entry Price</Label>
              <Input 
                id="entry"
                type="number" 
                placeholder="1.0850"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stop">Stop Loss Price</Label>
              <Input 
                id="stop"
                type="number" 
                placeholder="1.0800"
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <Button className="w-full">Calculate Position Size</Button>

          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground mb-3">Results</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium">Lot Size:</span>
                <span className="text-primary font-semibold">0.50 Standard Lots</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium">Risk Amount:</span>
                <span className="text-red-400 font-semibold">R 1,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium">Pip Distance:</span>
                <span className="text-foreground font-semibold">50 pips</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 border border-border/50 rounded-lg bg-card/50">
        <p className="text-sm text-foreground font-medium mb-2">How It Works</p>
        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
          <li>Enter your account size and risk percentage (typically 1-2%)</li>
          <li>Set your entry and stop loss prices</li>
          <li>The calculator determines the optimal position size</li>
          <li>Adjust lot size to match your risk tolerance</li>
        </ol>
      </div>
    </div>
  )
}
