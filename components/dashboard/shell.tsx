'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import type { Profile } from '@/lib/types'
import Sidebar from './sidebar'

interface DashboardShellProps {
  children: React.ReactNode
  profile: Profile | null
}

export function DashboardShell({ children, profile }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="flex relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-[#0A0A0A] border-r border-[#1A1A1A]">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50">
            <div className="w-64 h-screen bg-[#0A0A0A] border-r border-[#1A1A1A] overflow-y-auto">
              <Sidebar />
            </div>
            <div 
              className="flex-1"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:ml-64">
          {/* Mobile Header */}
          <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#0D0D0D] border-b border-[#1A1A1A] lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-[#111] rounded transition-colors text-[#FF6600]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-lg font-bold text-[#FF6600] font-mono tracking-wider">TRADEDADDY</span>
            <div className="w-10" />
          </header>

          {/* Page Content */}
          <div className="bg-[#0A0A0A]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
