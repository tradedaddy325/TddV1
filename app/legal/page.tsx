'use client'

import { LegalFooter } from '@/components/legal-footer'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, FileText, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function LegalPage() {
  const legalPages = [
    {
      title: 'Risk Disclosure',
      description: 'Comprehensive risk warnings about trading and using this platform',
      icon: AlertTriangle,
      href: '/risk-disclosure',
      color: 'text-red-400',
    },
    {
      title: 'Terms of Service',
      description: 'Full terms and conditions for using TradeDaddy',
      icon: FileText,
      href: '/terms',
      color: 'text-blue-400',
    },
    {
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your personal data',
      icon: Shield,
      href: '/privacy',
      color: 'text-cyan-400',
    },
    {
      title: 'Signal Disclaimer',
      description: 'Important information about trading signals and how they should be used',
      icon: Zap,
      href: '/signal-disclaimer',
      color: 'text-yellow-400',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-mono">LEGAL INFORMATION</h1>
          <p className="text-muted-foreground">
            Please read all legal documents carefully before using TradeDaddy
          </p>
        </div>

        {/* Important Banner */}
        <div className="bg-red-900/30 border-2 border-red-600 p-6 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-red-400 font-bold text-lg mb-2">⚠️ IMPORTANT LEGAL NOTICE</p>
              <p className="text-foreground mb-2">
                Trading financial instruments involves substantial risk of loss. TradeDaddy does not provide financial or investment advice. By using this platform, you agree to accept full responsibility for your trading decisions and any losses that may result.
              </p>
              <p className="text-sm text-red-300">
                You may lose all of your investment. Read all legal documents before proceeding.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Pages Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {legalPages.map((page) => {
            const Icon = page.icon
            return (
              <Link key={page.href} href={page.href}>
                <Card className="border-border/50 hover:border-border transition-all cursor-pointer h-full group hover:bg-card/80">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Icon className={`w-8 h-8 ${page.color} flex-shrink-0`} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {page.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">{page.description}</p>
                        <span className="text-xs text-cyan-400 group-hover:underline">Read Full Document →</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Quick Summary */}
        <div className="bg-background border border-border/50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Points Summary</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-cyan-400">What You Should Know:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Trading involves substantial risk and you may lose all your investment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>TradeDaddy provides educational signals, not financial advice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Past performance does not guarantee future results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You are solely responsible for your trading decisions</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-cyan-400">Your Responsibilities:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Use risk management tools (stop losses, position sizing)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Conduct your own independent research</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Only trade with money you can afford to lose</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Consult professional advisors when appropriate</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment & Refund Info */}
        <div className="bg-background border border-border/50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Payment & Refund Policy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-cyan-400 mb-3">Payment Terms:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc ml-4">
                <li>Payments processed through YOCO (PCI compliant)</li>
                <li>Monthly subscriptions auto-renew unless canceled</li>
                <li>Cancellation effective end of billing period</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-cyan-400 mb-3">Refund Policy:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc ml-4">
                <li>7-day money-back guarantee for new subscriptions</li>
                <li>Refund request must be within 7 days of purchase</li>
                <li>Refunds processed within 5-10 business days</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-blue-900/10 border border-blue-700/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Questions or Concerns?</h2>
          <p className="text-muted-foreground mb-4">For legal or privacy questions, please contact:</p>
          <a href="mailto:privacy@tradedaddy.com" className="text-cyan-400 hover:underline font-semibold">
            privacy@tradedaddy.com
          </a>
          <p className="text-sm text-muted-foreground mt-4">Response time: 30 days</p>
        </div>
      </div>
      <LegalFooter />
    </div>
  )
}
