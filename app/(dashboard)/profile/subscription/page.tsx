"use client"

import { Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import useSWR from "swr"
import type { Profile } from "@/lib/types"

const subscriptionTiers = [
  {
    id: "pro",
    name: "Pro",
    price: 249,
    features: ["500 credits/month", "All calculators", "Unlimited journal", "Full academy access", "Priority support"],
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: 499,
    features: ["Unlimited credits", "All Pro features", "AI trade analysis", "Advanced analytics", "Dedicated support"],
    popular: false,
  },
]

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
  return data as Profile
}

export default function SubscriptionPage() {
  const { data: profile } = useSWR("profile", fetcher)

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

    const { paymentUrl } = await response.json()
    if (paymentUrl) {
      window.location.href = paymentUrl
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <Crown className="mr-2 inline h-5 w-5" />
            Subscription Plans
          </CardTitle>
          <CardDescription>
            Unlock premium features and take your trading to the next level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {subscriptionTiers.map((tier) => (
              <Card 
                key={tier.id} 
                className={`relative border-border transition-all hover:border-accent/50 ${
                  tier.popular ? "ring-2 ring-accent" : ""
                }`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent text-background">
                    MOST POPULAR
                  </Badge>
                )}
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    <div className="my-4">
                      <span className="text-4xl font-bold text-accent">R{tier.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>
                  <ul className="mb-6 space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => handleSubscribe(tier.id)}
                    className={`w-full font-semibold ${
                      profile?.subscription_tier === tier.id
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-white text-black hover:bg-white/90"
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
    </div>
  )
}
