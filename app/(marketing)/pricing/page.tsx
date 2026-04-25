import Link from "next/link"

export const metadata = {
  title: "Pricing — TradeDaddy Terminal",
  description: "Choose the TradeDaddy plan that fits your trading style. Start with a 14-day free trial on any plan.",
}

const plans = [
  {
    name: "SNIPER",
    price: "R199",
    highlight: false,
    badge: null,
    credits: "300",
    features: [
      { label: "300 Credits / month", included: true },
      { label: "Basic Signals (5/week)", included: true },
      { label: "Limited Market Data (30s delay)", included: true },
      { label: "Basic AI Access", included: true },
      { label: "Trade Journal (50 trades)", included: true },
      { label: "Core Calculators (5)", included: true },
      { label: "Academy — Beginner Track", included: true },
      { label: "Economic Calendar", included: true },
      { label: "Daily Intelligence Report", included: false },
      { label: "Advanced Signals (full unlock)", included: false },
      { label: "All 12+ Calculators", included: false },
      { label: "VIP Community Access", included: false },
    ],
    cta: "GET STARTED",
    ctaStyle: "border",
  },
  {
    name: "EXECUTION",
    price: "R399",
    highlight: true,
    badge: "MOST POPULAR",
    credits: "1,200",
    features: [
      { label: "1,200 Credits / month", included: true },
      { label: "Advanced Signals (15+/week)", included: true },
      { label: "Full Market Data (real-time)", included: true },
      { label: "Advanced AI + Daily Intelligence", included: true },
      { label: "Unlimited Trade Journal", included: true },
      { label: "All 12+ Calculators", included: true },
      { label: "Full Academy Access", included: true },
      { label: "Economic Calendar + News", included: true },
      { label: "Daily Intelligence Report", included: true },
      { label: "Priority Email Support", included: true },
      { label: "Signal Performance Tracker", included: true },
      { label: "VIP Community Access", included: false },
    ],
    cta: "START WINNING",
    ctaStyle: "filled",
  },
  {
    name: "DOMINANCE",
    price: "R499",
    highlight: false,
    badge: "PREMIUM",
    credits: "4,000",
    features: [
      { label: "4,000 Credits / month", included: true },
      { label: "Priority Signals (daily + alerts)", included: true },
      { label: "Full + Priority Data", included: true },
      { label: "Priority AI + Full Neural Net", included: true },
      { label: "Unlimited Trade Journal", included: true },
      { label: "All 12+ Calculators", included: true },
      { label: "Full Academy Access", included: true },
      { label: "Economic Calendar + News", included: true },
      { label: "Daily Intelligence Report", included: true },
      { label: "Priority Support (24h response)", included: true },
      { label: "Signal Performance Tracker", included: true },
      { label: "VIP Community Access", included: true },
    ],
    cta: "GO DOMINANT",
    ctaStyle: "border",
  },
]

const faq = [
  {
    q: "Is there a free trial?",
    a: "Yes. All plans include a 14-day free trial. No credit card is required to start.",
  },
  {
    q: "What are credits?",
    a: "Credits power AI queries, signal unlocks, and advanced tools inside the terminal. Each AI analysis costs credits. Credits reset monthly and unused credits do not roll over.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major SA debit and credit cards via Yoco. Bank transfers are available for Dominance subscribers.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. There are no lock-in contracts. You can cancel your subscription from your account settings at any time.",
  },
  {
    q: "Do prices include VAT?",
    a: "All displayed prices are exclusive of VAT. South African VAT (15%) will be added at checkout.",
  },
  {
    q: "Can I upgrade or downgrade mid-month?",
    a: "Yes. Upgrades are immediate and prorated. Downgrades take effect at the end of your billing cycle.",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono">
      <header className="border-b border-[#222] bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3 border-b border-[#1A1A1A]">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#FF6600] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M16 7h6v6" />
                  <path d="m22 7-8.5 8.5-5-5L2 17" />
                </svg>
              </div>
              <span className="text-sm font-bold tracking-[0.2em] text-white">TRADEDADDY</span>
              <span className="text-[10px] text-[#FF6600] border border-[#FF6600]/40 px-1.5 py-0.5 tracking-wider">TERMINAL</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="text-xs text-[#888] hover:text-white px-3 py-1.5 border border-[#333] hover:border-[#555] transition-colors">LOGIN</Link>
              <Link href="/auth/sign-up" className="text-xs bg-[#FF6600] hover:bg-[#FF7722] px-4 py-1.5 text-white transition-colors font-bold tracking-wide">GET ACCESS</Link>
            </div>
          </div>
          <nav className="flex items-center gap-0 text-[11px]">
            <Link href="/features" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-transparent text-[#555] hover:text-[#888]">Features</Link>
            <Link href="/pricing" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-[#FF6600] text-white">Pricing</Link>
            <Link href="/signals" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-transparent text-[#555] hover:text-[#888]">Signals</Link>
            <Link href="/academy" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-transparent text-[#555] hover:text-[#888]">Academy</Link>
            <Link href="/about" className="px-4 py-2.5 border-b-2 transition-colors tracking-wider border-transparent text-[#555] hover:text-[#888]">About</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#555] mb-4">
            <span className="text-[#FF6600]">▶</span>
            <span>SUBSCRIPTION PLANS</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            SIMPLE, TRANSPARENT<br />
            <span className="text-[#FF6600]">PRICING</span>
          </h1>
          <p className="text-sm text-[#777] max-w-lg mx-auto leading-relaxed">
            Start with a 14-day free trial on any plan. No credit card required.
            Cancel any time.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border relative bg-[#0D0D0D] ${
                plan.highlight ? "border-[#FF6600]" : "border-[#1A1A1A]"
              }`}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] px-3 py-0.5 tracking-widest font-bold ${
                    plan.highlight
                      ? "bg-[#FF6600] text-white"
                      : "bg-[#222] text-[#FF6600] border border-[#FF6600]/40"
                  }`}
                >
                  {plan.badge}
                </div>
              )}
              <div className="p-6">
                <div className="border-b border-[#1A1A1A] pb-4 mb-4">
                  <h3 className={`text-sm font-bold tracking-[0.2em] mb-2 ${plan.highlight ? "text-[#FF6600]" : "text-[#888]"}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${plan.highlight ? "text-[#FF6600]" : "text-white"}`}>
                      {plan.price}
                    </span>
                    <span className="text-[#555] text-sm">/mo</span>
                  </div>
                  <p className="text-[10px] text-[#555] mt-1">excl. VAT · billed monthly</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-center gap-2 text-xs">
                      <span className={f.included ? "text-[#FF6600] text-[10px]" : "text-[#333] text-[10px]"}>
                        {f.included ? "▶" : "✕"}
                      </span>
                      <span className={f.included ? "text-[#888]" : "text-[#444]"}>{f.label}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/sign-up"
                  className={`block text-center text-xs font-bold py-2.5 tracking-widest transition-colors ${
                    plan.ctaStyle === "filled"
                      ? "bg-[#FF6600] hover:bg-[#FF7722] text-white"
                      : "border border-[#333] hover:border-[#555] text-[#888] hover:text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 text-center mb-16">
          <p className="text-[11px] text-[#555]">▶ All plans include 14-day free trial — No credit card required</p>
        </div>

        {/* FAQ */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] text-[#FF6600] tracking-widest border-l-2 border-[#FF6600] pl-3">FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faq.map((item) => (
              <div key={item.q} className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
                <h4 className="text-xs font-bold text-white mb-2 tracking-wide">{item.q}</h4>
                <p className="text-[11px] text-[#666] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-[#1A1A1A] mt-16 py-8 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 text-[11px] justify-center">
            <Link href="/legal/terms" className="text-[#555] hover:text-[#FF6600] transition-colors">Terms of Service</Link>
            <Link href="/legal/privacy" className="text-[#555] hover:text-[#FF6600] transition-colors">Privacy Policy</Link>
            <Link href="/legal/risk" className="text-[#555] hover:text-[#FF6600] transition-colors">Risk Disclosure</Link>
            <Link href="/legal/disclaimer" className="text-[#555] hover:text-[#FF6600] transition-colors">Signal Disclaimer</Link>
          </div>
          <p className="text-center text-[11px] text-[#333] mt-4">© TradeDaddy 2026. All Rights Reserved. Jurisdiction: South Africa</p>
        </div>
      </footer>
    </div>
  )
}
