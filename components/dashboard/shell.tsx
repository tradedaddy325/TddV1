'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import type { Profile } from '@/lib/types'
import { SidebarNavigation } from './sidebar-navigation'

interface DashboardShellProps {
  children: React.ReactNode
  profile: Profile | null
}

export function DashboardShell({ children, profile }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="flex relative">
        {/* Desktop Sidebar Navigation */}
        <div className="hidden lg:block fixed left-0 top-0 h-screen w-64">
          <SidebarNavigation 
            isOpen={true}
            onClose={() => {}}
            isMobile={false}
          />
        </div>

        {/* Mobile Sidebar Navigation */}
        <div className="lg:hidden">
          <SidebarNavigation 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isMobile={true}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:ml-64">
          {/* Mobile Header */}
          <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-card border-b border-border lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-900 rounded transition-colors"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <span className="text-lg font-bold text-primary">TRADEDADDY</span>
            <div className="w-10" />
          </header>

          {/* Page Content */}
          <div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
