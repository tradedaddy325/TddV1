'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, ShoppingCart, History, Info } from 'lucide-react'

interface CreditPackage {
  credits: number
  price: number
  currency: string
  popular?: boolean
  description: string
}

const creditPackages: CreditPackage[] = [
  { credits: 100, price: 49, currency: 'R', description: 'Starter Pack' },
  { credits: 500, price: 199, currency: 'R', description: 'Popular Choice', popular: true },
  { credits: 1000, price: 349, currency: 'R', description: 'Pro Pack' },
  { credits: 5000, price: 1499, currency: 'R', description: 'Enterprise' },
]

export function CreditsContent() {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async (pkg: CreditPackage) => {
    setSelectedPackage(pkg)
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credits: pkg.credits,
          amount: pkg.price * 100, // Convert to cents
          description: `${pkg.credits} TRADEDADDY Credits`,
          returnUrl: window.location.origin + '/credits?success=true',
          cancelUrl: window.location.origin + '/credits?canceled=true',
        }),
      })

      if (!response.ok) throw new Error('Checkout failed')
      
      const { paymentUrl } = await response.json()
      if (paymentUrl) {
        window.location.href = paymentUrl
      }
    } catch (error) {
      console.error('Error processing checkout:', error)
      alert('Payment processing failed. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Buy Credits</h1>
        <p className="text-muted-foreground">Use credits to access premium features and AI analysis</p>
      </div>

      {/* Credit Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {creditPackages.map((pkg) => (
          <Card 
            key={pkg.credits}
            className={`relative transition-all border ${pkg.popular ? 'border-green-500 ring-2 ring-green-500 ring-opacity-50' : ''}`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                {pkg.credits.toLocaleString()}
              </CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  {pkg.currency}{pkg.price}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(pkg.price / pkg.credits).toFixed(2)} per credit
                </p>
              </div>

              <Button
                onClick={() => handleCheckout(pkg)}
                disabled={isProcessing && selectedPackage === pkg}
                className="w-full"
                variant={pkg.popular ? 'default' : 'outline'}
              >
                {isProcessing && selectedPackage === pkg ? 'Processing...' : 'Buy Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions yet</p>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What are credits used for?</h4>
            <p className="text-sm text-muted-foreground">
              Credits enable access to advanced AI analysis, premium signals, and unlimited access to trading tools and the academy.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Do credits expire?</h4>
            <p className="text-sm text-muted-foreground">
              Credits do not expire and can be used at your own pace across all platform features.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Is there a refund policy?</h4>
            <p className="text-sm text-muted-foreground">
              All credit purchases are final. If you experience any issues, please contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
