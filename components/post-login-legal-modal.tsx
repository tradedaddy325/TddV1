'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

export function PostLoginLegalModal({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkAcceptance = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data } = await supabase
          .from('legal_acceptances')
          .select('id')
          .eq('user_id', userId)
          .single()

        if (!data) {
          setIsOpen(true)
        }
      } catch (err) {
        setIsOpen(true)
      }
    }

    checkAcceptance()
  }, [userId])

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { error } = await supabase.from('legal_acceptances').insert({
        user_id: userId,
        terms_version: 'v1',
        signal_disclaimer_accepted: true,
        risk_disclosure_accepted: true,
        privacy_policy_accepted: true,
        user_agent: navigator.userAgent,
      })

      if (error) throw error

      setIsOpen(false)
    } catch (err) {
      console.error('[v0] Legal acceptance error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border-2 border-red-600 rounded-lg max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="bg-red-900/20 border-b border-red-700/50 p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
            <h2 className="text-2xl font-bold text-foreground">Legal Acceptance Required</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <p className="text-foreground leading-relaxed">
            Before proceeding, please review and accept our legal terms:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-900/20 border border-blue-700/30 rounded">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Terms of Service</p>
                <a href="/terms" target="_blank" className="text-cyan-400 hover:underline text-sm">
                  Review Full Terms
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-900/20 border border-blue-700/30 rounded">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Privacy Policy</p>
                <a href="/privacy" target="_blank" className="text-cyan-400 hover:underline text-sm">
                  Review Privacy Policy
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-700/30 rounded">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Risk Disclosure</p>
                <a href="/risk-disclosure" target="_blank" className="text-cyan-400 hover:underline text-sm">
                  Review Risk Disclosure
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Signal Disclaimer</p>
                <a href="/signal-disclaimer" target="_blank" className="text-cyan-400 hover:underline text-sm">
                  Review Signal Disclaimer
                </a>
              </div>
            </div>
          </div>

          <div className="bg-red-900/30 border border-red-700/50 p-4 rounded">
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-semibold">By accepting, you confirm:</span> You have read and understood all legal terms and disclaimers. You understand trading involves substantial risk of loss. You accept full responsibility for your trading decisions. You waive the right to hold TradeDaddy liable for losses.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-background border-t border-border p-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            disabled={isLoading}
            onClick={() => window.location.href = '/'}
          >
            Decline & Exit
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-6"
            onClick={handleAccept}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'I Accept & Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}
