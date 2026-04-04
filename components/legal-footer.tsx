export function LegalFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-border py-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Legal Disclaimers */}
        <div className="grid md:grid-cols-2 gap-4 text-xs text-muted-foreground font-mono">
          <div className="space-y-2">
            <p className="text-red-500 font-semibold">⚠ Risk Warning:</p>
            <p>Trading involves substantial risk of loss. You may lose all your investment.</p>
          </div>
          <div className="space-y-2">
            <p className="text-yellow-500 font-semibold">⚠ No Financial Advice:</p>
            <p>TradeDaddy does not provide financial or trading advice. Education only.</p>
          </div>
          <div className="space-y-2">
            <p className="text-blue-500 font-semibold">⚠ Signals Not Guarantees:</p>
            <p>Signals are not guaranteed to be profitable. Past performance ≠ future results.</p>
          </div>
          <div className="space-y-2">
            <p className="text-cyan-500 font-semibold">⚠ You Assume All Risk:</p>
            <p>You alone are responsible for trading decisions and any losses.</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="border-t border-border pt-6 flex flex-wrap gap-4 text-xs justify-center">
          <a href="/terms" className="text-cyan-400 hover:underline">
            Terms of Service
          </a>
          <span className="text-muted-foreground">|</span>
          <a href="/privacy" className="text-cyan-400 hover:underline">
            Privacy Policy
          </a>
          <span className="text-muted-foreground">|</span>
          <a href="/risk-disclosure" className="text-cyan-400 hover:underline">
            Risk Disclosure
          </a>
          <span className="text-muted-foreground">|</span>
          <a href="/signal-disclaimer" className="text-cyan-400 hover:underline">
            Signal Disclaimer
          </a>
          <span className="text-muted-foreground">|</span>
          <a href="/legal" className="text-cyan-400 hover:underline">
            Legal
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>© TradeDaddy {currentYear}. All Rights Reserved.</p>
          <p className="mt-2">Jurisdiction: South Africa</p>
        </div>
      </div>
    </footer>
  )
}
