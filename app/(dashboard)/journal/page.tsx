"use client"

import { useState } from "react"
import { Plus, Filter, Download, TrendingUp, TrendingDown, Calendar, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import useSWR, { mutate } from "swr"

interface JournalEntry {
  id: string
  pair: string
  direction: "long" | "short"
  entry_price: number
  exit_price: number | null
  lot_size: number
  stop_loss: number | null
  take_profit: number | null
  pnl: number | null
  pnl_percent: number | null
  notes: string | null
  tags: string[]
  status: "open" | "closed" | "pending"
  entry_date: string
  exit_date: string | null
}

const fetcher = async () => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .order("entry_date", { ascending: false })
  
  if (error) throw error
  return data as JournalEntry[]
}

export default function JournalPage() {
  const { data: entries, error, isLoading } = useSWR("journal_entries", fetcher)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [newEntry, setNewEntry] = useState({
    pair: "",
    direction: "long" as "long" | "short",
    entry_price: "",
    lot_size: "",
    stop_loss: "",
    take_profit: "",
    notes: "",
    tags: "",
  })

  const handleAddEntry = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const { error } = await supabase.from("journal_entries").insert({
      user_id: user.id,
      pair: newEntry.pair.toUpperCase(),
      direction: newEntry.direction,
      entry_price: parseFloat(newEntry.entry_price),
      lot_size: parseFloat(newEntry.lot_size),
      stop_loss: newEntry.stop_loss ? parseFloat(newEntry.stop_loss) : null,
      take_profit: newEntry.take_profit ? parseFloat(newEntry.take_profit) : null,
      notes: newEntry.notes || null,
      tags: newEntry.tags ? newEntry.tags.split(",").map(t => t.trim()) : [],
      status: "open",
    })

    if (!error) {
      setIsAddDialogOpen(false)
      setNewEntry({
        pair: "",
        direction: "long",
        entry_price: "",
        lot_size: "",
        stop_loss: "",
        take_profit: "",
        notes: "",
        tags: "",
      })
      mutate("journal_entries")
    }
  }

  const closeTrade = async (entryId: string, exitPrice: number) => {
    const supabase = createClient()
    const entry = entries?.find(e => e.id === entryId)
    if (!entry) return

    const pnl = entry.direction === "long" 
      ? (exitPrice - entry.entry_price) * entry.lot_size * 100000 
      : (entry.entry_price - exitPrice) * entry.lot_size * 100000
    const pnlPercent = ((exitPrice - entry.entry_price) / entry.entry_price) * 100

    await supabase.from("journal_entries").update({
      exit_price: exitPrice,
      pnl: pnl,
      pnl_percent: entry.direction === "long" ? pnlPercent : -pnlPercent,
      status: "closed",
      exit_date: new Date().toISOString(),
    }).eq("id", entryId)

    mutate("journal_entries")
  }

  const filteredEntries = entries?.filter(entry => {
    const matchesSearch = entry.pair.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || entry.status === filterStatus
    return matchesSearch && matchesStatus
  }) || []

  const stats = {
    totalTrades: entries?.length || 0,
    winRate: entries?.filter(e => e.status === "closed" && (e.pnl || 0) > 0).length || 0,
    totalPnL: entries?.reduce((sum, e) => sum + (e.pnl || 0), 0) || 0,
    openTrades: entries?.filter(e => e.status === "open").length || 0,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-terminal-green">
            {">"} TRADE_JOURNAL
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Track, analyze, and improve your trading performance
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-terminal-green text-background hover:bg-terminal-green/90">
              <Plus className="mr-2 h-4 w-4" />
              New Trade
            </Button>
          </DialogTrigger>
          <DialogContent className="border-terminal-green/30 bg-background sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-mono text-terminal-green">
                {">"} LOG_NEW_TRADE
              </DialogTitle>
              <DialogDescription>
                Enter your trade details to log it in your journal
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pair">Currency Pair</Label>
                  <Input
                    id="pair"
                    placeholder="EURUSD"
                    value={newEntry.pair}
                    onChange={(e) => setNewEntry({ ...newEntry, pair: e.target.value })}
                    className="border-terminal-green/30 font-mono uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direction">Direction</Label>
                  <Select
                    value={newEntry.direction}
                    onValueChange={(v) => setNewEntry({ ...newEntry, direction: v as "long" | "short" })}
                  >
                    <SelectTrigger className="border-terminal-green/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="long">Long (Buy)</SelectItem>
                      <SelectItem value="short">Short (Sell)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entry_price">Entry Price</Label>
                  <Input
                    id="entry_price"
                    type="number"
                    step="0.00001"
                    placeholder="1.08500"
                    value={newEntry.entry_price}
                    onChange={(e) => setNewEntry({ ...newEntry, entry_price: e.target.value })}
                    className="border-terminal-green/30 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lot_size">Lot Size</Label>
                  <Input
                    id="lot_size"
                    type="number"
                    step="0.01"
                    placeholder="0.10"
                    value={newEntry.lot_size}
                    onChange={(e) => setNewEntry({ ...newEntry, lot_size: e.target.value })}
                    className="border-terminal-green/30 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stop_loss">Stop Loss</Label>
                  <Input
                    id="stop_loss"
                    type="number"
                    step="0.00001"
                    placeholder="1.08200"
                    value={newEntry.stop_loss}
                    onChange={(e) => setNewEntry({ ...newEntry, stop_loss: e.target.value })}
                    className="border-terminal-green/30 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="take_profit">Take Profit</Label>
                  <Input
                    id="take_profit"
                    type="number"
                    step="0.00001"
                    placeholder="1.09000"
                    value={newEntry.take_profit}
                    onChange={(e) => setNewEntry({ ...newEntry, take_profit: e.target.value })}
                    className="border-terminal-green/30 font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Trade rationale, setup, emotions..."
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  className="border-terminal-green/30 font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="breakout, trend, scalp"
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                  className="border-terminal-green/30 font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddEntry}
                className="bg-terminal-green text-background hover:bg-terminal-green/90"
              >
                Log Trade
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-terminal-green/20 bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription className="font-mono text-xs">TOTAL_TRADES</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-2xl font-bold text-terminal-green">{stats.totalTrades}</div>
          </CardContent>
        </Card>
        <Card className="border-terminal-green/20 bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription className="font-mono text-xs">WIN_RATE</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-2xl font-bold text-terminal-cyan">
              {stats.totalTrades > 0 ? ((stats.winRate / stats.totalTrades) * 100).toFixed(1) : 0}%
            </div>
          </CardContent>
        </Card>
        <Card className="border-terminal-green/20 bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription className="font-mono text-xs">TOTAL_PNL</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`font-mono text-2xl font-bold ${stats.totalPnL >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
              ${stats.totalPnL.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-terminal-green/20 bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription className="font-mono text-xs">OPEN_POSITIONS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-2xl font-bold text-terminal-yellow">{stats.openTrades}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search pairs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-terminal-green/30 pl-10 font-mono"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px] border-terminal-green/30">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="border-terminal-green/30">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Trade List */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="list" className="font-mono">List View</TabsTrigger>
          <TabsTrigger value="calendar" className="font-mono">Calendar</TabsTrigger>
          <TabsTrigger value="coach" className="font-mono">AI Coach</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          {isLoading ? (
            <Card className="border-terminal-green/20 bg-card/50">
              <CardContent className="py-8 text-center">
                <p className="animate-pulse font-mono text-terminal-green">Loading trades...</p>
              </CardContent>
            </Card>
          ) : filteredEntries.length === 0 ? (
            <Card className="border-terminal-green/20 bg-card/50">
              <CardContent className="py-8 text-center">
                <p className="font-mono text-muted-foreground">
                  No trades found. Start logging your trades to build your journal.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="border-terminal-green/20 bg-card/50 transition-colors hover:border-terminal-green/40">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded border ${
                          entry.direction === "long" 
                            ? "border-terminal-green/30 bg-terminal-green/10" 
                            : "border-terminal-red/30 bg-terminal-red/10"
                        }`}>
                          {entry.direction === "long" ? (
                            <TrendingUp className="h-5 w-5 text-terminal-green" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-terminal-red" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold">{entry.pair}</span>
                            <Badge variant={entry.status === "open" ? "default" : "secondary"} className="font-mono text-xs">
                              {entry.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(entry.entry_date).toLocaleDateString()}</span>
                            <span>@ {entry.entry_price}</span>
                            <span>| {entry.lot_size} lots</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="hidden gap-1 md:flex">
                            {entry.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="border-terminal-cyan/30 font-mono text-xs text-terminal-cyan">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="text-right">
                          {entry.status === "closed" ? (
                            <div className={`font-mono text-lg font-bold ${(entry.pnl || 0) >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                              {(entry.pnl || 0) >= 0 ? "+" : ""}{entry.pnl?.toFixed(2)} USD
                            </div>
                          ) : (
                            <CloseTradeButton entryId={entry.id} onClose={closeTrade} />
                          )}
                        </div>
                      </div>
                    </div>
                    {entry.notes && (
                      <p className="mt-3 border-t border-terminal-green/10 pt-3 text-sm text-muted-foreground">
                        {entry.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <Card className="border-terminal-green/20 bg-card/50">
            <CardContent className="py-8 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-terminal-green/50" />
              <p className="font-mono text-muted-foreground">
                Calendar view coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="coach" className="mt-4">
          <div className="space-y-4">
            <Card className="border-terminal-green/20 bg-gradient-to-br from-terminal-green/10 to-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-terminal-green">{">"} AI_TRADING_COACH</CardTitle>
                <CardDescription>Get personalized feedback on your trades</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {entries && entries.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-card/50 border border-terminal-green/20 rounded p-4 space-y-2">
                      <p className="text-sm text-gray-300"><span className="text-terminal-green font-mono">→</span> Win Rate: <span className="text-terminal-green font-mono">{((stats.winRate / stats.totalTrades) * 100).toFixed(1)}%</span></p>
                      <p className="text-sm text-gray-300"><span className="text-terminal-green font-mono">→</span> Total P&L: <span className={stats.totalPnL >= 0 ? "text-terminal-green" : "text-terminal-red"} + " font-mono">${stats.totalPnL.toFixed(2)}</span></p>
                      <p className="text-sm text-gray-300"><span className="text-terminal-green font-mono">→</span> Average Trade: <span className="text-terminal-cyan font-mono">${(stats.totalPnL / stats.totalTrades).toFixed(2)}</span></p>
                    </div>
                    <div className="bg-card/50 border border-terminal-cyan/20 rounded p-4">
                      <p className="text-terminal-cyan font-mono text-sm mb-2">AI_FEEDBACK:</p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Your trading shows {stats.winRate > stats.totalTrades * 0.5 ? "positive" : "neutral"} results. Focus on risk management and maintaining consistency. Review your losing trades to identify patterns and improve entry timing.
                      </p>
                    </div>
                  </div>
                ) : (
                  <Card className="border-terminal-green/20 bg-card/50">
                    <CardContent className="py-8 text-center">
                      <p className="font-mono text-muted-foreground">
                        No trades logged yet. Start logging trades to receive AI coaching feedback.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CloseTradeButton({ entryId, onClose }: { entryId: string; onClose: (id: string, price: number) => void }) {
  const [exitPrice, setExitPrice] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-terminal-yellow/30 text-terminal-yellow">
          Close Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="border-terminal-green/30 bg-background">
        <DialogHeader>
          <DialogTitle className="font-mono text-terminal-green">Close Position</DialogTitle>
          <DialogDescription>Enter the exit price to close this trade</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Exit Price</Label>
            <Input
              type="number"
              step="0.00001"
              placeholder="1.08750"
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value)}
              className="border-terminal-green/30 font-mono"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              if (exitPrice) {
                onClose(entryId, parseFloat(exitPrice))
                setIsOpen(false)
              }
            }}
            className="bg-terminal-green text-background"
          >
            Confirm Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
