'use client'

import { useState, useEffect } from 'react'

interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  category: string
}

export default function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'technology', 'business', 'sports', 'health', 'science']

  // Mock news data
  useEffect(() => {
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'New AI Breakthrough in Machine Learning',
        description: 'Researchers develop new algorithm that improves efficiency by 40%',
        url: '#',
        publishedAt: '2024-01-12T10:30:00Z',
        source: 'Tech News',
        category: 'technology'
      },
      {
        id: '2',
        title: 'Stock Market Reaches New High',
        description: 'Major indices show strong performance in Q1 2024',
        url: '#',
        publishedAt: '2024-01-12T09:15:00Z',
        source: 'Financial Times',
        category: 'business'
      },
      {
        id: '3',
        title: 'Championship Finals This Weekend',
        description: 'Top teams compete for the ultimate prize',
        url: '#',
        publishedAt: '2024-01-12T08:45:00Z',
        source: 'Sports Central',
        category: 'sports'
      },
      {
        id: '4',
        title: 'New Health Study on Exercise Benefits',
        description: 'Research shows 30 minutes daily reduces risk by 25%',
        url: '#',
        publishedAt: '2024-01-12T07:20:00Z',
        source: 'Health Today',
        category: 'health'
      },
      {
        id: '5',
        title: 'Space Mission Successfully Launched',
        description: 'Satellite deployed to study climate change',
        url: '#',
        publishedAt: '2024-01-12T06:00:00Z',
        source: 'Science Daily',
        category: 'science'
      }
    ]

    setTimeout(() => {
      setNews(mockNews)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory)

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'technology': 'bg-blue-500/20 text-blue-400',
      'business': 'bg-green-500/20 text-green-400',
      'sports': 'bg-orange-500/20 text-orange-400',
      'health': 'bg-red-500/20 text-red-400',
      'science': 'bg-purple-500/20 text-purple-400'
    }
    return colors[category] || 'bg-gray-500/20 text-gray-400'
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">News</h3>
            <p className="text-white/70 text-sm">Loading latest news...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white/10 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">News</h3>
          <p className="text-white/70 text-sm">Stay updated with latest news</p>
        </div>
        <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm mb-1 line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-white/70 text-xs line-clamp-2">
                  {item.description}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>{item.source}</span>
              <span>{formatTimeAgo(item.publishedAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-white/50">No news available for this category.</p>
        </div>
      )}
    </div>
  )
}
