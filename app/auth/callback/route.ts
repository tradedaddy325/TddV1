import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Redirect to the next page (usually dashboard or the page they were trying to access)
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Return to an error page if something is wrong
  return NextResponse.redirect(new URL('/auth/error', request.url))
}
