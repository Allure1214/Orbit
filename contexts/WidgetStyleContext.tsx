'use client'

import { createContext, useContext, ReactNode } from 'react'

interface WidgetStyle {
  layout: 'grid' | 'list' | 'compact'
  cardStyle: 'glass' | 'solid' | 'minimal'
  widgetSize: 'small' | 'medium' | 'large'
  showAnimations: boolean
}

interface WidgetStyleContextType {
  widgetStyle: WidgetStyle
  setWidgetStyle: (style: WidgetStyle) => void
}

const WidgetStyleContext = createContext<WidgetStyleContextType | undefined>(undefined)

export function WidgetStyleProvider({ 
  children, 
  widgetStyle, 
  setWidgetStyle 
}: { 
  children: ReactNode
  widgetStyle: WidgetStyle
  setWidgetStyle: (style: WidgetStyle) => void
}) {
  return (
    <WidgetStyleContext.Provider value={{ widgetStyle, setWidgetStyle }}>
      {children}
    </WidgetStyleContext.Provider>
  )
}

export function useWidgetStyle() {
  const context = useContext(WidgetStyleContext)
  if (context === undefined) {
    throw new Error('useWidgetStyle must be used within a WidgetStyleProvider')
  }
  return context
}
