'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Heart, Reply } from 'lucide-react'

interface Post {
  id: string
  author: string
  category: 'Questions' | 'Analysis' | 'Discussion' | 'Mindset'
  title: string
  content: string
  timestamp: Date
  likes: number
  replies: number
  liked: boolean
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'trader_pro',
    category: 'Questions',
    title: 'What\'s the best way to manage drawdowns?',
    content: 'I\'ve been experiencing larger than usual drawdowns. Any tips on managing them without losing confidence?',
    timestamp: new Date(Date.now() - 3600000),
    likes: 24,
    replies: 8,
    liked: false
  },
  {
    id: '2',
    author: 'market_analyst',
    category: 'Analysis',
    title: 'EUR/USD Technical Breakdown - April 2026',
    content: 'Breaking down the EUR/USD chart with key support/resistance levels. Looking for a potential breakout this week...',
    timestamp: new Date(Date.now() - 7200000),
    likes: 156,
    replies: 32,
    liked: false
  },
  {
    id: '3',
    author: 'mindset_coach',
    category: 'Mindset',
    title: 'Overcoming Emotional Trading',
    content: 'Trading is 90% psychology. Share your strategies for keeping emotions in check during volatile markets.',
    timestamp: new Date(Date.now() - 86400000),
    likes: 89,
    replies: 24,
    liked: false
  }
]

const categoryColors = {
  Questions: 'bg-blue-900/30 text-blue-300 border-blue-700',
  Analysis: 'bg-purple-900/30 text-purple-300 border-purple-700',
  Discussion: 'bg-green-900/30 text-green-300 border-green-700',
  Mindset: 'bg-orange-900/30 text-orange-300 border-orange-700'
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [isComposing, setIsComposing] = useState(false)

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory)

  const toggleLike = (postId: string) => {
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ))
  }

  return (
    <div className="space-y-6 p-6 max-w-2xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Community</h1>
        <p className="text-gray-400">Share analysis, ask questions, and connect with other traders</p>
      </div>

      {/* Compose Button */}
      <Button 
        onClick={() => setIsComposing(!isComposing)}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
      >
        {isComposing ? 'Cancel' : '+ New Post'}
      </Button>

      {/* Compose Box */}
      {isComposing && (
        <Card className="p-4 bg-gray-900/50 border-gray-800">
          <textarea
            placeholder="Share your analysis, ask a question, or start a discussion..."
            className="w-full bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 p-3 mb-3 focus:outline-none focus:border-cyan-600"
            rows={4}
          />
          <div className="flex gap-2 mb-3">
            {(['Questions', 'Analysis', 'Discussion', 'Mindset'] as const).map(cat => (
              <Badge key={cat} variant="outline" className="cursor-pointer">{cat}</Badge>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsComposing(false)}>Cancel</Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700">Post</Button>
          </div>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Questions', 'Analysis', 'Discussion', 'Mindset'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <Card key={post.id} className="p-4 bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-cyan-400">{post.author}</span>
                  <Badge 
                    className={`text-xs ${categoryColors[post.category]}`}
                    variant="outline"
                  >
                    {post.category}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">
                  {post.timestamp.toLocaleDateString()} at {post.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>

            {/* Content */}
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">{post.content}</p>

            {/* Interactions */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
              <button
                onClick={() => toggleLike(post.id)}
                className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
              >
                <Heart 
                  className="w-4 h-4" 
                  fill={post.liked ? 'currentColor' : 'none'}
                />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">{post.replies}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition-colors">
                <Reply className="w-4 h-4" />
                <span className="text-sm">Reply</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
