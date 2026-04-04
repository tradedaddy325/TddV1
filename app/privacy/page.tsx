'use client'

import { LegalFooter } from '@/components/legal-footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-2 font-mono">PRIVACY POLICY</h1>
        <p className="text-muted-foreground text-sm mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-invert max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. INFORMATION WE COLLECT</h2>
            
            <div className="mb-6">
              <p className="font-semibold mb-2 text-cyan-400">Account Information:</p>
              <ul className="space-y-1 ml-4 list-disc text-sm">
                <li>Name and email address</li>
                <li>Phone number and password (hashed, never stored in plain text)</li>
                <li>Profile picture and account preferences</li>
                <li>Subscription level</li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="font-semibold mb-2 text-cyan-400">Trading Information:</p>
              <ul className="space-y-1 ml-4 list-disc text-sm">
                <li>Trading history and performance</li>
                <li>Trade journal entries and risk preferences</li>
                <li>Asset preferences, watchlists and alerts</li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="font-semibold mb-2 text-cyan-400">Technical Information:</p>
              <ul className="space-y-1 ml-4 list-disc text-sm">
                <li>IP address, device type and model</li>
                <li>Browser type and version</li>
                <li>Pages visited, time spent on platform</li>
                <li>Interaction data, cookies and tracking data</li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="font-semibold mb-2 text-cyan-400">Payment Information:</p>
              <ul className="space-y-1 ml-4 list-disc text-sm">
                <li>Payment method (stored securely via YOCO only)</li>
                <li>Transaction history and billing address</li>
                <li>Subscription status</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2 text-cyan-400">Communications:</p>
              <ul className="space-y-1 ml-4 list-disc text-sm">
                <li>Support messages and email communications</li>
                <li>Chat logs and feedback</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. HOW WE USE YOUR INFORMATION</h2>
            
            <div className="mb-6">
              <p className="font-semibold mb-2">To Provide Services:</p>
              <ul className="space-y-1 ml-4 list-disc text-sm">
                <li>Account management and authentication</li>
                <li>Delivering signals and analysis</li>
                <li>Processing payments and providing technical support</li>
                <li>Improving platform functionality</li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="font-semibold mb-2">For Analytics:</p>
              <ul className="space-y-1 ml-4 list-disc text-sm">
                <li>Understanding user behavior and user experience</li>
                <li>Identifying popular features</li>
                <li>Detecting fraud or abuse</li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="font-semibold mb-2">For Marketing (with opt-out):</p>
              <ul className="space-y-1 ml-4 list-disc text-sm">
                <li>Sending service updates and promotional communications</li>
                <li>Newsletter distribution</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">Legal Compliance:</p>
              <ul className="space-y-1 ml-4 list-disc text-sm">
                <li>Complying with legal obligations</li>
                <li>Preventing fraud or illegal activity</li>
                <li>Enforcing terms of service and protecting user safety</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. DATA SECURITY</h2>
            <p className="font-semibold mb-2">We protect your data through:</p>
            <ul className="space-y-1 ml-4 list-disc text-sm mb-4">
              <li>SSL/TLS encryption (HTTPS)</li>
              <li>Password hashing (industry standard)</li>
              <li>Secure API endpoints and regular security audits</li>
              <li>Access controls and secure payment processing via YOCO</li>
              <li>Two-factor authentication option</li>
            </ul>
            <p className="font-semibold mb-2">We do NOT:</p>
            <ul className="space-y-1 ml-4 list-disc text-sm">
              <li>Store complete credit card information</li>
              <li>Store unencrypted passwords</li>
              <li>Share data with unauthorized parties</li>
              <li>Sell data to third parties</li>
              <li>Use data for unauthorized purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. DATA RETENTION</h2>
            <p className="mb-3">We retain your data for:</p>
            <ul className="space-y-1 ml-4 list-disc text-sm mb-4">
              <li>12 months after account deletion (to prevent fraud)</li>
              <li>Transaction records indefinitely (tax compliance)</li>
              <li>Cookies: 1 year (with user preference option)</li>
              <li>Support tickets: 2 years</li>
              <li>Analytics: 1 year (aggregated, anonymized)</li>
            </ul>
            <p className="text-sm">You can request data deletion, subject to legal requirements.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. YOUR RIGHTS</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="space-y-1 ml-4 list-disc text-sm mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt out of marketing</li>
              <li>Restrict data use</li>
              <li>Lodge complaints with authorities</li>
            </ul>
            <p className="text-sm">To exercise rights, contact: privacy@tradedaddy.com</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. THIRD-PARTY SHARING</h2>
            <p className="mb-3">We share data with:</p>
            <ul className="space-y-1 ml-4 list-disc text-sm mb-4">
              <li>YOCO (payment processing only)</li>
              <li>Analytics providers (anonymized)</li>
              <li>Legal authorities (when required)</li>
              <li>Service providers (email, hosting)</li>
            </ul>
            <p className="font-semibold text-yellow-400">We do NOT sell data to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. CONTACT US</h2>
            <p className="mb-2">For privacy questions:</p>
            <ul className="space-y-1 ml-4 text-sm">
              <li>Email: privacy@tradedaddy.com</li>
              <li>Response time: 30 days</li>
            </ul>
          </section>
        </div>
      </div>
      <LegalFooter />
    </div>
  )
}
