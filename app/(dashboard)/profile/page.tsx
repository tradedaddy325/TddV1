"use client"

import { useState, useEffect } from "react"
import { User, CreditCard, Zap, Crown, Settings, LogOut, Shield, Bell, History } from "lucide-react"
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
  { id: "starter", name: "Starter Pack", credits: 50, price: 49, popular: false },
  { id: "trader", name: "Trader Pack", credits: 150, price: 129, popular: true },
  { id: "pro", name: "Pro Pack", credits: 300, price: 249, popular: false },
  { id: "elite", name: "Elite Pack", credits: 500, price: 399, popular: false },
]

const subscriptionTiers = [
  {
    id: "basic",
    name: "Basic",
    price: 99,
    features: ["Access to all calculators", "Basic market data", "Trade journal", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 249,
    features: ["Everything in Basic", "Advanced academy content", "AI trade analysis (50/mo)", "Priority support", "Custom alerts"],
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: 499,
    features: ["Everything in Pro", "Unlimited AI analysis", "1-on-1 mentorship", "Gold trading masterclass", "Private Discord access"],
  },
]

export default function ProfilePage() {
  const { data: profile, isLoading } = useSWR("profile", fetcher)
  const [isUpdating, setIsUpdating] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState("")
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

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    // Wrap router operations in setTimeout to ensure they happen after initialization
    setTimeout(() => {
      router.push("/")
      router.refresh()
    }, 0)
  }

  const handleBuyCredits = async (packageId: string) => {
    const pkg = creditPackages.find(p => p.id === packageId)
    if (!pkg) return

    // Initiate Yoco checkout
    const response = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "credits",
        packageId: pkg.id,
        amount: pkg.price * 100, // Convert to cents
        credits: pkg.credits,
      }),
    })

    const { checkoutUrl } = await response.json()
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }

  const handleSubscribe = async (tierId: string) => {
    const tier = subscriptionTiers.find(t => t.id === tierId)
    if (!tier) return

    const response = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "subscription",
        tierId: tier.id,
        amount: tier.price * 100,
      }),
    })

    const { checkoutUrl } = await response.json()
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "free":
        return <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">FREE</Badge>
      case "basic":
        return <Badge variant="outline" className="border-terminal-cyan/30 text-terminal-cyan">BASIC</Badge>
      case "pro":
        return <Badge variant="outline" className="border-terminal-yellow/30 text-terminal-yellow">PRO</Badge>
      case "elite":
        return <Badge className="border-0 bg-gradient-to-r from-terminal-yellow to-amber-500 text-background">ELITE</Badge>
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="animate-pulse font-mono text-terminal-green">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono text-2xl font-bold text-terminal-green">
          {">"} USER_PROFILE
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          Manage your account, credits, and subscription
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="account" className="font-mono">
            <User className="mr-2 h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="credits" className="font-mono">
            <Zap className="mr-2 h-4 w-4" />
            Credits
          </TabsTrigger>
          <TabsTrigger value="subscription" className="font-mono">
            <Crown className="mr-2 h-4 w-4" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="settings" className="font-mono">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6 space-y-6">
          <Card className="border-terminal-green/20 bg-card/50">
            <CardHeader>
              <CardTitle className="font-mono text-terminal-green">Profile Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-2 border-terminal-green/30">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-terminal-green/10 font-mono text-terminal-green">
                    {profile?.display_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="border-terminal-green/30">
                    Change Avatar
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="border-terminal-green/30 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-terminal-green/30 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={profile?.email || ""}
                    disabled
                    className="border-terminal-green/30 font-mono opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <Input
                    value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ""}
                    disabled
                    className="border-terminal-green/30 font-mono opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-terminal-green/20 bg-terminal-green/5 p-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-terminal-yellow" />
                  <div>
                    <p className="font-mono font-medium">Available Credits</p>
                    <p className="text-sm text-muted-foreground">Use credits for AI analysis</p>
                  </div>
                </div>
                <span className="font-mono text-2xl font-bold text-terminal-yellow">{profile?.credits || 0}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-terminal-green/20 bg-terminal-green/5 p-4">
                <div className="flex items-center gap-3">
                  <Crown className="h-5 w-5 text-terminal-cyan" />
                  <div>
                    <p className="font-mono font-medium">Subscription Tier</p>
                    <p className="text-sm text-muted-foreground">Your current plan</p>
                  </div>
                </div>
                {getTierBadge(profile?.subscription_tier || "free")}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                  className="bg-terminal-green text-background hover:bg-terminal-green/90"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits" className="mt-6 space-y-6">
          <Card className="border-terminal-green/20 bg-card/50">
            <CardHeader>
              <CardTitle className="font-mono text-terminal-green">
                <Zap className="mr-2 inline h-5 w-5 text-terminal-yellow" />
                Buy Credits
              </CardTitle>
              <CardDescription>
                Credits are used for AI trade analysis. Choose a package that suits your trading volume.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {creditPackages.map((pkg) => (
                  <Card 
                    key={pkg.id} 
                    className={`relative border-terminal-green/20 bg-background/50 transition-all hover:border-terminal-green/40 ${
                      pkg.popular ? "ring-2 ring-terminal-green" : ""
                    }`}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-terminal-green text-background">
                        POPULAR
                      </Badge>
                    )}
                    <CardContent className="pt-6 text-center">
                      <h3 className="font-mono text-lg font-bold">{pkg.name}</h3>
                      <div className="my-4">
                        <span className="font-mono text-3xl font-bold text-terminal-yellow">{pkg.credits}</span>
                        <span className="text-muted-foreground"> credits</span>
                      </div>
                      <p className="mb-4 font-mono text-2xl font-bold text-terminal-green">R{pkg.price}</p>
                      <Button 
                        onClick={() => handleBuyCredits(pkg.id)}
                        className="w-full bg-terminal-green text-background hover:bg-terminal-green/90"
                      >
                        Buy Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-terminal-green/20 bg-card/50">
            <CardHeader>
              <CardTitle className="font-mono text-terminal-green">
                <History className="mr-2 inline h-5 w-5" />
                Credit History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">No credit transactions yet</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="mt-6 space-y-6">
          <Card className="border-terminal-green/20 bg-card/50">
            <CardHeader>
              <CardTitle className="font-mono text-terminal-green">
                <Crown className="mr-2 inline h-5 w-5" />
                Subscription Plans
              </CardTitle>
              <CardDescription>
                Unlock premium features and take your trading to the next level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {subscriptionTiers.map((tier) => (
                  <Card 
                    key={tier.id} 
                    className={`relative border-terminal-green/20 bg-background/50 transition-all hover:border-terminal-green/40 ${
                      tier.popular ? "ring-2 ring-terminal-green" : ""
                    }`}
                  >
                    {tier.popular && (
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-terminal-green text-background">
                        MOST POPULAR
                      </Badge>
                    )}
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="font-mono text-xl font-bold">{tier.name}</h3>
                        <div className="my-4">
                          <span className="font-mono text-4xl font-bold text-terminal-green">R{tier.price}</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </div>
                      <ul className="mb-6 space-y-3">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-terminal-green" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button 
                        onClick={() => handleSubscribe(tier.id)}
                        className={`w-full ${
                          profile?.subscription_tier === tier.id
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-terminal-green text-background hover:bg-terminal-green/90"
                        }`}
                        disabled={profile?.subscription_tier === tier.id}
                      >
                        {profile?.subscription_tier === tier.id ? "Current Plan" : "Subscribe"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6 space-y-6">
          <Card className="border-terminal-green/20 bg-card/50">
            <CardHeader>
              <CardTitle className="font-mono text-terminal-green">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Price Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when prices hit your targets</p>
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="border-terminal-red/30 bg-card/50">
            <CardHeader>
              <CardTitle className="font-mono text-terminal-red">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sign Out</p>
                  <p className="text-sm text-muted-foreground">Log out of your account</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="border-terminal-red/30 text-terminal-red hover:bg-terminal-red/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
