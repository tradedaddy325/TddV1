import { Metadata } from 'next'
import { CreditsContent } from '@/components/credits-content'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Credits | TRADEDADDY',
  description: 'Purchase credits for premium features',
}

export default async function CreditsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Credits & Billing</h1>
        <p className="text-muted-foreground mt-2">
          Purchase credits to unlock premium features and advanced tools
        </p>
      </div>

      <CreditsContent />
    </div>
  )
}
