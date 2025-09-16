'use client'

import { ReactNode } from 'react'

interface WidgetWrapperProps {
  children: ReactNode
  cardStyle: 'glass' | 'solid' | 'minimal'
  showAnimations: boolean
  className?: string
}

export default function WidgetWrapper({ 
  children, 
  cardStyle, 
  showAnimations, 
  className = '' 
}: WidgetWrapperProps) {
  const getCardStyleClasses = () => {
    const baseClasses = 'rounded-2xl p-6'
    
    switch (cardStyle) {
      case 'solid':
        return `${baseClasses} bg-white/20 border-2 border-white/30`
      case 'minimal':
        return `${baseClasses} bg-white/5 border border-white/10`
      case 'glass':
      default:
        return `${baseClasses} bg-white/10 backdrop-blur-sm border border-white/20`
    }
  }

  const getAnimationClasses = () => {
    return showAnimations 
      ? 'hover:bg-white/15 transition-all duration-300' 
      : ''
  }

  return (
    <div className={`${getCardStyleClasses()} ${getAnimationClasses()} ${className}`}>
      {children}
    </div>
  )
}
