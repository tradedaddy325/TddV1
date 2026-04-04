import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary glow-green">TRADEDADDY</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
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
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs border border-border rounded bg-card">
              <span className="relative flex h-2 w-2">
                <span className="pulse-live absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-muted-foreground">Live Market Data</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Your Complete{' '}
              <span className="text-primary glow-green">Trading Terminal</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
              Professional trading workspace with live market data, calculators, trade journaling, 
              AI analysis, and education. Everything you need in one terminal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Trading Free
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Login to Terminal
                </Button>
              </Link>
            </div>

            {/* Terminal Preview */}
            <div className="mt-16 p-4 bg-card border border-border rounded">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
                <span className="text-xs text-muted-foreground">tradedaddy@terminal:~$</span>
              </div>
              <div className="text-left text-sm text-muted-foreground font-mono space-y-1">
                <p><span className="text-primary">$</span> initializing trading workspace...</p>
                <p><span className="text-primary">$</span> loading market data feeds...</p>
                <p><span className="text-primary">$</span> connecting to price servers...</p>
                <p className="text-primary glow-green">{">"} System ready. Welcome, Trader._</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need to Trade
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Professional-grade tools designed for serious traders
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">50+</p>
              <p className="text-sm text-muted-foreground">Trading Pairs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">12</p>
              <p className="text-sm text-muted-foreground">Calculators</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Market Data</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">100%</p>
              <p className="text-sm text-muted-foreground">South African</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose the plan that fits your trading style. Prices in South African Rand.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`bg-card border-border relative ${tier.popular ? 'border-primary' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs rounded">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Zap className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/sign-up">
                    <Button
                      variant={tier.popular ? 'default' : 'outline'}
                      className="w-full"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">
              Ready to Level Up Your Trading?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join TRADEDADDY today and get 100 free credits to explore all features.
              No credit card required.
            </p>
            <Link href="/auth/sign-up">
              <Button size="lg">
                Create Free Account
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 bg-primary rounded">
                <TrendingUp className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-primary">TRADEDADDY</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date().getFullYear()} TRADEDADDY. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
