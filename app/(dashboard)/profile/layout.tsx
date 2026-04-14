"use client"

import { User, CreditCard, Crown, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: "/profile/account", label: "Account", icon: User },
    { href: "/profile/credits", label: "Credits", icon: CreditCard },
    { href: "/profile/subscription", label: "Subscription", icon: Crown },
    { href: "/profile/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          User Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account, credits, and subscription
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 font-mono text-sm whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* Content */}
      {children}
    </div>
  )
}
