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
  BarChart3,
  Brain,
  Lightbulb,
  Users,
  MessageCircle,
  ChevronDown,
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

// V55 mobile menu structure with expandable sections
const mobileMenuItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Macro Desk', href: '/macro', icon: Globe },
  { title: 'Predictive Markets', href: '/markets', icon: BarChart3 },
  { title: 'Market Psychology', href: '/psychology', icon: Brain },
  {
    title: 'Signals',
    icon: TrendingUp,
    expandable: true,
    children: [
      { title: 'Trade Signals', href: '/signals/trades' },
      { title: 'Market Alerts', href: '/signals/alerts' },
    ]
  },
  {
    title: 'Trading Tools',
    icon: Wrench,
    expandable: true,
    children: [
      { title: 'Calculator', href: '/tools/calculator' },
      { title: 'Journal', href: '/journal' },
    ]
  },
  {
    title: 'Learn',
    icon: BookOpen,
    expandable: true,
    children: [
      { title: 'Academy', href: '/academy' },
      { title: 'Resources', href: '/learn/resources' },
    ]
  },
  {
    title: 'Community',
    icon: Users,
    expandable: true,
    children: [
      { title: 'Traders Talk', href: '/traders-talk' },
      { title: 'Groups', href: '/community/groups' },
    ]
  },
  { title: 'Profile', href: '/profile', icon: User },
  { title: 'Traders Talk Room', href: '/traders-talk', icon: MessageCircle },
]

export function DashboardShell({ children, profile }: DashboardShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([])

  const toggleMobileExpand = (title: string) => {
    setExpandedMobileItems(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

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

        {/* Sidebar - Desktop only */}
        <aside
          className={cn(
            'hidden lg:flex fixed inset-y-0 left-0 z-50 flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
            sidebarCollapsed ? 'w-16' : 'w-64',
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
            className="flex items-center justify-center w-full py-2 border-t border-sidebar-border text-sidebar-foreground hover:text-primary transition-colors"
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
          {/* Mobile Menu - V55 Style */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden" style={{ top: '40px' }}>
              {/* Header with close button */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <span className="text-sm text-muted-foreground">BUILT BY TRADERS FOR TRADERS</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Mobile Menu Items - Scrollable */}
              <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {mobileMenuItems.map((item: any) => {
                  const isActive = !item.expandable && (pathname === item.href || pathname.startsWith(`${item.href}/`))
                  const isExpanded = expandedMobileItems.includes(item.title)
                  const Icon = item.icon

                  if (item.expandable) {
                    return (
                      <div key={item.title}>
                        <button
                          onClick={() => toggleMobileExpand(item.title)}
                          className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')} />
                        </button>
                        {isExpanded && (
                          <div className="pl-6 py-1 space-y-1">
                            {item.children.map((child: any) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setSidebarOpen(false)}
                                className="block px-3 py-2 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                              >
                                {child.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                        isActive
                          ? 'bg-accent text-foreground'
                          : 'text-foreground hover:bg-accent'
                      )}
                    >
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span>{item.title}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Chat Button */}
              <div className="px-4 py-4 border-t border-border">
                <Button
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                  onClick={() => {
                    setSidebarOpen(false)
                  }}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat
                </Button>
              </div>
            </div>
          )}

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
            <div className="w-10" />
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
    </div>
  )
}
