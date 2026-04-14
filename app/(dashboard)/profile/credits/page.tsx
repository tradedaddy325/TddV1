"use client"

import { Zap, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const creditPackages = [
  { id: "starter", name: "Starter Pack", credits: 50, price: 49, popular: false },
  { id: "trader", name: "Trader Pack", credits: 150, price: 129, popular: true },
  { id: "pro", name: "Pro Pack", credits: 300, price: 249, popular: false },
  { id: "elite", name: "Elite Pack", credits: 500, price: 399, popular: false },
]

export default function CreditsPage() {
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
            <Zap className="mr-2 inline h-5 w-5 text-accent" />
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
                className={`relative border-border transition-all hover:border-accent/50 ${
                  pkg.popular ? "ring-2 ring-accent" : ""
                }`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent text-background">
                    POPULAR
                  </Badge>
                )}
                <CardContent className="pt-6 text-center">
                  <h3 className="text-lg font-bold">{pkg.name}</h3>
                  <div className="my-4">
                    <span className="text-3xl font-bold text-accent">{pkg.credits}</span>
                    <span className="text-muted-foreground"> credits</span>
                  </div>
                  <p className="mb-4 text-2xl font-bold">R{pkg.price}</p>
                  <Button 
                    onClick={() => handleBuyCredits(pkg.id)}
                    className="w-full bg-white text-black hover:bg-white/90 font-semibold"
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <History className="mr-2 inline h-5 w-5" />
            Credit History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No credit transactions yet</p>
        </CardContent>
      </Card>
    </div>
  )
}
