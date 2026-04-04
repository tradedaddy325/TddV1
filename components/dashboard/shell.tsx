'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Globe,
  Wrench,
  BookOpen,
  FileText,
  User,
  Settings,
  MessageSquare,
  CreditCard,
  Shield,
  Menu,
  X,
  TrendingUp,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { Profile } from '@/lib/types'
import { PriceTicker } from './price-ticker'
import { DashboardNav } from './nav-dropdown'

interface DashboardShellProps {
  children: React.ReactNode
  profile: Profile | null
}

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Macro Hub', href: '/macro', icon: Globe },
  { title: 'Tools', href: '/tools', icon: Wrench },
  { title: 'Journal', href: '/journal', icon: FileText },
  { title: 'Academy', href: '/academy', icon: BookOpen },
  { title: 'AI Chat', href: '/chat', icon: MessageSquare },
]

const bottomNavItems = [
  { title: 'Profile', href: '/profile', icon: User },
  { title: 'Credits', href: '/profile/credits', icon: CreditCard },
  { title: 'Settings', href: '/profile/settings', icon: Settings },
]

export function DashboardShell({ children, profile }: DashboardShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Price Ticker - Top */}
      <PriceTicker />

      <div className="flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/80 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 lg:relative',
            sidebarCollapsed ? 'w-16' : 'w-64',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
          style={{ top: '40px' }}
        >
          {/* Logo */}
          <div className={cn(
            'flex items-center gap-2 px-4 py-4 border-b border-sidebar-border',
            sidebarCollapsed && 'justify-center px-2'
          )}>
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-lg font-bold text-primary glow-green">
                TRADEDADDY
              </span>
            )}
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    sidebarCollapsed && 'justify-center px-2'
                  )}
                  title={sidebarCollapsed ? item.title : undefined}
                >
                  <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </nav>

          {/* User Info & Bottom Nav */}
          <div className="border-t border-sidebar-border px-2 py-4 space-y-1">
            {/* User Credits Badge */}
            {!sidebarCollapsed && profile && (
              <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-sidebar-accent rounded">
                <Zap className="w-4 h-4 text-warning" />
                <span className="text-xs text-sidebar-foreground">
                  {profile.credits} Credits
                </span>
              </div>
            )}

            {bottomNavItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    sidebarCollapsed && 'justify-center px-2'
                  )}
                  title={sidebarCollapsed ? item.title : undefined}
                >
                  <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                </Link>
              )
            })}

            {/* Admin Link */}
            {profile?.is_admin && (
              <Link
                href="/admin"
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors',
                  pathname.startsWith('/admin')
                    ? 'bg-sidebar-accent text-destructive'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive',
                  sidebarCollapsed && 'justify-center px-2'
                )}
                title={sidebarCollapsed ? 'Admin' : undefined}
              >
                <Shield className={cn('w-5 h-5 flex-shrink-0', pathname.startsWith('/admin') && 'text-destructive')} />
                {!sidebarCollapsed && <span>Admin</span>}
              </Link>
            )}
          </div>

          {/* Collapse Toggle (Desktop) */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex items-center justify-center w-full py-2 border-t border-sidebar-border text-sidebar-foreground hover:text-primary transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-40px)]" style={{ marginTop: '40px' }}>
          {/* Mobile Header */}
          <header className="sticky top-10 z-30 flex items-center justify-between px-4 py-3 bg-card border-b border-border lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <span className="text-lg font-bold text-primary glow-green">TRADEDADDY</span>
            <div className="w-10" /> {/* Spacer for centering */}
          </header>

          {/* Desktop Dropdown Navigation */}
          <div className="hidden lg:block">
            <DashboardNav />
          </div>

          {/* Page Content */}
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Close Button */}
      {sidebarOpen && (
        <button
          className="fixed top-14 right-4 z-50 p-2 rounded bg-card border border-border lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
