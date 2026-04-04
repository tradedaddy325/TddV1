'use client'

import { LegalFooter } from '@/components/legal-footer'

export default function RiskDisclosurePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-2 font-mono">RISK DISCLOSURE & WARNING</h1>
        
        <div className="bg-red-900/30 border-2 border-red-600 p-6 rounded-lg mb-8">
          <p className="text-red-400 font-bold text-lg mb-4">⚠️ CRITICAL WARNING</p>
          <p className="text-foreground text-base leading-relaxed">
            TRADING FOREIGN EXCHANGE (FOREX), COMMODITIES, INDICES, CRYPTOCURRENCIES AND OTHER FINANCIAL INSTRUMENTS INVOLVES SUBSTANTIAL RISK OF LOSS. NOT ALL INVESTORS OR TRADERS ARE SUITED FOR TRADING. TRADING IS NOT APPROPRIATE FOR ALL PEOPLE, ESPECIALLY THOSE WHO CANNOT AFFORD TO LOSE MONEY.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-bold mb-4">BEFORE DECIDING TO TRADE, YOU SHOULD CAREFULLY CONSIDER:</h2>
            <ol className="space-y-3 ml-4 list-decimal">
              <li className="text-lg font-semibold">YOUR FINANCIAL SITUATION</li>
              <li className="text-lg font-semibold">YOUR INVESTMENT OBJECTIVES</li>
              <li className="text-lg font-semibold">YOUR RISK TOLERANCE</li>
              <li className="text-lg font-semibold">YOUR EXPERIENCE WITH TRADING</li>
            </ol>
          </section>

          <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded">
            <p className="text-yellow-400 font-semibold mb-2">PAST PERFORMANCE DOES NOT GUARANTEE FUTURE RESULTS</p>
            <p className="text-sm">
              Any historical trading data presented on this platform (including hypothetical results) is NOT an indication of future performance. Market conditions change constantly, and strategies that worked in the past may not work in the future.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4">LEVERAGE AND MARGIN TRADING</h2>
            <div className="bg-red-900/20 border border-red-700/50 p-4 rounded space-y-3">
              <p className="font-semibold text-red-400">CRITICAL RISK: TRADING ON MARGIN AMPLIFIES GAINS AND LOSSES</p>
              <ul className="space-y-2 ml-4 list-disc">
                <li>You could lose more than you deposited</li>
                <li>Leverage is risky and is not suitable for all traders</li>
                <li>You could lose all your investment plus additional amounts</li>
                <li>Margin calls may force liquidation of your positions at a loss</li>
                <li>Interest and fees accumulate during holding periods</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">MARKET VOLATILITY AND RISKS</h2>
            <ul className="space-y-3 ml-4 list-disc">
              <li>
                <span className="font-semibold">Rapid Price Movements:</span> Prices can move rapidly and unpredictably, sometimes moving against you within seconds
              </li>
              <li>
                <span className="font-semibold">Gaps and Slippage:</span> Markets can gap past your stop losses, resulting in losses exceeding your stop level
              </li>
              <li>
                <span className="font-semibold">System Failures:</span> Technical issues, internet outages, or platform problems may prevent you from executing trades or closing positions
              </li>
              <li>
                <span className="font-semibold">Liquidity Risk:</span> Low liquidity can result in wider spreads and difficulty closing positions
              </li>
              <li>
                <span className="font-semibold">Geopolitical Events:</span> News events, economic data releases, and political changes can cause sudden market movements
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">NO GUARANTEED OUTCOMES</h2>
            <div className="space-y-3">
              <p className="font-semibold">THIS PLATFORM DOES NOT GUARANTEE:</p>
              <ul className="space-y-2 ml-4 list-disc text-sm">
                <li>Accuracy of signals, analysis, or market predictions</li>
                <li>Profitability of any trading strategy</li>
                <li>Success of any recommended trades</li>
                <li>Achievement of any financial goals</li>
                <li>Protection from losses</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">COMMON TRADING RISKS</h2>
            <ul className="space-y-3 ml-4 list-disc">
              <li>
                <span className="font-semibold">Emotional Trading:</span> Fear and greed can lead to poor decision-making and loss of capital
              </li>
              <li>
                <span className="font-semibold">Over-Leveraging:</span> Using too much leverage can result in rapid account depletion
              </li>
              <li>
                <span className="font-semibold">Lack of Risk Management:</span> Failing to use stop losses or position sizing can lead to catastrophic losses
              </li>
              <li>
                <span className="font-semibold">Revenge Trading:</span> Attempting to quickly recover losses often results in larger losses
              </li>
              <li>
                <span className="font-semibold">Unrealistic Expectations:</span> Expecting consistent profits leads to disappointment and risky behavior
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">ACKNOWLEDGMENT</h2>
            <div className="bg-blue-900/20 border border-blue-700/50 p-4 rounded">
              <p className="mb-3">
                By accessing this platform, you acknowledge that you understand these risks and accept full responsibility for your trading decisions and any losses that may result.
              </p>
              <p className="text-sm">
                You understand that trading involves SUBSTANTIAL RISK OF LOSS and you may lose MORE than you invest. You understand that you ALONE are responsible for all trading decisions and any losses resulting from those decisions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">PROFESSIONAL CONSULTATION RECOMMENDED</h2>
            <p>
              Before engaging in trading, consider consulting with:
            </p>
            <ul className="space-y-2 ml-4 list-disc mt-3">
              <li>A licensed financial advisor</li>
              <li>An investment professional</li>
              <li>A tax professional for tax implications</li>
              <li>Your current broker or financial institution</li>
            </ul>
          </section>
        </div>
      </div>
      <LegalFooter />
    </div>
  )
}
