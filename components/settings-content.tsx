'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Bell, Lock, CreditCard, LogOut, Trash2 } from 'lucide-react'

interface SubscriptionTier {
  name: string
  price: number
  currency: string
  features: string[]
  popular?: boolean
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Basic',
    price: 99,
    currency: 'R',
    features: ['10 signals/month', 'Basic analytics', 'Email support'],
  },
  {
    name: 'Pro',
    price: 249,
    currency: 'R',
    features: ['Unlimited signals', 'Advanced analytics', 'Priority support'],
    popular: true,
  },
  {
    name: 'Elite',
    price: 499,
    currency: 'R',
    features: ['Everything in Pro', 'AI market briefing', '1-on-1 coaching', 'API access'],
  },
]

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState('account')
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null)

  const handleSubscribe = async (tier: SubscriptionTier) => {
    setSelectedTier(tier)
    setIsProcessing(true)

    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subscription',
          tier: tier.name.toLowerCase(),
          amount: tier.price * 100,
          description: `TRADEDADDY ${tier.name} Subscription`,
          returnUrl: window.location.origin + '/settings?subscription=success',
          cancelUrl: window.location.origin + '/settings?subscription=canceled',
        }),
      })

      if (!response.ok) throw new Error('Subscription failed')

      const { paymentUrl } = await response.json()
      if (paymentUrl) {
        window.location.href = paymentUrl
      }
    } catch (error) {
      console.error('Error processing subscription:', error)
      alert('Subscription processing failed. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      {/* Account Settings */}
      <TabsContent value="account" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Account Settings
            </CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                disabled
                className="w-full px-3 py-2 border border-input rounded-md bg-muted text-foreground"
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <input
                type="text"
                disabled
                className="w-full px-3 py-2 border border-input rounded-md bg-muted text-foreground"
                placeholder="username"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Edit Profile</Button>
              <Button variant="outline" className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Subscription Tiers */}
      <TabsContent value="subscription" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Choose Your Plan
            </CardTitle>
            <CardDescription>Upgrade or downgrade your subscription at any time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionTiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`relative transition-all border ${
                    tier.popular ? 'border-green-500 ring-2 ring-green-500 ring-opacity-50' : ''
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-500">Most Popular</Badge>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <div className="text-3xl font-bold mt-2">
                      {tier.currency}{tier.price}
                      <span className="text-lg text-muted-foreground">/mo</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSubscribe(tier)}
                      disabled={isProcessing && selectedTier === tier}
                      className="w-full"
                      variant={tier.popular ? 'default' : 'outline'}
                    >
                      {isProcessing && selectedTier === tier ? 'Processing...' : 'Subscribe Now'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notifications */}
      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Control how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { label: 'Market Alerts', description: 'Get notified about price movements' },
                { label: 'Signal Updates', description: 'Receive new trading signals' },
                { label: 'News Digest', description: 'Daily market news summary' },
                { label: 'System Updates', description: 'Important platform updates' },
              ].map((notification) => (
                <div key={notification.label} className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <div>
                    <p className="font-medium text-sm">{notification.label}</p>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Security */}
      <TabsContent value="security" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Enable Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View Active Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
