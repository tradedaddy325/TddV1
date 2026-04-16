import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageCircle, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Traders Talk Room | TRADEDADDY',
  description: 'Community chat and trading discussion',
}

const messages = [
  {
    id: 1,
    author: 'TradeMaster',
    avatar: 'TM',
    content: 'Just caught that EURUSD breakout. Classic support and retest setup. Already +50 pips!',
    timestamp: '2 hours ago',
    likes: 24,
    replies: 5,
  },
  {
    id: 2,
    author: 'ForexPro',
    avatar: 'FP',
    content: 'Anyone else seeing the divergence on GBPUSD 4H? Could be a reversal incoming.',
    timestamp: '4 hours ago',
    likes: 18,
    replies: 12,
  },
  {
    id: 3,
    author: 'GoldHunter',
    avatar: 'GH',
    content: 'Gold breaking resistance! Economic data coming out tomorrow. Stay alert for volatility.',
    timestamp: '6 hours ago',
    likes: 32,
    replies: 8,
  },
]

export default function TradersTalkRoom() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          Traders Talk Room
        </h1>
        <p className="text-muted-foreground mt-1">
          Real-time discussions with professional traders
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarFallback className="bg-primary/20 text-primary">YOU</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                placeholder="Share your trade idea or market observation..."
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary resize-none"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-3">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Post</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                    {message.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground">{message.author}</p>
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {message.content}
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Heart className="w-4 h-4" />
                      {message.likes}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {message.replies}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 border border-border/50 rounded-lg bg-card/50">
        <p className="text-sm text-foreground font-medium mb-2">Community Guidelines</p>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Share genuine trading ideas and analysis only</li>
          <li>Be respectful to all community members</li>
          <li>No financial advice - opinions only</li>
          <li>No spam or self-promotion of external services</li>
        </ul>
      </div>
    </div>
  )
}
