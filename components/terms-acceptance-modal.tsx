'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export function TermsAcceptanceModal() {
  const [isOpen, setIsOpen] = useState(false)
  const isMountedRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true
    const hasAccepted = localStorage.getItem('termsAccepted_v2')
    if (!hasAccepted && isMountedRef.current) {
      setIsOpen(true)
    }

    return () => {
      isMountedRef.current = false
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('termsAccepted_v2', 'true')
    localStorage.setItem('termsAcceptedDate', new Date().toISOString())
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border-2 border-red-600 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-red-900/20 border-b border-red-700/50 p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">TERMS & LEGAL ACKNOWLEDGMENT</h2>
              <p className="text-sm text-muted-foreground">By using TradeDaddy, you accept the following</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Critical Warning */}
          <div className="bg-red-900/30 border border-red-700/50 p-4 rounded">
            <p className="text-red-400 font-bold mb-2">⚠️ CRITICAL RISK WARNING</p>
            <p className="text-sm text-foreground leading-relaxed">
              Trading involves SUBSTANTIAL RISK OF LOSS. You may lose ALL of your investment and possibly more. Past performance does not guarantee future results. TradeDaddy is NOT a financial advisor and this is EDUCATIONAL CONTENT ONLY.
            </p>
          </div>

          {/* Key Points */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">By using this site, you acknowledge and accept:</h3>
            
            <ul className="space-y-2 text-sm">
              <li className="flex gap-3 items-start">
                <span className="text-red-400 font-bold mt-0.5">•</span>
                <span className="text-foreground leading-relaxed">Trading involves substantial risk of loss - you may lose 100% of your investment</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-red-400 font-bold mt-0.5">•</span>
                <span className="text-foreground leading-relaxed">Signals and analysis provided are for educational purposes only, not financial advice</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-red-400 font-bold mt-0.5">•</span>
                <span className="text-foreground leading-relaxed">You are solely responsible for all trading decisions and any losses</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-red-400 font-bold mt-0.5">•</span>
                <span className="text-foreground leading-relaxed">TradeDaddy assumes no liability for losses, regardless of cause</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-red-400 font-bold mt-0.5">•</span>
                <span className="text-foreground leading-relaxed">You are 18+ and legally permitted to trade in your jurisdiction</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-red-400 font-bold mt-0.5">•</span>
                <span className="text-foreground leading-relaxed">You waive the right to hold TradeDaddy liable for any trading losses</span>
              </li>
            </ul>
          </div>

          {/* Links to Full Terms */}
          <div className="bg-blue-900/20 border border-blue-700/50 p-4 rounded text-sm">
            <p className="text-muted-foreground mb-3">For complete legal information, please review:</p>
            <div className="flex flex-wrap gap-2">
              <a href="/terms" target="_blank" className="text-cyan-400 hover:underline text-xs px-3 py-1 border border-cyan-400/30 rounded">
                Terms of Service
              </a>
              <a href="/privacy" target="_blank" className="text-cyan-400 hover:underline text-xs px-3 py-1 border border-cyan-400/30 rounded">
                Privacy Policy
              </a>
              <a href="/risk-disclosure" target="_blank" className="text-cyan-400 hover:underline text-xs px-3 py-1 border border-cyan-400/30 rounded">
                Risk Disclosure
              </a>
              <a href="/signal-disclaimer" target="_blank" className="text-cyan-400 hover:underline text-xs px-3 py-1 border border-cyan-400/30 rounded">
                Signal Disclaimer
              </a>
            </div>
          </div>

          {/* Final Statement */}
          <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded">
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-semibold">By clicking "I Accept & Continue" below, you confirm that:</span> You have read and understood these terms and all associated legal documents. You understand and accept all risks of trading. You assume full responsibility for your trading decisions. You will not hold TradeDaddy liable for losses.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border p-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              if (confirm('You must accept these terms to use TradeDaddy. Are you sure you want to exit?')) {
                window.location.href = 'https://www.google.com'
              }
            }}
          >
            Decline & Exit
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-6"
            onClick={handleAccept}
          >
            I Accept & Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
