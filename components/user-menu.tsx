'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, Settings, Coins, LayoutDashboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface UserMenuProps {
  userEmail?: string
  userName?: string
}

export function UserMenu({ userEmail, userName }: UserMenuProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setTimeout(() => {
      router.push('/')
      router.refresh()
    }, 0)
  }

  const initials = userName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'TD'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full border border-accent/30 hover:bg-accent/10"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={userName} />
            <AvatarFallback className="bg-accent/20 text-accent font-mono">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 bg-background border border-accent/30 shadow-lg"
      >
        {/* User Info */}
        <div className="px-2 py-1.5">
          <p className="text-sm font-semibold text-foreground truncate">
            {userName || 'User'}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {userEmail}
          </p>
        </div>

        <DropdownMenuSeparator className="bg-accent/20" />

        {/* Menu Items */}
        <DropdownMenuItem
          onClick={() => router.push('/dashboard')}
          className="cursor-pointer hover:bg-accent/10"
        >
          <LayoutDashboard className="mr-2 h-4 w-4 text-accent" />
          <span>Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/credits')}
          className="cursor-pointer hover:bg-accent/10"
        >
          <Coins className="mr-2 h-4 w-4 text-accent" />
          <span>Credits & Billing</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/settings')}
          className="cursor-pointer hover:bg-accent/10"
        >
          <Settings className="mr-2 h-4 w-4 text-accent" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-accent/20" />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-400 hover:bg-red-900/20 focus:bg-red-900/20"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
