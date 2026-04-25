import { LegalLayout, Section, Para } from "@/components/marketing/LegalLayout"

export const metadata = {
  title: "Legal — TradeDaddy",
}

export default function LegalPage() {
  return (
    <LegalLayout title="LEGAL INFORMATION" activeTab="/legal/legal">
      <Section title="COMPANY INFORMATION">
        <Para>
          TradeDaddy Terminal is operated by TradeDaddy (Pty) Ltd, a private company
          incorporated in the Republic of South Africa. Our platform is designed for
          South African retail traders and complies with applicable South African legislation.
        </Para>
      </Section>

      <Section title="REGULATORY STATUS">
        <Para>
          TradeDaddy (Pty) Ltd is NOT a licensed Financial Services Provider (FSP) under the
          Financial Advisory and Intermediary Services Act 37 of 2002 (FAIS). We do not offer
          investment advice, portfolio management, or financial intermediary services as defined
          under FAIS. Our platform is an educational technology product only.
        </Para>
        <Para>
          If you require licensed financial advice, please consult a registered FSP. You can
          verify FSP registration on the FSCA website: fsca.co.za
        </Para>
      </Section>

      <Section title="APPLICABLE LEGISLATION">
        <Para>
          Our operations are subject to, and we aim to comply with, the following South African
          legislation: Protection of Personal Information Act 4 of 2013 (POPIA); Electronic
          Communications and Transactions Act 25 of 2002 (ECTA); Consumer Protection Act 68 of
          2008 (CPA); and Companies Act 71 of 2008.
        </Para>
      </Section>

      <Section title="DISPUTE RESOLUTION">
        <Para>
          In the event of a dispute, we encourage users to contact us at legal@tradedaddy.co.za
          in the first instance so that we may attempt to resolve the matter amicably. If a
          resolution cannot be reached, disputes shall be referred to arbitration under the
          Arbitration Act 42 of 1965, before referral to the South African courts.
        </Para>
      </Section>

      <Section title="LIMITATION OF LIABILITY">
        <Para>
          To the fullest extent permitted by South African law, TradeDaddy (Pty) Ltd, its
          directors, shareholders, employees, and agents shall not be liable for any loss or
          damage — direct, indirect, consequential, or otherwise — arising from use of the
          Platform or reliance on any content, signals, or analysis published therein.
        </Para>
      </Section>

      <Section title="INTELLECTUAL PROPERTY">
        <Para>
          The TradeDaddy name, logo, and all platform content are the intellectual property of
          TradeDaddy (Pty) Ltd and may not be reproduced, distributed, or used commercially
          without prior written consent.
        </Para>
      </Section>

      <Section title="CONTACT">
        <Para>
          Legal correspondence: legal@tradedaddy.co.za
          General support: support@tradedaddy.co.za
          Jurisdiction: Republic of South Africa
        </Para>
      </Section>
    </LegalLayout>
  )
}
