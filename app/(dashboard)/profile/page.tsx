"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { User, Zap, Crown, Settings, LogOut, Shield, Bell, Gift, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import useSWR, { mutate } from "swr"
import type { Profile } from "@/lib/types"

const fetcher = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) throw error
  return { ...data, email: user.email } as Profile & { email: string }
}

const creditPackages = [
  { id: "starter", name: "Starter", credits: 50, price: 49, popular: false },
  { id: "trader", name: "Trader", credits: 150, price: 129, popular: true },
  { id: "pro", name: "Pro", credits: 300, price: 249, popular: false },
  { id: "elite", name: "Elite", credits: 500, price: 399, popular: false },
]

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "account"
  
  const { data: profile, isLoading } = useSWR("profile", fetcher)
  const [isUpdating, setIsUpdating] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState("")
  const [activeTab, setActiveTab] = useState(initialTab)
  const [voucherCode, setVoucherCode] = useState("")
  const [redeeming, setRedeeming] = useState(false)
  const [voucherMessage, setVoucherMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "")
      setUsername(profile.username || "")
    }
  }, [profile])

  const handleUpdateProfile = async () => {
    if (!profile) return
    setIsUpdating(true)

    const supabase = createClient()
    await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        username: username,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)

    mutate("profile")
    setIsUpdating(false)
  }

  const handleRedeemVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherMessage({ type: 'error', text: 'Please enter a voucher code' })
      return
    }

    setRedeeming(true)
    setVoucherMessage(null)
    try {
      const response = await fetch('/api/credits/redeem-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: voucherCode.trim().toUpperCase(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setVoucherMessage({ type: 'error', text: data.error || 'Failed to redeem voucher' })
        return
      }

      setVoucherMessage({ 
        type: 'success', 
        text: `Success! You received ${data.creditsAdded} credits.` 
      })
      setVoucherCode('')
      mutate("profile")
      
      setTimeout(() => {
        setVoucherMessage(null)
      }, 3000)
    } catch (error) {
      console.error('[v0] Error redeeming voucher:', error)
      setVoucherMessage({ type: 'error', text: 'An error occurred while redeeming the voucher' })
    } finally {
      setRedeeming(false)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setTimeout(() => {
      router.push("/")
      router.refresh()
    }, 0)
  }

  const handleBuyCredits = async (packageId: string) => {
    const pkg = creditPackages.find(p => p.id === packageId)
    if (!pkg) return

    const response = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "credits",
        packageId: pkg.id,
        amount: pkg.price * 100,
        credits: pkg.credits,
      }),
    })

    const { paymentUrl } = await response.json()
    if (paymentUrl) {
      window.location.href = paymentUrl
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="animate-pulse font-mono">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <Card className="border-border bg-gradient-to-r from-card to-card/50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-accent">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-accent text-background font-bold text-xl">
                    {profile?.display_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{profile?.display_name || "User"}</h1>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <Badge variant="secondary" className="font-mono">
                      <Zap className="h-3 w-3 mr-1" />
                      {profile?.credits || 0} Credits
                    </Badge>
                    <Badge variant="outline" className="font-mono">
                      <Crown className="h-3 w-3 mr-1" />
                      {profile?.subscription_tier?.toUpperCase() || "FREE"}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <Card className="border-border sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Profile Menu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { id: 'account', label: 'Account Info', icon: User },
                  { id: 'credits', label: 'Buy Credits', icon: Zap },
                  { id: 'vouchers', label: 'Voucher Codes', icon: Gift },
                  { id: 'settings', label: 'Preferences', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left ${
                        activeTab === item.id
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Tab Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Display Name</Label>
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your display name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={profile?.email || ""} disabled className="opacity-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <Input
                        value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ""}
                        disabled
                        className="opacity-50"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Credits Tab */}
            {activeTab === 'credits' && (
              <div className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-accent" />
                      Buy Credits
                    </CardTitle>
                    <CardDescription>Choose a package to add credits to your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                      {creditPackages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className={`relative rounded-lg border-2 p-4 text-center transition-all cursor-pointer hover:border-accent ${
                            pkg.popular ? 'border-accent bg-accent/5' : 'border-border'
                          }`}
                        >
                          {pkg.popular && (
                            <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent">
                              POPULAR
                            </Badge>
                          )}
                          <h3 className="font-semibold mt-2">{pkg.name}</h3>
                          <div className="my-3">
                            <span className="text-2xl font-bold text-accent">{pkg.credits}</span>
                            <p className="text-xs text-muted-foreground">credits</p>
                          </div>
                          <p className="text-lg font-bold mb-3">R{pkg.price}</p>
                          <Button 
                            onClick={() => handleBuyCredits(pkg.id)}
                            size="sm"
                            className="w-full bg-white text-black hover:bg-white/90 font-semibold"
                          >
                            Buy
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Vouchers Tab */}
            {activeTab === 'vouchers' && (
              <div className="space-y-6">
                <Card className="border-border border-green-600/30 bg-green-900/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-green-400" />
                      Redeem Voucher Code
                    </CardTitle>
                    <CardDescription>Enter a voucher code to receive free credits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {voucherMessage && (
                      <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                        voucherMessage.type === 'success' 
                          ? 'bg-green-900/30 border border-green-800 text-green-300'
                          : 'bg-red-900/30 border border-red-800 text-red-300'
                      }`}>
                        {voucherMessage.type === 'success' ? '✓' : '✕'} {voucherMessage.text}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="voucher">Voucher Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="voucher"
                          type="text"
                          value={voucherCode}
                          onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleRedeemVoucher()}
                          placeholder="Enter voucher code"
                          disabled={redeeming}
                          className="font-mono uppercase"
                        />
                        <Button
                          onClick={handleRedeemVoucher}
                          disabled={redeeming || !voucherCode.trim()}
                          className="px-6 bg-accent hover:bg-accent/90"
                        >
                          {redeeming ? 'Redeeming...' : 'Redeem'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Example codes: WELCOME50, TRADEDADDY100, BETA200</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Available Vouchers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { code: 'WELCOME50', credits: 50, status: 'Active' },
                        { code: 'TRADEDADDY100', credits: 100, status: 'Active' },
                        { code: 'BETA200', credits: 200, status: 'Active' },
                        { code: 'REFERRAL500', credits: 500, status: 'Active' },
                      ].map((voucher) => (
                        <div key={voucher.code} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                          <div className="space-y-1">
                            <p className="font-mono font-semibold text-sm">{voucher.code}</p>
                            <p className="text-xs text-muted-foreground">{voucher.credits} Credits</p>
                          </div>
                          <Badge variant="secondary" className="bg-green-900/20 text-green-400 border-0">
                            {voucher.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Preferences & Security</CardTitle>
                  <CardDescription>Manage your account settings and security options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Price Alerts</p>
                            <p className="text-xs text-muted-foreground">Get notified about price changes</p>
                          </div>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Zap className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Trade Signals</p>
                            <p className="text-xs text-muted-foreground">Receive AI trading signals</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6 space-y-4">
                    <h3 className="text-sm font-semibold">Security</h3>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Two-Factor Authentication</p>
                          <p className="text-xs text-muted-foreground">Add an extra security layer</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
