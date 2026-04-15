'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Globe,
  TrendingUp,
  Brain,
  Zap,
  BookOpen,
  Users,
  User,
  MessageCircle,
  Lock,
  Search,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  locked?: boolean
  expandable?: boolean
  children?: Omit<NavItem, 'icon' | 'locked' | 'expandable' | 'children'>[]
}

const navigationItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Macro Desk', href: '/macro', icon: Globe, locked: true },
  { title: 'Predictive Markets', href: '/predictive-markets', icon: TrendingUp },
  { title: 'Market Psychology', href: '/market-psychology', icon: Brain },
  { title: 'Strings', href: '/strings', icon: MessageCircle },
  {
    title: 'Signals',
    icon: TrendingUp,
    expandable: true,
    children: [
      { title: 'Signals & Setups', href: '/signals/setups' },
      { title: 'AI Signals', href: '/signals/ai' },
      { title: 'News Signals', href: '/signals/news' },
      { title: 'Gap Signals', href: '/signals/gaps' },
      { title: 'Earnings Signals', href: '/signals/earnings' },
    ]
  },
  {
    title: 'Trading Tools',
    icon: Zap,
    expandable: true,
    children: [
      { title: 'Risk Calculator', href: '/tools/risk-calculator' },
      { title: 'Trading Sessions', href: '/tools/session-times' },
      { title: 'Economic Calendar', href: '/tools/calendar' },
      { title: 'Market Heatmap', href: '/tools/heatmap' },
      { title: 'Market News', href: '/tools/news' },
      { title: 'Charting', href: '/charting' },
      { title: 'Trade Journal', href: '/journal' },
      { title: 'Copy Trade Daddy\'s Strategy', href: '/tools/copy-strategy' },
      { title: 'Trade Copier Setup', href: '/tools/trade-copier' },
    ]
  },
  { title: 'Learn', href: '/academy', icon: BookOpen },
  { title: 'Community', href: '/community', icon: Users },
  { title: 'Profile', href: '/profile', icon: User },
  { title: 'Traders Talk Room', href: '/traders-talk', icon: MessageCircle },
]

interface SidebarNavigationProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

export function SidebarNavigation({ isOpen, onClose, isMobile }: SidebarNavigationProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Signals', 'Trading Tools'])

  const toggleExpand = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  const isActive = (href?: string) => {
    if (!href) return false
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const renderNavItem = (item: NavItem, depth = 0) => {
    const active = isActive(item.href)
    const Icon = item.icon
    const isExpanded = expandedItems.includes(item.title)

    if (item.expandable) {
      return (
        <div key={item.title}>
          <button
            onClick={() => toggleExpand(item.title)}
            className={cn(
              'w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg transition-all',
              'text-gray-300 hover:bg-gray-900/50',
              depth > 0 && 'pl-8 text-sm'
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-gray-500" />
              <span className="font-medium">{item.title}</span>
            </div>
            <ChevronDown className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')} />
          </button>
          {isExpanded && item.children && (
            <div className="space-y-1 mt-1">
              {item.children.map(child => renderNavItem({ ...child, icon: () => null }, depth + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.href}
        href={item.href || '#'}
        onClick={isMobile ? onClose : undefined}
        className={cn(
          'flex items-center justify-between gap-3 px-4 py-2 rounded-lg transition-all group relative',
          active
            ? 'bg-gray-900/80 border-l-4 border-green-500 text-green-400'
            : 'text-gray-300 hover:bg-gray-900/50 border-l-4 border-transparent',
          depth > 0 && 'pl-8 text-sm',
          item.locked && 'opacity-75'
        )}
      >
        <div className="flex items-center gap-3">
          {item.icon && <Icon className={cn('w-5 h-5', active ? 'text-green-400' : 'text-gray-500')} />}
          <span className="font-medium">{item.title}</span>
        </div>
        {item.locked && (
          <Lock className="w-4 h-4 text-gray-600 flex-shrink-0" />
        )}
      </Link>
    )
  }

  // Desktop sidebar
  if (!isMobile) {
    return (
      <aside className="fixed left-0 top-12 h-[calc(100vh-48px)] w-64 bg-black border-r border-gray-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Terminal</h2>
          <p className="text-xs text-gray-500 mt-1">Powered by V0</p>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-1.5 bg-gray-900 border border-gray-800 rounded text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-700"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
          {navigationItems.map(item => renderNavItem(item))}
        </nav>
      </aside>
    )
  }

  // Mobile overlay
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="absolute left-0 top-0 h-full w-64 bg-black border-r border-gray-800 flex flex-col shadow-lg">
        {/* Header with close */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Menu</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-900 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
          {navigationItems.map(item => renderNavItem(item))}
        </nav>
      </aside>
    </div>
  )
}
