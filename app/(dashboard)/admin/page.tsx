"use client"

import { useState, useEffect } from "react"
import { Users, CreditCard, TrendingUp, Activity, Search, MoreVertical, Shield, Ban, Zap, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import useSWR from "swr"

interface AdminStats {
  totalUsers: number
  activeSubscriptions: number
  totalRevenue: number
  activeTraders: number
}

interface UserProfile {
  id: string
  username: string
  display_name: string
  email?: string
  credits: number
  subscription_tier: string
  is_admin: boolean
  created_at: string
}

const fetcher = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) return null

  // Fetch all users (admin only)
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  // Calculate stats
  const stats: AdminStats = {
    totalUsers: users?.length || 0,
    activeSubscriptions: users?.filter(u => u.subscription_tier !== "free").length || 0,
    totalRevenue: 0, // Would come from payment provider
    activeTraders: users?.filter(u => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return new Date(u.created_at) > oneWeekAgo
    }).length || 0,
  }

  return { users, stats, isAdmin: true }
}

export default function AdminPage() {
  const { data, isLoading, mutate } = useSWR("admin_data", fetcher)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (data && !data.isAdmin) {
      router.push("/dashboard")
    }
  }, [data, router])

  const filteredUsers = data?.users?.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const updateUserCredits = async (userId: string, amount: number) => {
    const supabase = createClient()
    const user = data?.users?.find(u => u.id === userId)
    if (!user) return

    const newCredits = Math.max(0, user.credits + amount)
    await supabase
      .from("profiles")
      .update({ credits: newCredits })
      .eq("id", userId)

    mutate()
  }

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    const supabase = createClient()
    await supabase
      .from("profiles")
      .update({ is_admin: !isAdmin })
      .eq("id", userId)

    mutate()
  }

  const updateSubscription = async (userId: string, tier: string) => {
    const supabase = createClient()
    const expiresAt = tier !== "free" 
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : null

    await supabase
      .from("profiles")
      .update({ 
        subscription_tier: tier,
        subscription_expires_at: expiresAt,
      })
      .eq("id", userId)

    mutate()
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "free":
        return <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">FREE</Badge>
      case "basic":
        return <Badge variant="outline" className="border-terminal-cyan/30 text-terminal-cyan">BASIC</Badge>
      case "pro":
        return <Badge variant="outline" className="border-terminal-yellow/30 text-terminal-yellow">PRO</Badge>
      case "elite":
        return <Badge className="border-0 bg-gradient-to-r from-terminal-yellow to-amber-500 text-background">ELITE</Badge>
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="animate-pulse font-mono text-terminal-green">Verifying admin access...</p>
      </div>
    )
  }

  if (!data?.isAdmin) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center">
        <Shield className="mb-4 h-16 w-16 text-terminal-red/50" />
        <h2 className="font-mono text-xl font-bold text-terminal-red">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono text-2xl font-bold text-terminal-green">
          {">"} ADMIN_PANEL
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          Manage users, subscriptions, and platform analytics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-terminal-green/20 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-mono text-xs">TOTAL_USERS</CardDescription>
            <Users className="h-4 w-4 text-terminal-green" />
          </CardHeader>
          <CardContent>
            <div className="font-mono text-2xl font-bold text-terminal-green">{data?.stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card className="border-terminal-green/20 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-mono text-xs">ACTIVE_SUBS</CardDescription>
            <Crown className="h-4 w-4 text-terminal-yellow" />
          </CardHeader>
          <CardContent>
            <div className="font-mono text-2xl font-bold text-terminal-yellow">{data?.stats.activeSubscriptions}</div>
          </CardContent>
        </Card>
        <Card className="border-terminal-green/20 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-mono text-xs">MONTHLY_REVENUE</CardDescription>
            <CreditCard className="h-4 w-4 text-terminal-cyan" />
          </CardHeader>
          <CardContent>
            <div className="font-mono text-2xl font-bold text-terminal-cyan">R{data?.stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-terminal-green/20 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-mono text-xs">ACTIVE_7D</CardDescription>
            <Activity className="h-4 w-4 text-terminal-green" />
          </CardHeader>
          <CardContent>
            <div className="font-mono text-2xl font-bold text-terminal-green">{data?.stats.activeTraders}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="users" className="font-mono">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="analytics" className="font-mono">
            <TrendingUp className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-terminal-green/30 pl-10 font-mono"
              />
            </div>
          </div>

          <Card className="border-terminal-green/20 bg-card/50">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-terminal-green/20 hover:bg-transparent">
                    <TableHead className="font-mono text-terminal-green">User</TableHead>
                    <TableHead className="font-mono text-terminal-green">Subscription</TableHead>
                    <TableHead className="font-mono text-terminal-green">Credits</TableHead>
                    <TableHead className="font-mono text-terminal-green">Joined</TableHead>
                    <TableHead className="font-mono text-terminal-green">Status</TableHead>
                    <TableHead className="text-right font-mono text-terminal-green">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: UserProfile) => (
                    <TableRow key={user.id} className="border-terminal-green/10">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-terminal-green/30 bg-terminal-green/10 font-mono text-sm text-terminal-green">
                            {user.display_name?.charAt(0) || user.username?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-mono font-medium">{user.display_name || user.username}</p>
                            <p className="text-xs text-muted-foreground">@{user.username}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTierBadge(user.subscription_tier)}</TableCell>
                      <TableCell>
                        <span className="font-mono text-terminal-yellow">{user.credits}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {user.is_admin ? (
                          <Badge className="bg-terminal-red/20 text-terminal-red border-terminal-red/30">ADMIN</Badge>
                        ) : (
                          <Badge variant="outline" className="border-terminal-green/30 text-terminal-green">ACTIVE</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="border-terminal-green/30 bg-background">
                            <DropdownMenuItem onClick={() => updateUserCredits(user.id, 100)}>
                              <Zap className="mr-2 h-4 w-4 text-terminal-yellow" />
                              Add 100 Credits
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateSubscription(user.id, "pro")}>
                              <Crown className="mr-2 h-4 w-4 text-terminal-yellow" />
                              Set Pro Tier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateSubscription(user.id, "elite")}>
                              <Crown className="mr-2 h-4 w-4 text-amber-500" />
                              Set Elite Tier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateSubscription(user.id, "free")}>
                              <Ban className="mr-2 h-4 w-4" />
                              Remove Subscription
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => toggleAdmin(user.id, user.is_admin)}
                              className={user.is_admin ? "text-terminal-red" : ""}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              {user.is_admin ? "Remove Admin" : "Make Admin"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-terminal-green/20 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-terminal-green">User Growth</CardTitle>
                <CardDescription>New users over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                  Chart coming soon
                </div>
              </CardContent>
            </Card>
            <Card className="border-terminal-green/20 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-terminal-green">Revenue</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                  Chart coming soon
                </div>
              </CardContent>
            </Card>
            <Card className="border-terminal-green/20 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-terminal-green">Subscription Distribution</CardTitle>
                <CardDescription>Users by subscription tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Free</span>
                    <span className="font-mono text-terminal-green">
                      {data?.users?.filter((u: UserProfile) => u.subscription_tier === "free").length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Basic</span>
                    <span className="font-mono text-terminal-cyan">
                      {data?.users?.filter((u: UserProfile) => u.subscription_tier === "basic").length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pro</span>
                    <span className="font-mono text-terminal-yellow">
                      {data?.users?.filter((u: UserProfile) => u.subscription_tier === "pro").length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Elite</span>
                    <span className="font-mono text-amber-500">
                      {data?.users?.filter((u: UserProfile) => u.subscription_tier === "elite").length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-terminal-green/20 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-terminal-green">AI Usage</CardTitle>
                <CardDescription>Credits consumed this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[150px] items-center justify-center text-muted-foreground">
                  Analytics coming soon
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
