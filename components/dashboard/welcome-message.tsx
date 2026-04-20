'use client'

interface WelcomeMessageProps {
  displayName?: string
}

export function WelcomeMessage({ displayName }: WelcomeMessageProps) {
  return (
    <div className="text-green-400 font-mono text-sm tracking-wider">
      Welcome, {displayName || 'trader'}|
    </div>
  )
}
