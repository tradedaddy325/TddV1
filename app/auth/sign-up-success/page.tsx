import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Mail, CheckCircle } from 'lucide-react'

export default function SignUpSuccessPage() {
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
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl text-foreground">Account Created</CardTitle>
            <CardDescription className="text-muted-foreground">
              Check your email to verify your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-secondary rounded border border-border">
              <Mail className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                We sent a confirmation link to your email. Click the link to activate your trading terminal access.
              </p>
            </div>

            <div className="space-y-2">
              <Link href="/auth/login">
                <Button variant="default" className="w-full">
                  Go to Login
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Didn&apos;t receive the email? Check your spam folder or contact support.
            </p>
          </CardContent>
        </Card>

        {/* Terminal decoration */}
        <div className="mt-8 text-center text-xs text-muted-foreground font-mono">
          <p>TRADEDADDY Terminal v1.0</p>
          <p className="text-primary/50">[AWAITING EMAIL VERIFICATION]</p>
        </div>
      </div>
    </div>
  )
}
