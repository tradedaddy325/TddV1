import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LegalFooter } from '@/components/legal-footer'
import {
  TrendingUp,
  Calculator,
  BookOpen,
  FileText,
  MessageSquare,
  Globe,
  Zap,
  Shield,
  BarChart3,
  ChevronRight,
} from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Live Market Data',
    description: 'Real-time prices for Gold, Forex, Crypto, and Indices with 15-30s refresh rates.',
  },
  {
    icon: Calculator,
    title: '12 Trading Calculators',
    description: 'Pip value, lot size, risk/reward, position sizing, and more essential tools.',
  },
  {
    icon: FileText,
    title: 'Trade Journal',
    description: 'Log trades, track performance, analyze patterns, and improve your strategy.',
  },
  {
    icon: BookOpen,
    title: 'Trading Academy',
    description: 'Learn from beginner to advanced with structured lessons and quizzes.',
  },
  {
    icon: MessageSquare,
    title: 'AI Analysis',
    description: 'Get AI-powered trade analysis, market insights, and setup recommendations.',
  },
  {
    icon: Globe,
    title: 'Macro Hub',
    description: 'Economic calendar, news feed, and global market analysis tools.',
  },
]

const pricingTiers = [
  {
    name: 'Free',
    price: 'R0',
    period: '',
    features: ['100 starter credits', 'Basic calculators', 'Limited journal entries', 'Academy basics'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: 'R249',
    period: '/month',
    features: ['500 credits/month', 'All calculators', 'Unlimited journal', 'Full academy access', 'Priority support'],
    cta: 'Go Pro',
    popular: true,
  },
  {
    name: 'Elite',
    price: 'R499',
    period: '/month',
    features: ['Unlimited credits', 'All Pro features', 'AI trade analysis', 'Advanced analytics', 'Dedicated support'],
    cta: 'Go Elite',
    popular: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-primary">TRADEDADDY</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
          <Link href="/auth/sign-up" className="md:hidden">
            <Button size="sm">Start</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs border border-border rounded-full bg-card">
                <span className="relative flex h-2 w-2">
                  <span className="pulse-live absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-muted-foreground">Live Market Data</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
                Professional <span className="text-primary">Trading Terminal</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
                All-in-one platform with live market prices, 12 trading calculators, AI analysis, trade journal, and academy. Everything a trader needs.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/auth/sign-up">
                  <Button size="lg">
                    Start for Free
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-16">
                <div className="p-4 border border-border/50 rounded-lg bg-card/50">
                  <div className="text-2xl font-bold text-primary mb-1">6</div>
                  <div className="text-xs text-muted-foreground">Live Market Feeds</div>
                </div>
                <div className="p-4 border border-border/50 rounded-lg bg-card/50">
                  <div className="text-2xl font-bold text-primary mb-1">12+</div>
                  <div className="text-xs text-muted-foreground">Trading Calculators</div>
                </div>
                <div className="p-4 border border-border/50 rounded-lg bg-card/50">
                  <div className="text-2xl font-bold text-primary mb-1">AI</div>
                  <div className="text-xs text-muted-foreground">Trade Analysis</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need to Trade</h2>
              <p className="text-muted-foreground">Comprehensive tools designed for traders at every level.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <Card key={feature.title} className="border-border/50 hover:border-border transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                        {feature.title === 'Live Market Data' && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-mono">LIVE</span>
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground">Choose the plan that fits your trading needs.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {pricingTiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`relative border transition-colors ${
                    tier.popular ? 'border-primary md:scale-105' : 'border-border/50'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="text-4xl font-bold text-foreground">{tier.price}</div>
                      {tier.period && <div className="text-sm text-muted-foreground">{tier.period}</div>}
                    </div>

                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                      {tier.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 p-4 border border-border/50 rounded-lg bg-card/50 max-w-2xl mx-auto">
              <p className="text-xs text-muted-foreground">
                <Shield className="w-4 h-4 inline mr-2" />
                All plans include 14-day free trial. No credit card required.
              </p>
            </div>
          </div>
        </section>
      </main>

      <LegalFooter />
    </div>
  )
}
