'use client'

import { Suspense } from 'react'
import LoginForm from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginForm />
    </Suspense>
  )
}

function LoginPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 bg-primary rounded animate-pulse" />
          <div className="h-8 w-32 bg-primary rounded animate-pulse" />
        </div>
        <div className="h-96 bg-card rounded-lg border border-border animate-pulse" />
      </div>
    </div>
  )
}
