'use client'

import { useState, useEffect } from 'react'
import { WidgetStyleProvider } from '@/contexts/WidgetStyleContext'
import QuickStats from '@/components/QuickStats'
import WidgetWrapper from '@/components/WidgetWrapper'
import TaskWidget from '@/components/widgets/TaskWidget'
import WeatherWidget from '@/components/widgets/WeatherWidget'
import FinanceWidget from '@/components/widgets/FinanceWidget'
import NewsWidget from '@/components/widgets/NewsWidget'
import F1Widget from '@/components/widgets/F1Widget'
import NotesWidget from '@/components/widgets/NotesWidget'

interface WidgetStyle {
  layout: 'grid' | 'list' | 'compact'
  cardStyle: 'glass' | 'solid' | 'minimal'
  widgetSize: 'small' | 'medium' | 'large'
  showAnimations: boolean
}

export default function DashboardContent() {
  const [widgetStyle, setWidgetStyle] = useState<WidgetStyle>({
    layout: 'grid',
    cardStyle: 'glass',
    widgetSize: 'medium',
    showAnimations: true
  })
  const [loading, setLoading] = useState(true)

  // Fetch user preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/preferences')
        if (response.ok) {
          const data = await response.json()
          if (data.widgetStyle) {
            setWidgetStyle(data.widgetStyle)
          }
        }
      } catch (error) {
        console.error('Error fetching preferences:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPreferences()
  }, [])

  // Get widget container classes based on preferences
  const getWidgetContainerClasses = () => {
    const baseClasses = 'gap-6'
    
    switch (widgetStyle.layout) {
      case 'list':
        return `flex flex-col ${baseClasses}`
      case 'compact':
        return `grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 ${baseClasses}`
      case 'grid':
      default:
        return `grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 ${baseClasses}`
    }
  }

  // Get widget wrapper classes based on preferences
  const getWidgetWrapperClasses = () => {
    const baseClasses = 'transition-all duration-300'
    
    // Size classes
    const sizeClasses = {
      small: 'col-span-1',
      medium: 'col-span-1',
      large: 'lg:col-span-2 xl:col-span-1'
    }
    
    // Animation classes
    const animationClasses = widgetStyle.showAnimations 
      ? 'hover:scale-105 hover:shadow-2xl' 
      : ''
    
    return `${baseClasses} ${sizeClasses[widgetStyle.widgetSize]} ${animationClasses}`
  }


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-white/10 rounded-2xl mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-white/10 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <WidgetStyleProvider widgetStyle={widgetStyle} setWidgetStyle={setWidgetStyle}>
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="mb-8">
          <QuickStats />
        </div>
        
        {/* Main Widgets */}
        <div className={getWidgetContainerClasses()}>
          <div className={getWidgetWrapperClasses()}>
            <WidgetWrapper 
              cardStyle={widgetStyle.cardStyle}
              showAnimations={widgetStyle.showAnimations}
            >
              <TaskWidget />
            </WidgetWrapper>
          </div>
          
          <div className={getWidgetWrapperClasses()}>
            <WidgetWrapper 
              cardStyle={widgetStyle.cardStyle}
              showAnimations={widgetStyle.showAnimations}
            >
              <WeatherWidget />
            </WidgetWrapper>
          </div>
          
          <div className={getWidgetWrapperClasses()}>
            <WidgetWrapper 
              cardStyle={widgetStyle.cardStyle}
              showAnimations={widgetStyle.showAnimations}
            >
              <FinanceWidget />
            </WidgetWrapper>
          </div>
          
          <div className={getWidgetWrapperClasses()}>
            <WidgetWrapper 
              cardStyle={widgetStyle.cardStyle}
              showAnimations={widgetStyle.showAnimations}
            >
              <NewsWidget />
            </WidgetWrapper>
          </div>
          
          <div className={getWidgetWrapperClasses()}>
            <WidgetWrapper 
              cardStyle={widgetStyle.cardStyle}
              showAnimations={widgetStyle.showAnimations}
            >
              <F1Widget />
            </WidgetWrapper>
          </div>
          
          <div className={getWidgetWrapperClasses()}>
            <WidgetWrapper 
              cardStyle={widgetStyle.cardStyle}
              showAnimations={widgetStyle.showAnimations}
            >
              <NotesWidget />
            </WidgetWrapper>
          </div>
        </div>
      </div>
    </WidgetStyleProvider>
  )
}
