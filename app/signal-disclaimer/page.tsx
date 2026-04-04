'use client'

import { LegalFooter } from '@/components/legal-footer'

export default function SignalDisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-2 font-mono">TRADING SIGNALS DISCLAIMER</h1>
        
        <div className="bg-red-900/30 border-2 border-red-600 p-6 rounded-lg mb-8">
          <p className="text-red-400 font-bold text-lg mb-4">⚠️ THESE SIGNALS ARE NOT GUARANTEES</p>
          <p className="text-foreground text-base">
            The trading signals provided by TradeDaddy are NOT investment advice, NOT financial advice, and are NOT trading recommendations. Signals MAY result in losses and may be inaccurate.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-bold mb-4">WHAT SIGNALS ARE NOT</h2>
            <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded space-y-2">
              <ul className="space-y-2 ml-4 list-disc">
                <li>Investment advice or financial advice</li>
                <li>Trading recommendations (legally speaking)</li>
                <li>Guarantees of profit or any positive outcome</li>
                <li>Professionally managed investment advice</li>
                <li>Suitable for all traders or all situations</li>
                <li>A substitute for professional financial advice</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">TRADEDADDY DOES NOT GUARANTEE:</h2>
            <ul className="space-y-2 ml-4 list-disc text-sm">
              <li>Signal accuracy or profitability</li>
              <li>Signal timeliness or relevance</li>
              <li>Market movements or price directions</li>
              <li>Entry or exit prices</li>
              <li>Stop loss effectiveness</li>
              <li>Take profit achievement</li>
              <li>Any trading result whatsoever</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">SIGNALS ARE OPINIONS</h2>
            <div className="bg-blue-900/20 border border-blue-700/50 p-4 rounded space-y-3">
              <p className="font-semibold">All signals represent AI analysis and experienced trader opinions:</p>
              <ul className="space-y-2 ml-4 list-disc text-sm">
                <li>Opinions can be wrong</li>
                <li>Opinions are not facts or guarantees</li>
                <li>Different traders would analyze differently</li>
                <li>You may disagree and should trade accordingly</li>
                <li>Market consensus may contradict the signal</li>
                <li>Signals reflect market conditions at that moment only</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">YOU ASSUME ALL RISK</h2>
            <div className="bg-orange-900/20 border border-orange-700/50 p-4 rounded space-y-3">
              <p className="font-semibold">When you trade based on our signals, you are responsible for:</p>
              <ul className="space-y-2 ml-4 list-disc text-sm">
                <li>Your trading decision (no one forced you to trade)</li>
                <li>Position sizing and risk management</li>
                <li>Your account losses and any financial consequences</li>
                <li>Understanding the risks involved</li>
                <li>All gains and losses from the trade</li>
              </ul>
              <p className="text-sm mt-3 font-semibold text-orange-400">TradeDaddy is not responsible for losses from signals.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">DO NOT TRADE SOLELY BASED ON SIGNALS</h2>
            <p className="mb-3">Before placing any trade:</p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Conduct your own independent research</li>
              <li>Use multiple analysis methods (not just our signals)</li>
              <li>Consider the broader market context</li>
              <li>Consult with professional advisors if needed</li>
              <li>Make your own independent decisions</li>
              <li>Never trade more than you can afford to lose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">PAST PERFORMANCE ≠ FUTURE RESULTS</h2>
            <div className="bg-red-900/20 border border-red-700/50 p-4 rounded space-y-3">
              <p className="font-semibold text-red-400">This is critical:</p>
              <ul className="space-y-2 ml-4 list-disc text-sm">
                <li>Historical signal accuracy does not predict future accuracy</li>
                <li>Market conditions change constantly</li>
                <li>Strategies that worked before stop working</li>
                <li>Unexpected events and crises occur</li>
                <li>Your personal results will vary</li>
                <li>Volatility and liquidity change over time</li>
                <li>Economic conditions and policies shift</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">SIGNAL LIMITATIONS</h2>
            <p className="mb-3">Signals have inherent limitations:</p>
            <ul className="space-y-2 ml-4 list-disc text-sm">
              <li>May expire or become invalid during market gaps</li>
              <li>May be misinterpreted by the trader</li>
              <li>May not account for your personal situation</li>
              <li>May not reflect real-time market changes</li>
              <li>May be affected by low market liquidity</li>
              <li>May be impacted by geopolitical events</li>
              <li>Cannot account for all possible market scenarios</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">MARKET VOLATILITY IMPACT</h2>
            <p>
              Market volatility can cause signals to become invalid quickly. Extreme market conditions, economic news, or geopolitical events can cause rapid and unpredictable price movements that render signals ineffective. Always use risk management tools like stop losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">ACKNOWLEDGMENT</h2>
            <div className="bg-blue-900/20 border border-blue-700/50 p-4 rounded">
              <p className="mb-3 font-semibold">By using our signals, you acknowledge and accept that:</p>
              <ul className="space-y-2 ml-4 list-disc text-sm mb-3">
                <li>Signals are opinions and not guarantees</li>
                <li>Trading involves substantial risk of loss</li>
                <li>You may lose all or more than your investment</li>
                <li>You alone are responsible for your trading decisions</li>
                <li>You are trading at your own risk and expense</li>
                <li>You waive your right to hold TradeDaddy liable for losses</li>
              </ul>
              <p className="text-sm border-t border-blue-700 pt-3">
                By using TradeDaddy signals, you confirm that you have read this disclaimer in full and accept all terms as written.
              </p>
            </div>
          </section>
        </div>
      </div>
      <LegalFooter />
    </div>
  )
}
