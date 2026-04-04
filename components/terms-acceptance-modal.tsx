'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertTriangle } from 'lucide-react'

export function TermsAcceptanceModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [accepted, setAccepted] = useState({
    riskDisclaimer: false,
    substancialRisk: false,
    signalsNotGuarantee: false,
    notFinancialAdvice: false,
    mayLoseAll: false,
    termsAccepted: false,
    liabilityAccepted: false,
    fullResponsibility: false,
    ageConfirmed: false,
    disputeResolution: false,
    sueLiability: false,
    ownRisk: false,
  })

  useEffect(() => {
    const hasAccepted = localStorage.getItem('termsAccepted_v1')
    if (!hasAccepted) {
      setIsOpen(true)
    }
  }, [])

  const allAccepted = Object.values(accepted).every((v) => v)

  const handleAccept = () => {
    if (allAccepted) {
      localStorage.setItem('termsAccepted_v1', 'true')
      localStorage.setItem('termsAcceptedDate', new Date().toISOString())
      setIsOpen(false)
    }
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
              <h2 className="text-2xl font-bold text-foreground">TERMS & LEGAL ACCEPTANCE</h2>
              <p className="text-sm text-muted-foreground">Please read and accept all terms before proceeding</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Critical Warning */}
          <div className="bg-red-900/30 border border-red-700/50 p-4 rounded">
            <p className="text-red-400 font-bold mb-2">⚠️ CRITICAL WARNING</p>
            <p className="text-sm text-foreground">
              Trading involves SUBSTANTIAL RISK OF LOSS. You may lose ALL of your investment and possibly more. This is not investment advice. You assume all responsibility for trading decisions.
            </p>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="risk1"
                checked={accepted.riskDisclaimer}
                onCheckedChange={(checked) => setAccepted({ ...accepted, riskDisclaimer: !!checked })}
              />
              <label htmlFor="risk1" className="text-sm cursor-pointer flex-1 leading-relaxed">
                I have read and understand the <a href="/risk-disclosure" target="_blank" className="text-cyan-400 hover:underline">Risk Disclaimer</a>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="risk2"
                checked={accepted.substancialRisk}
                onCheckedChange={(checked) => setAccepted({ ...accepted, substancialRisk: !!checked })}
              />
              <label htmlFor="risk2" className="text-sm cursor-pointer flex-1 leading-relaxed">
                I understand trading involves substantial risk of loss
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="signals"
                checked={accepted.signalsNotGuarantee}
                onCheckedChange={(checked) => setAccepted({ ...accepted, signalsNotGuarantee: !!checked })}
              />
              <label htmlFor="signals" className="text-sm cursor-pointer flex-1 leading-relaxed">
                I understand signals are not guarantees and may not be profitable
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="advice"
                checked={accepted.notFinancialAdvice}
                onCheckedChange={(checked) => setAccepted({ ...accepted, notFinancialAdvice: !!checked })}
              />
              <label htmlFor="advice" className="text-sm cursor-pointer flex-1 leading-relaxed">
                I am not relying on TradeDaddy for financial advice - this is educational only
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="loss"
                checked={accepted.mayLoseAll}
                onCheckedChange={(checked) => setAccepted({ ...accepted, mayLoseAll: !!checked })}
              />
              <label htmlFor="loss" className="text-sm cursor-pointer flex-1 leading-relaxed">
                I understand I may lose all my investment
              </label>
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <p className="text-xs text-muted-foreground mb-4 font-semibold">FINAL ACKNOWLEDGMENTS - PLEASE CHECK ALL:</p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={accepted.termsAccepted}
                    onCheckedChange={(checked) => setAccepted({ ...accepted, termsAccepted: !!checked })}
                  />
                  <label htmlFor="terms" className="text-sm cursor-pointer flex-1 leading-relaxed">
                    I accept all <a href="/terms" target="_blank" className="text-cyan-400 hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-cyan-400 hover:underline">Privacy Policy</a>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="liability"
                    checked={accepted.liabilityAccepted}
                    onCheckedChange={(checked) => setAccepted({ ...accepted, liabilityAccepted: !!checked })}
                  />
                  <label htmlFor="liability" className="text-sm cursor-pointer flex-1 leading-relaxed">
                    I accept the limitation of liability clause - TradeDaddy is not liable for losses
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="responsibility"
                    checked={accepted.fullResponsibility}
                    onCheckedChange={(checked) => setAccepted({ ...accepted, fullResponsibility: !!checked })}
                  />
                  <label htmlFor="responsibility" className="text-sm cursor-pointer flex-1 leading-relaxed">
                    I accept full responsibility for my trading decisions and any losses
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="age"
                    checked={accepted.ageConfirmed}
                    onCheckedChange={(checked) => setAccepted({ ...accepted, ageConfirmed: !!checked })}
                  />
                  <label htmlFor="age" className="text-sm cursor-pointer flex-1 leading-relaxed">
                    I am 18+ years old and legally permitted to trade in my jurisdiction
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="dispute"
                    checked={accepted.disputeResolution}
                    onCheckedChange={(checked) => setAccepted({ ...accepted, disputeResolution: !!checked })}
                  />
                  <label htmlFor="dispute" className="text-sm cursor-pointer flex-1 leading-relaxed">
                    I agree to resolve disputes as stated in the terms (South African jurisdiction)
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="sue"
                    checked={accepted.sueLiability}
                    onCheckedChange={(checked) => setAccepted({ ...accepted, sueLiability: !!checked })}
                  />
                  <label htmlFor="sue" className="text-sm cursor-pointer flex-1 leading-relaxed">
                    I waive my right to sue TradeDaddy for trading losses, regardless of cause
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="risk"
                    checked={accepted.ownRisk}
                    onCheckedChange={(checked) => setAccepted({ ...accepted, ownRisk: !!checked })}
                  />
                  <label htmlFor="risk" className="text-sm cursor-pointer flex-1 leading-relaxed">
                    I understand I am trading at my own risk and my own expense
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Final Acknowledgment */}
          <div className="bg-blue-900/20 border border-blue-700/50 p-4 rounded">
            <p className="text-sm text-foreground">
              I acknowledge that I have read and fully understand these terms and disclaimers. I understand that trading involves SUBSTANTIAL RISK OF LOSS and I may lose MORE than I invest. I understand that TradeDaddy provides EDUCATIONAL SIGNALS AND ANALYSIS, not financial advice. I understand that I ALONE AM RESPONSIBLE for all trading decisions and any losses resulting from those decisions. I WAIVE MY RIGHT TO HOLD TRADEDADDY LIABLE for losses, regardless of cause. I am trading at my own risk and my own expense. I accept all terms as written.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border p-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              if (confirm('Are you sure? You will not be able to access TradeDaddy without accepting these terms.')) {
                window.location.href = '/'
              }
            }}
          >
            Decline & Exit
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={!allAccepted}
            onClick={handleAccept}
          >
            {allAccepted ? 'Accept All & Continue' : `Accept All (${Object.values(accepted).filter(Boolean).length}/${Object.keys(accepted).length})`}
          </Button>
        </div>
      </div>
    </div>
  )
}
