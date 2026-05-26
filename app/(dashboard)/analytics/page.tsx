'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { Profile } from '@/lib/types'

export default function AnalyticsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data as Profile)
      }
      setLoading(false)
    }

    getProfile()
  }, [])

  if (loading) {
    return <div className="p-6">Loading analytics...</div>
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Trading performance analytics for {profile?.display_name || 'Trader'}</p>
      </div>

      <div className="grid gap-6">
        {/* Analytics data will display here - only real user data */}
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground">Analytics features coming soon...</p>
        </div>
      </div>
    </div>
  )
}
