import { CreditsPageContent } from '@/components/credits-page-content'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
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

  // Fetch user's credit balance
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single()

  // Fetch transaction history
  const { data: transactions } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const totalSpent = transactions?.reduce((sum, t) => {
    return sum + (t.type === 'purchase' ? t.amount : 0)
  }, 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Credits & Billing</h1>
        <p className="text-muted-foreground mt-2">
          Purchase credits to unlock premium features and advanced tools
        </p>
      </div>

      <CreditsPageContent />
    </div>
  )
}
