import { createClient } from '@/lib/supabase/server'
import { ensureLegalAcceptancesTableExists } from '@/lib/supabase/init-legal-table'
import { DashboardShell } from '@/components/dashboard/shell'
import type { Profile } from '@/lib/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Initialize legal acceptances table on first load
  await ensureLegalAcceptancesTableExists()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile: Profile | null = null

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    profile = data as Profile | null
  }

  return (
    <DashboardShell profile={profile}>
      {children}
    </DashboardShell>
  )
}
