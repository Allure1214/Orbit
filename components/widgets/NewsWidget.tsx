'use client'

import { useState, useEffect } from 'react'

interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  urlToImage?: string
  publishedAt: string
  source: {
    name: string
  }
  category: string
}

export default function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [userPreferences, setUserPreferences] = useState<string[]>([])

  const categories = ['all', 'technology', 'business', 'sports', 'health', 'science', 'entertainment', 'politics', 'world']

  // Fetch user preferences for news categories
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/preferences')
        if (response.ok) {
          const prefs = await response.json()
          setUserPreferences(prefs.newsCategories || ['technology', 'business', 'health'])
        }
      } catch (err) {
        console.error('Error fetching preferences:', err)
      }
    }
    fetchPreferences()
  }, [])

  // Fetch news data from API
  const fetchNews = async (category: string = 'all') => {
    try {
      setLoading(true)
      setError(null)
      
      // For 'all' category, use user preferences or fallback to default categories
      if (category === 'all') {
        const categoriesToFetch = userPreferences.length > 0 
          ? userPreferences 
          : ['technology', 'business', 'sports', 'health', 'science']
        
        const promises = categoriesToFetch.map(cat => 
          fetch(`/api/news?category=${cat}&pageSize=3`)
            .then(res => res.ok ? res.json() : { articles: [] })
            .catch(() => ({ articles: [] }))
        )
        
        const results = await Promise.all(promises)
        const allArticles = results.flatMap(result => result.articles || [])
        
        // Sort by published date and limit to 10
        const sortedArticles = allArticles
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          .slice(0, 10)
          .map((article, index) => ({
            ...article,
            id: `${article.id}-${index}` // Ensure unique IDs for combined articles
          }))
        
        setNews(sortedArticles)
      } else {
        const response = await fetch(`/api/news?category=${category}&pageSize=10`)
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }
        
        const data = await response.json()
        setNews(data.articles || [])
      }
    } catch (err) {
      setError('Failed to load news')
      console.error('Error fetching news:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load news on component mount and when category changes
  useEffect(() => {
    fetchNews(selectedCategory)
  }, [selectedCategory])

  // Refetch news when user preferences change (for 'all' category)
  useEffect(() => {
    if (selectedCategory === 'all' && userPreferences.length > 0) {
      fetchNews(selectedCategory)
    }
  }, [userPreferences])

  // No need for filtering since we fetch the right data for each category
  const filteredNews = news

  const refreshNews = () => {
    fetchNews(selectedCategory)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'technology': 'bg-blue-500/20 text-blue-400',
      'business': 'bg-green-500/20 text-green-400',
      'sports': 'bg-orange-500/20 text-orange-400',
      'health': 'bg-red-500/20 text-red-400',
      'science': 'bg-purple-500/20 text-purple-400',
      'entertainment': 'bg-pink-500/20 text-pink-400',
      'politics': 'bg-yellow-500/20 text-yellow-400',
      'world': 'bg-indigo-500/20 text-indigo-400',
      'general': 'bg-gray-500/20 text-gray-400'
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
        <button 
          onClick={refreshNews}
          disabled={loading}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={refreshNews}
            className="text-red-400 hover:text-red-300 text-xs mt-1"
          >
            Retry
          </button>
        </div>
      )}

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
            {category === 'all' && userPreferences.length > 0 
              ? `All (${userPreferences.length} categories)`
              : category.charAt(0).toUpperCase() + category.slice(1)
            }
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {filteredNews.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              {/* News Image */}
              {item.urlToImage && (
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    src={item.urlToImage}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
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
                  <span>{item.source.name}</span>
                  <span>{formatTimeAgo(item.publishedAt)}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {!loading && filteredNews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-white/50">
            {error ? 'Failed to load news' : 'No news available for this category.'}
          </p>
          {error && (
            <button
              onClick={refreshNews}
              className="mt-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  )
}
