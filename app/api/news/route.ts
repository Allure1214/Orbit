import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/news - Get news articles
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'technology'
    const pageSize = searchParams.get('pageSize') || '10'
    const country = searchParams.get('country') || 'us'

    // Handle 'all' category by defaulting to 'general'
    const apiCategory = category === 'all' ? 'general' : category

    // Check if NewsAPI key is available
    const newsApiKey = process.env.NEWS_API_KEY
    
    if (!newsApiKey) {
      // Return mock data if no API key is available
      const mockNews = [
        {
          id: '1',
          title: 'Tech Innovation Drives Market Growth',
          description: 'Latest technological advancements are reshaping industries and creating new opportunities for growth.',
          url: 'https://example.com/news/1',
          urlToImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
          publishedAt: new Date().toISOString(),
          source: { name: 'Tech News' },
          category: 'technology'
        },
        {
          id: '2',
          title: 'Global Markets Show Positive Trends',
          description: 'Financial markets continue to show resilience with key indicators pointing to sustained growth.',
          url: 'https://example.com/news/2',
          urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: 'Business Daily' },
          category: 'business'
        },
        {
          id: '3',
          title: 'Health Research Breakthrough Announced',
          description: 'Scientists have made significant progress in understanding complex diseases, offering hope for new treatments.',
          url: 'https://example.com/news/3',
          urlToImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop',
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: { name: 'Health Today' },
          category: 'health'
        },
        {
          id: '4',
          title: 'Climate Action Summit Concludes',
          description: 'World leaders have reached new agreements on climate change mitigation strategies.',
          url: 'https://example.com/news/4',
          urlToImage: 'https://images.unsplash.com/photo-1569163139397-7b1b0b2b8b8b?w=400&h=200&fit=crop',
          publishedAt: new Date(Date.now() - 10800000).toISOString(),
          source: { name: 'Environmental News' },
          category: 'science'
        },
        {
          id: '5',
          title: 'Sports Championship Updates',
          description: 'Exciting developments in the world of sports with several major tournaments reaching their climax.',
          url: 'https://example.com/news/5',
          urlToImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
          publishedAt: new Date(Date.now() - 14400000).toISOString(),
          source: { name: 'Sports Central' },
          category: 'sports'
        }
      ]

      // For 'all' category, return all mock news
      const filteredMockNews = category === 'all' 
        ? mockNews 
        : mockNews.filter(article => article.category === category)

      return NextResponse.json({
        articles: filteredMockNews,
        totalResults: filteredMockNews.length,
        status: 'ok'
      })
    }

    // Fetch real news from NewsAPI
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=${country}&category=${apiCategory}&pageSize=${pageSize}&apiKey=${newsApiKey}`
    
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.status !== 'ok') {
      throw new Error('NewsAPI returned error status')
    }

    // Transform the data to match our interface
    const articles = data.articles.map((article: any, index: number) => ({
      id: `news-${index}`,
      title: article.title || 'No title available',
      description: article.description || 'No description available',
      url: article.url || '#',
      urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop',
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: {
        name: article.source?.name || 'Unknown Source'
      },
      category: category === 'all' ? 'general' : category
    }))

    return NextResponse.json({
      articles,
      totalResults: data.totalResults || articles.length,
      status: 'ok'
    })

  } catch (error) {
    console.error('Error fetching news:', error)
    
    // Return fallback mock data on error
    const fallbackNews = [
      {
        id: 'fallback-1',
        title: 'News Service Temporarily Unavailable',
        description: 'We are experiencing technical difficulties. Please try again later.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop',
        publishedAt: new Date().toISOString(),
        source: { name: 'System' },
        category: 'general'
      }
    ]

    return NextResponse.json({
      articles: fallbackNews,
      totalResults: 1,
      status: 'error',
      message: 'Failed to fetch news data'
    })
  }
}
