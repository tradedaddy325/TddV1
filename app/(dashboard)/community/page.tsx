'use client'

import { useState } from 'react'

interface Post {
  id: string
  author: string
  category: string
  title: string
  content: string
  likes: number
  replies: number
  createdAt: Date
  isLiked: boolean
}

const CATEGORIES = ['All', 'Questions', 'Analysis', 'Discussion', 'Mindset']

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'TraderJack',
      category: 'Analysis',
      title: 'EUR/USD Technical Breakout Coming',
      content: 'Looking at daily chart, EUR/USD showing consolidation before breakout. Targeting 1.10 resistance.',
      likes: 24,
      replies: 8,
      createdAt: new Date(Date.now() - 3600000),
      isLiked: false,
    },
    {
      id: '2',
      author: 'MindsetMaster',
      category: 'Mindset',
      title: 'How to Recover from Losing Streaks',
      content: 'The psychological aspect of trading is often overlooked. Here are my top tips...',
      likes: 42,
      replies: 15,
      createdAt: new Date(Date.now() - 7200000),
      isLiked: false,
    },
  ])

  const [filter, setFilter] = useState('All')

  const handleLike = (id: string) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post
    ))
  }

  const filteredPosts = filter === 'All' ? posts : posts.filter(p => p.category === filter)

  return (
    <div className="flex-1 overflow-auto bg-black p-6 space-y-6">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-white font-mono mb-6">COMMUNITY</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full font-mono text-sm transition-colors whitespace-nowrap ${
                filter === cat
                  ? 'bg-green-600 text-black'
                  : 'border border-gray-700 text-gray-300 hover:border-gray-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="border border-gray-700 bg-gray-900/50 rounded-lg p-4 hover:border-gray-600 transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-green-400">{post.author}</p>
                    <span className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded">
                      {post.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((Date.now() - post.createdAt.getTime()) / 60000)} minutes ago
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{post.content}</p>

              <div className="flex gap-4 text-sm">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded transition ${
                    post.isLiked
                      ? 'bg-green-900/50 text-green-400'
                      : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  ❤️ {post.likes}
                </button>
                <button className="flex items-center gap-1 px-3 py-1 rounded text-gray-400 hover:bg-gray-800 transition">
                  💬 {post.replies}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
