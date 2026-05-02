import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { BootScreen } from '@/components/boot-screen'
import { TermsAcceptanceModal } from '@/components/terms-acceptance-modal'
import MobileNavigation from '@/components/layout/MobileNavigation'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'TradeDaddy - Trade Smarter, Trade Better',
  description: 'Advanced trading platform with live market data, AI-powered trade analysis, and professional trading tools',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.svg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#0A0A0A]">
      <body className="font-mono bg-[#0A0A0A] text-white antialiased">
        <BootScreen />
        <TermsAcceptanceModal />
        {children}
        <MobileNavigation />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <SpeedInsights />
      </body>
    </html>
  )
}
