"use client"

import { useState, useEffect } from "react"
import { User, Zap, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import useSWR, { mutate } from "swr"
import type { Profile } from "@/lib/types"

const fetcher = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) throw error
  return { ...data, email: user.email } as Profile & { email: string }
}

export default function AccountPage() {
  const { data: profile, isLoading } = useSWR("profile", fetcher)
  const [isUpdating, setIsUpdating] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState("")

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "")
      setUsername(profile.username || "")
    }
  }, [profile])

  const handleUpdateProfile = async () => {
    if (!profile) return
    setIsUpdating(true)

    const supabase = createClient()
    await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        username: username,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)

    mutate("profile")
    setIsUpdating(false)
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "free":
        return <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">FREE</Badge>
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
        <p className="animate-pulse font-mono text-terminal-green">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-2 border-accent">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="bg-accent text-background">
                {profile?.display_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={profile?.email || ""}
                disabled
                className="border-border opacity-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Member Since</Label>
              <Input
                value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ""}
                disabled
                className="border-border opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-accent/30 bg-accent/5 p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-accent" />
              <div>
                <p className="font-medium">Available Credits</p>
                <p className="text-sm text-muted-foreground">Use credits for AI analysis</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-accent">{profile?.credits || 0}</span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-accent/30 bg-accent/5 p-4">
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-accent" />
              <div>
                <p className="font-medium">Subscription Tier</p>
                <p className="text-sm text-muted-foreground">Your current plan</p>
              </div>
            </div>
            {getTierBadge(profile?.subscription_tier || "free")}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              onClick={handleUpdateProfile}
              disabled={isUpdating}
              className="bg-accent text-background hover:bg-accent/90"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
