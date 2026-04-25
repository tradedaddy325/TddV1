import { LegalLayout, Section, Para } from "@/components/marketing/LegalLayout"

export const metadata = {
  title: "Risk Disclosure — TradeDaddy",
}

export default function RiskPage() {
  return (
    <LegalLayout title="RISK DISCLOSURE" activeTab="/legal/risk">
      <Section title="IMPORTANT RISK WARNING">
        <Para>
          TRADING IN FINANCIAL INSTRUMENTS INCLUDING FOREX, CFDs, GOLD, INDICES, AND
          CRYPTOCURRENCIES INVOLVES A HIGH DEGREE OF RISK AND IS NOT SUITABLE FOR ALL
          INVESTORS. YOU MAY LOSE ALL OF YOUR INVESTED CAPITAL. PLEASE READ THIS RISK
          DISCLOSURE CAREFULLY BEFORE USING ANY INFORMATION OR TOOLS PROVIDED BY
          TRADEDADDY TERMINAL.
        </Para>
      </Section>

      <Section title="1. GENERAL TRADING RISKS">
        <Para>
          Financial markets are inherently unpredictable. Past performance — whether of an
          asset, a strategy, or a signal — does not guarantee or indicate future results.
          Market prices can move rapidly and against your position, resulting in significant
          or total loss of capital. Leverage amplifies both gains and losses and can result in
          losses that exceed your initial deposit.
        </Para>
      </Section>

      <Section title="2. FOREX RISK">
        <Para>
          Foreign exchange trading involves buying one currency and selling another simultaneously.
          Exchange rates fluctuate continuously due to macroeconomic factors, geopolitical events,
          central bank decisions, and market sentiment. These movements are inherently unpredictable.
          High leverage commonly available in forex markets means that a small movement against
          your position can wipe out your entire account balance.
        </Para>
      </Section>

      <Section title="3. GOLD AND COMMODITY RISK">
        <Para>
          Gold (XAUUSD) and other commodity prices are influenced by global supply and demand,
          US Dollar strength, interest rate expectations, inflation data, and geopolitical risk.
          Gold can experience large intraday moves, especially around major economic data releases
          such as NFP, CPI, and FOMC announcements. TradeDaddy's analysis of Gold is for
          educational purposes only.
        </Para>
      </Section>

      <Section title="4. CRYPTOCURRENCY RISK">
        <Para>
          Cryptocurrency assets are highly volatile and largely unregulated in South Africa.
          They can experience extreme price swings in very short timeframes. Cryptocurrency
          markets operate 24/7 with no circuit breakers. The risk of total loss is significantly
          higher than with traditional regulated financial instruments.
        </Para>
      </Section>

      <Section title="5. LEVERAGE AND MARGIN RISK">
        <Para>
          The use of leverage in trading multiplies both potential profits and potential losses.
          A leveraged position of 1:100 means a 1% move against you results in a 100% loss of
          your margin deposit. Always understand the leverage ratio applied by your broker before
          entering any position. Never trade with money you cannot afford to lose.
        </Para>
      </Section>

      <Section title="6. TECHNOLOGY RISK">
        <Para>
          Electronic trading systems including TradeDaddy Terminal, your broker's platform,
          and internet connectivity can experience outages, delays, and errors. A technology
          failure may prevent you from entering or exiting a position at your intended price.
          You should always have an alternative means to manage or close open positions.
        </Para>
      </Section>

      <Section title="7. NO FINANCIAL ADVICE">
        <Para>
          Nothing on the TradeDaddy Terminal platform constitutes personalised financial advice
          as defined under the Financial Advisory and Intermediary Services Act (FAIS) of South
          Africa. TradeDaddy is not a licensed Financial Services Provider (FSP). All signals,
          AI analysis, market commentary, and educational content are provided for informational
          and educational purposes only.
        </Para>
        <Para>
          Before making any trading decision, you should consider whether trading is appropriate
          for you given your financial situation, investment objectives, and level of experience.
          If you have any doubt, you should seek independent financial advice from a licensed
          FSP in South Africa.
        </Para>
      </Section>

      <Section title="8. YOUR RESPONSIBILITY">
        <Para>
          All trading decisions made using information from the TradeDaddy Terminal are yours
          alone. You are solely responsible for the outcome of those decisions. TradeDaddy
          (Pty) Ltd, its directors, employees, contributors, and affiliates accept no
          responsibility for any trading losses incurred by users of the Platform.
        </Para>
      </Section>
    </LegalLayout>
  )
}
