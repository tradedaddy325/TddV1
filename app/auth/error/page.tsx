import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, AlertTriangle } from 'lucide-react'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-primary glow-green">TRADEDADDY</span>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-xl text-foreground">Authentication Error</CardTitle>
            <CardDescription className="text-muted-foreground">
              Something went wrong during authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {params?.error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded">
                <p className="text-sm text-destructive font-mono">
                  Error: {params.error}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Link href="/auth/login">
                <Button variant="default" className="w-full">
                  Try Again
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Terminal decoration */}
        <div className="mt-8 text-center text-xs text-muted-foreground font-mono">
          <p>TRADEDADDY Terminal v1.0</p>
          <p className="text-destructive/50">[ERROR: AUTHENTICATION FAILED]</p>
        </div>
      </div>
    </div>
  )
}
