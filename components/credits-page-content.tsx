'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Coins } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CreditPackage {
  id: string
  credits: number
  price: number
  savings?: number
  popular?: boolean
}

const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    credits: 100,
    price: 49,
  },
  {
    id: 'pro',
    credits: 500,
    price: 199,
    savings: 50,
    popular: true,
  },
  {
    id: 'elite',
    credits: 1000,
    price: 349,
    savings: 150,
  },
]

interface UserCredits {
  currentCredits: number
  totalSpent: number
  lastPurchase?: string
}

export function CreditsPageContent() {
  const router = useRouter()
  const [userCredits, setUserCredits] = useState<UserCredits>({
    currentCredits: 0,
    totalSpent: 0,
  })
  const [loading, setLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null)

  const handlePurchase = async (pkg: CreditPackage) => {
    setLoading(true)
    setSelectedPackage(pkg)

    try {
      // Redirect to Yoco checkout
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credits: pkg.credits,
          amount: pkg.price * 100, // Convert to cents
          package: pkg.id,
        }),
      })

      if (!response.ok) throw new Error('Failed to create checkout')

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Failed to process payment. Please try again.')
    } finally {
      setLoading(false)
      setSelectedPackage(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Current Balance */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-accent" />
            Your Credits Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Credits</p>
              <p className="text-3xl font-bold text-accent">{userCredits.currentCredits}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
              <p className="text-2xl font-mono">R {userCredits.totalSpent.toFixed(2)}</p>
            </div>
          </div>
          {userCredits.lastPurchase && (
            <p className="text-xs text-muted-foreground">
              Last purchase: {userCredits.lastPurchase}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Credit Packages */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Purchase Credits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CREDIT_PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative border-2 transition-all ${
                pkg.popular
                  ? 'border-accent bg-accent/5'
                  : 'border-accent/30 hover:border-accent/60'
              }`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-2 -right-2 bg-accent text-background">
                  Most Popular
                </Badge>
              )}
              {pkg.savings && (
                <div className="absolute top-4 right-4 text-xs text-green-400 font-semibold">
                  Save R{pkg.savings}
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl font-bold text-accent">
                  {pkg.credits}
                </CardTitle>
                <CardDescription>Credits</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold">R {pkg.price}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ~R {(pkg.price / pkg.credits).toFixed(2)}/credit
                  </p>
                </div>

                <Button
                  onClick={() => handlePurchase(pkg)}
                  disabled={loading && selectedPackage?.id === pkg.id}
                  className={`w-full ${
                    pkg.popular
                      ? 'bg-accent hover:bg-accent/90'
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {loading && selectedPackage?.id === pkg.id
                    ? 'Processing...'
                    : 'Buy Now'}
                </Button>

                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Instant delivery</li>
                  <li>✓ No expiration</li>
                  <li>✓ Lifetime access</li>
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent credit purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="border-accent/30 bg-background/50">
        <CardHeader>
          <CardTitle>About Credits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-semibold text-accent mb-1">What are credits?</p>
            <p className="text-muted-foreground">
              Credits are used to access premium features like AI market analysis, advanced tools, and real-time data.
            </p>
          </div>
          <div>
            <p className="font-semibold text-accent mb-1">Do credits expire?</p>
            <p className="text-muted-foreground">
              No, your credits never expire. Use them whenever you need.
            </p>
          </div>
          <div>
            <p className="font-semibold text-accent mb-1">Can I get a refund?</p>
            <p className="text-muted-foreground">
              Contact our support team for refund requests within 14 days of purchase.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
