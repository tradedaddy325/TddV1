'use client'

import { LegalFooter } from '@/components/legal-footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-2 font-mono">TERMS OF SERVICE</h1>
        <p className="text-muted-foreground text-sm mb-8">Effective Date: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-invert max-w-none space-y-6 text-foreground">
          <div className="bg-red-900/20 border border-red-700/50 p-4 rounded text-sm mb-8">
            <p className="text-red-400 font-semibold mb-2">IMPORTANT - PLEASE READ CAREFULLY</p>
            <p>
              PLEASE READ THESE TERMS CAREFULLY BEFORE ACCESSING OR USING TRADEDADDY. BY ACCESSING, BROWSING, OR USING TRADEDADDY, YOU AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS. IF YOU DO NOT AGREE TO ABIDE BY THE ABOVE, PLEASE DO NOT USE THIS SERVICE.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4">1. DEFINITIONS</h2>
            <ul className="space-y-2 ml-4">
              <li><span className="text-cyan-400">"Platform"</span> - The TradeDaddy website, mobile application, and services</li>
              <li><span className="text-cyan-400">"User"</span> - Any person accessing the Platform</li>
              <li><span className="text-cyan-400">"Signals"</span> - Trading recommendations or analysis provided by TradeDaddy</li>
              <li><span className="text-cyan-400">"Services"</span> - All features, tools, content, and functionality provided</li>
              <li><span className="text-cyan-400">"Content"</span> - All information, data, analysis, opinions, signals, and materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. USE LICENSE</h2>
            <p className="mb-3">TradeDaddy grants you a limited, non-exclusive, non-transferable license to use the Platform for your personal, non-commercial trading purposes only.</p>
            <p className="font-semibold mb-2">You agree NOT to:</p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Reproduce, duplicate, copy, sell, or resell any portion of the Platform</li>
              <li>Use the Platform to engage in any illegal activity</li>
              <li>Access the Platform using automated means (bots, scrapers)</li>
              <li>Reverse engineer or attempt to derive source code</li>
              <li>Interfere with or disrupt the Platform's operation</li>
              <li>Use the Platform on behalf of others without permission</li>
              <li>Remove or alter any proprietary notices</li>
              <li>Use the Platform for commercial purposes without written permission</li>
              <li>Share your account credentials with others</li>
              <li>Access the Platform from sanctioned countries or regions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. DISCLAIMER OF INVESTMENT ADVICE</h2>
            <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded mb-4">
              <p className="text-yellow-400 font-semibold mb-2">IMPORTANT: TRADEDADDY DOES NOT PROVIDE FINANCIAL, INVESTMENT, OR TRADING ADVICE.</p>
              <p className="text-sm">
                The information and signals provided are for EDUCATIONAL AND INFORMATIONAL PURPOSES ONLY and should not be construed as investment advice, financial advice, trading recommendations, or any guarantee of profit or loss.
              </p>
            </div>
            <p className="font-semibold mb-2">YOU ALONE ARE RESPONSIBLE FOR:</p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Evaluating the merits and risks of any trade</li>
              <li>Making your own independent investment decisions</li>
              <li>Consulting with a professional financial advisor</li>
              <li>Understanding that trading involves substantial risk of loss</li>
              <li>All gains and losses resulting from your trades</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. NO WARRANTIES</h2>
            <p className="mb-3 font-semibold">THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.</p>
            <p className="font-semibold mb-2">TRADEDADDY MAKES NO WARRANTY THAT:</p>
            <ul className="space-y-1 ml-4 list-disc text-sm">
              <li>The Platform will be uninterrupted or error-free</li>
              <li>The Platform will be secure or safe</li>
              <li>Signals will be accurate or timely</li>
              <li>Information will be complete or correct</li>
              <li>Any trading strategy will be profitable</li>
              <li>Any forecasts will come true</li>
              <li>Technical indicators will perform as expected</li>
              <li>Market conditions will remain stable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. LIMITATION OF LIABILITY</h2>
            <p className="font-semibold mb-3 text-red-400">IN NO EVENT SHALL TRADEDADDY, ITS OWNERS, OPERATORS, MANAGERS, EMPLOYEES, AGENTS, AFFILIATES, OR PARTNERS BE LIABLE FOR:</p>
            <ul className="space-y-1 ml-4 list-disc text-sm">
              <li>Any direct, indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, or income</li>
              <li>Loss of business opportunities or use of data</li>
              <li>Any trading losses or performance issues</li>
              <li>Market downturns or adverse price movements</li>
              <li>Technical glitches or server failures</li>
              <li>Unauthorized access to your account or loss of funds</li>
            </ul>
            <p className="text-sm mt-3">Your sole remedy for dissatisfaction with the Platform is to discontinue use and request a refund of prepaid fees.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. PAYMENT AND REFUNDS</h2>
            <div>
              <p className="font-semibold mb-2">Payment Terms:</p>
              <ul className="space-y-1 ml-4 list-disc text-sm mb-4">
                <li>Payments processed through YOCO (PCI compliant)</li>
                <li>Monthly subscriptions auto-renew unless canceled</li>
                <li>Cancellation effective end of billing period</li>
                <li>All sales are final unless refund policy applies</li>
              </ul>
              <p className="font-semibold mb-2">Refund Policy:</p>
              <ul className="space-y-1 ml-4 list-disc text-sm">
                <li>7-day money-back guarantee for new subscriptions</li>
                <li>Refund request must be made within 7 days of purchase</li>
                <li>Refunds processed within 5-10 business days</li>
                <li>Signals and educational content are non-refundable</li>
                <li>Chargeback attempts void all services</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. INDEMNIFICATION</h2>
            <p>
              You agree to indemnify and hold harmless TradeDaddy and its officers, employees, agents, and successors from any claims, damages, losses, liabilities, and expenses arising from your use of the Platform, your trading based on signals, violations of these terms, violations of applicable laws, or infringement of third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. TERMINATION</h2>
            <p className="font-semibold mb-2">TradeDaddy may, at its sole discretion, suspend or terminate your account and take legal action for violations of these terms.</p>
            <p className="font-semibold mb-2">Reasons for termination include:</p>
            <ul className="space-y-1 ml-4 list-disc text-sm">
              <li>Violation of these terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Abusive behavior or non-payment</li>
              <li>Geographic restrictions or regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. ENTIRE AGREEMENT</h2>
            <p>
              These Terms of Service, along with the Privacy Policy and other posted policies, constitute the entire agreement between you and TradeDaddy regarding your use of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. GOVERNING LAW</h2>
            <p>
              These terms are governed by the laws of South Africa and you agree to exclusive jurisdiction of South African courts.
            </p>
          </section>
        </div>
      </div>
      <LegalFooter />
    </div>
  )
}
