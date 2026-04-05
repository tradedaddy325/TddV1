'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  Gauge,
  Brain,
  Eye,
  TrendingUp,
  Wrench,
  BarChart3,
  BookOpen,
  FileText,
  Users,
  CreditCard,
  Settings,
  User,
  ChevronDown,
} from 'lucide-react'

const mainNavItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: 'Free' },
  { title: 'Macro Desk', href: '/macro-desk', icon: Gauge, badge: 'PAID' },
  { title: 'Market Psychology', href: '/market-psychology', icon: Brain },
  { title: 'Predictive Markets', href: '/predictive-markets', icon: Eye },
  { title: 'Signals', href: '/signals', icon: TrendingUp },
  { title: 'Trading Tools', href: '/tools', icon: Wrench },
  { title: 'Charting', href: '/charting', icon: BarChart3 },
  { title: 'Trade Journal', href: '/journal', icon: FileText },
  { title: 'Education Suite', href: '/academy', icon: BookOpen },
  { title: 'Community', href: '/community', icon: Users },
  { title: 'Profile', href: '/profile', icon: User },
]

const profileNavItems = [
  { title: 'Credits', href: '/credits', icon: CreditCard },
  { title: 'Settings', href: '/settings', icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const getActiveLabel = () => {
    for (const item of [...mainNavItems, ...profileNavItems]) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return item.title
      }
    }
    return 'Menu'
  }

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card">
      {/* Main Navigation Dropdown */}
      <DropdownMenu open={openMenu === 'main'} onOpenChange={(open) => setOpenMenu(open ? 'main' : null)}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            {getActiveLabel()}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {mainNavItems.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            return (
              <div key={item.href}>
                <DropdownMenuItem asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 cursor-pointer justify-between',
                      isActive && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded font-semibold',
                        item.badge === 'PAID' ? 'bg-amber-900/50 text-amber-300' : 'bg-green-900/50 text-green-300'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </DropdownMenuItem>
                {index === 0 || index === 4 || index === 10 ? <DropdownMenuSeparator /> : null}
              </div>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Profile Dropdown */}
      <DropdownMenu open={openMenu === 'profile'} onOpenChange={(open) => setOpenMenu(open ? 'profile' : null)}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <User className="w-4 h-4" />
            Account
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {profileNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            return (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 cursor-pointer',
                    isActive && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.title}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
