'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function SettingsPageContent() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    priceUpdates: true,
    aiInsights: true,
    newsDigest: false,
  })
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    currencyDisplay: 'USD',
  })

  const handleSaveProfile = async () => {
    try {
      // API call to save profile
      console.log('Saving profile:', { displayName, email })
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  return (
    <Tabs defaultValue="profile" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-4 bg-background border border-accent/30">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile" className="space-y-6">
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="bg-background/50 border-accent/30"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-background/50 border-accent/30"
              />
              <p className="text-xs text-muted-foreground">
                Your email is used for account recovery and notifications
              </p>
            </div>

            <Button onClick={handleSaveProfile} className="bg-accent hover:bg-accent/90">
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                className="bg-background/50 border-accent/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                className="bg-background/50 border-accent/30"
              />
            </div>
            <Button variant="outline" className="border-accent/30">
              Update Password
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Billing Tab */}
      <TabsContent value="billing" className="space-y-6">
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle>Billing & Credits</CardTitle>
            <CardDescription>Manage your subscription and credits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 bg-background/50 rounded border border-accent/20">
              <div>
                <p className="text-sm text-muted-foreground">Current Credits</p>
                <p className="text-2xl font-bold text-accent">500</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="text-2xl font-bold">Free</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-accent hover:bg-accent/90">
                Purchase Credits
              </Button>
              <Button variant="outline" className="w-full border-accent/30">
                Upgrade to Pro
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              View your billing history and manage payment methods in the Credits section.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notifications Tab */}
      <TabsContent value="notifications" className="space-y-6">
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Control how we reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Alerts */}
            <div className="flex items-center justify-between p-4 bg-background/50 rounded border border-accent/20">
              <div>
                <p className="font-medium">Price Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified of price changes</p>
              </div>
              <Switch
                checked={notifications.emailAlerts}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, emailAlerts: checked })
                }
              />
            </div>

            {/* Price Updates */}
            <div className="flex items-center justify-between p-4 bg-background/50 rounded border border-accent/20">
              <div>
                <p className="font-medium">Price Updates</p>
                <p className="text-sm text-muted-foreground">Daily market summaries</p>
              </div>
              <Switch
                checked={notifications.priceUpdates}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, priceUpdates: checked })
                }
              />
            </div>

            {/* AI Insights */}
            <div className="flex items-center justify-between p-4 bg-background/50 rounded border border-accent/20">
              <div>
                <p className="font-medium">AI Insights</p>
                <p className="text-sm text-muted-foreground">AI-generated market analysis</p>
              </div>
              <Switch
                checked={notifications.aiInsights}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, aiInsights: checked })
                }
              />
            </div>

            {/* News Digest */}
            <div className="flex items-center justify-between p-4 bg-background/50 rounded border border-accent/20">
              <div>
                <p className="font-medium">News Digest</p>
                <p className="text-sm text-muted-foreground">Weekly market news</p>
              </div>
              <Switch
                checked={notifications.newsDigest}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, newsDigest: checked })
                }
              />
            </div>

            <Button className="w-full bg-accent hover:bg-accent/90">
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Preferences Tab */}
      <TabsContent value="preferences" className="space-y-6">
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle>Application Preferences</CardTitle>
            <CardDescription>Customize your TRADEDADDY experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme */}
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={preferences.theme} onValueChange={(value) => setPreferences({ ...preferences, theme: value })}>
                <SelectTrigger className="bg-background/50 border-accent/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={preferences.language} onValueChange={(value) => setPreferences({ ...preferences, language: value })}>
                <SelectTrigger className="bg-background/50 border-accent/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={preferences.timezone} onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}>
                <SelectTrigger className="bg-background/50 border-accent/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">EST</SelectItem>
                  <SelectItem value="CST">CST</SelectItem>
                  <SelectItem value="PST">PST</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label>Currency Display</Label>
              <Select value={preferences.currencyDisplay} onValueChange={(value) => setPreferences({ ...preferences, currencyDisplay: value })}>
                <SelectTrigger className="bg-background/50 border-accent/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="ZAR">ZAR (R)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full bg-accent hover:bg-accent/90">
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
