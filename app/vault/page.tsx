"use client";

import { useState } from "react";
import { Lock, Star, TrendingUp, BarChart3, Zap, Shield } from "lucide-react";
import Link from "next/link";

interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  coming_soon?: boolean;
}

const premiumFeatures: PremiumFeature[] = [
  {
    id: "advanced-analytics",
    title: "Advanced Analytics",
    description: "Deep dive into your trading performance with AI-powered insights",
    icon: BarChart3,
    features: [
      "Equity curve analysis",
      "Monte Carlo simulations",
      "Drawdown analysis",
      "Risk metrics dashboard",
    ],
  },
  {
    id: "signals",
    title: "Trading Signals",
    description: "Real-time AI-generated trading signals based on market analysis",
    icon: TrendingUp,
    features: [
      "Real-time alerts",
      "Multi-timeframe analysis",
      "Custom watchlists",
      "Signal backtest results",
    ],
  },
  {
    id: "api-access",
    title: "API Access",
    description: "Integrate Trade Daddy data into your trading systems",
    icon: Zap,
    features: [
      "REST API access",
      "WebSocket streams",
      "Custom integrations",
      "Priority support",
    ],
    coming_soon: true,
  },
  {
    id: "portfolio-guard",
    title: "Portfolio Guard (AI)",
    description: "AI-powered risk management and portfolio optimization",
    icon: Shield,
    features: [
      "Automated risk alerts",
      "Position sizing recommendations",
      "Correlation analysis",
      "Hedging suggestions",
    ],
    coming_soon: true,
  },
];

const pricingPlans = [
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For serious traders",
    features: [
      "Advanced Analytics",
      "Trading Signals",
      "Priority support",
      "Custom reports",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Elite",
    price: "$99",
    period: "per month",
    description: "For institutions",
    features: [
      "Everything in Pro",
      "API Access (Beta)",
      "Portfolio Guard",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Upgrade to Elite",
    popular: false,
  },
];

export default function VaultPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Premium Vault</h1>
          </div>
          <p className="text-green-100 text-lg max-w-2xl">
            Unlock advanced features designed for professional traders. Real-time signals, AI analytics, and institutional-grade tools.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Premium Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-100 mb-8">What&apos;s Inside</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="relative bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-colors group"
                >
                  {feature.coming_soon && (
                    <div className="absolute top-4 right-4 bg-yellow-500/20 border border-yellow-500 text-yellow-400 text-xs px-2 py-1 rounded">
                      Coming Soon
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-600/20 rounded-lg">
                      <Icon className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-100">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-400 mb-4">
                    {feature.description}
                  </p>

                  <ul className="space-y-2">
                    {feature.features.map((f) => (
                      <li key={f} className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="w-1 h-1 bg-green-400 rounded-full" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-100 mb-2">Upgrade Your Trading</h2>
          <p className="text-gray-400 mb-8">
            Choose the plan that fits your trading style. Upgrade or downgrade anytime.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-lg border-2 p-8 transition-all ${
                  plan.popular
                    ? "border-green-500 bg-gray-800 shadow-lg shadow-green-500/20"
                    : "border-gray-700 bg-gray-800/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-100 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-100">
                    {plan.price}
                  </span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>

                <button
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors mb-6 ${
                    plan.popular
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-100"
                  }`}
                >
                  {plan.cta}
                </button>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-100 mb-8">Frequently Asked</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes, cancel your subscription at any time without penalties. No long-term contracts.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 7-day money-back guarantee. If you&apos;re not satisfied, we&apos;ll refund your first month.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and cryptocurrency payments.",
              },
              {
                q: "Can I upgrade mid-month?",
                a: "Yes! You can upgrade or downgrade anytime. We&apos;ll prorate the charges accordingly.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-green-500 transition-colors"
              >
                <p className="font-semibold text-gray-100 mb-2">{item.q}</p>
                <p className="text-gray-400 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Back to Dashboard */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="text-green-400 hover:text-green-300 font-semibold transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
