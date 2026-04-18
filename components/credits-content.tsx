'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, ShoppingCart, History, Info, Gift, Copy, Check } from 'lucide-react'

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
  const [codeInput, setCodeInput] = useState('')
  const [redeeming, setRedeeming] = useState(false)
  const [codeMessage, setCodeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleRedeemCode = async () => {
    if (!codeInput.trim()) {
      setCodeMessage({ type: 'error', text: 'Please enter a code' })
      return
    }

    setRedeeming(true)
    setCodeMessage(null)
    try {
      const response = await fetch('/api/credits/redeem-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeInput.trim().toUpperCase(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setCodeMessage({ type: 'error', text: data.error || 'Failed to redeem code' })
        return
      }

      setCodeMessage({ 
        type: 'success', 
        text: `✓ Successfully redeemed! You received ${data.creditsAdded} credits.` 
      })
      setCodeInput('')
      
      // Refresh page to show new balance
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error('[v0] Error redeeming code:', error)
      setCodeMessage({ type: 'error', text: 'An error occurred while redeeming the code' })
    } finally {
      setRedeeming(false)
    }
  }

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=tradedaddy`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Buy Credits</h1>
        <p className="text-muted-foreground">Use credits to access premium features and AI analysis</p>
      </div>

      {/* Redeem Code Section */}
      <Card className="border-purple-600 bg-purple-900/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-400" />
            Redeem Credit Code
          </CardTitle>
          <CardDescription>Enter a promotional code to receive credits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {codeMessage && (
            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
              codeMessage.type === 'success' 
                ? 'bg-green-900/30 border border-green-800 text-green-300'
                : 'bg-red-900/30 border border-red-800 text-red-300'
            }`}>
              {codeMessage.text}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRedeemCode()}
              placeholder="Enter code (e.g., WELCOME50)"
              disabled={redeeming}
              className="flex-1 px-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:border-purple-600 disabled:opacity-50 font-mono uppercase"
            />
            <Button
              onClick={handleRedeemCode}
              disabled={redeeming || !codeInput.trim()}
              className="px-6"
            >
              {redeeming ? 'Redeeming...' : 'Redeem'}
            </Button>
          </div>
        </CardContent>
      </Card>

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
                onClick={() => {
                  setSelectedPackage(pkg)
                  setIsProcessing(true)
                  
                  fetch('/api/payments/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      credits: pkg.credits,
                      amount: pkg.price * 100,
                      description: `${pkg.credits} TRADEDADDY Credits`,
                      returnUrl: window.location.origin + '/credits?success=true',
                      cancelUrl: window.location.origin + '/credits?canceled=true',
                    }),
                  })
                  .then(res => res.json())
                  .then(data => {
                    if (data.paymentUrl) {
                      window.location.href = data.paymentUrl
                    }
                  })
                  .catch(err => {
                    console.error('Checkout error:', err)
                    alert('Payment processing failed. Please try again.')
                    setIsProcessing(false)
                  })
                }}
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
