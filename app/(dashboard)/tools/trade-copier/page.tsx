import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Trade Copier Setup | TRADEDADDY',
  description: 'Automatically copy Trade Daddy trades',
}

export default function TradeCopierSetup() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Trade Copier Setup
        </h1>
        <p className="text-muted-foreground mt-1">
          Automatically mirror Trade Daddy's trades on your own account
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <Badge className="mb-3">Premium Feature</Badge>
            <h3 className="font-semibold text-foreground mb-2">Auto Trade Copier</h3>
            <p className="text-sm text-muted-foreground">
              Automatically copies all trades with automatic position sizing
            </p>
            <Button className="w-full mt-4">Get Premium</Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <Badge className="mb-3" variant="outline">Available</Badge>
            <h3 className="font-semibold text-foreground mb-2">Manual Alerts</h3>
            <p className="text-sm text-muted-foreground">
              Receive alerts when Trade Daddy enters or exits trades
            </p>
            <Button variant="outline" className="w-full mt-4">Enable Alerts</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>How Trade Copier Works</CardTitle>
          <CardDescription>Step-by-step setup guide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Connect Your Broker',
                description: 'Link your trading account to TRADEDADDY via secure API connection'
              },
              {
                step: 2,
                title: 'Set Your Parameters',
                description: 'Configure position sizing, max risk per trade, and pairs to copy'
              },
              {
                step: 3,
                title: 'Configure Risk',
                description: 'Set your risk percentage and account equity threshold'
              },
              {
                step: 4,
                title: 'Start Copying',
                description: 'Once activated, trades are automatically mirrored to your account'
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 flex-shrink-0">
                  <span className="font-semibold text-primary text-sm">{item.step}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Supported Brokers</CardTitle>
          <CardDescription>Compatible with major trading platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'Interactive Brokers', 'Oanda', 'Saxo Bank', 'IC Markets', 'Pepperstone'].map((broker) => (
              <Badge key={broker} variant="outline" className="justify-center py-2">
                {broker}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-500/10 border-yellow-500/50">
        <CardHeader>
          <CardTitle className="text-yellow-400">Important Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Past performance does not guarantee future results</p>
          <p>• Trade copying carries the same risks as manual trading</p>
          <p>• Ensure your broker allows trade copying and EA usage</p>
          <p>• Monitor your account regularly for any issues</p>
          <p>• Always maintain proper risk management practices</p>
        </CardContent>
      </Card>
    </div>
  )
}
