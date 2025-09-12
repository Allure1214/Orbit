// Global type definitions for the Orbit dashboard

export interface User {
  id: string
  email: string
  name?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface Expense {
  id: string
  amount: number
  description: string
  category: 'FOOD' | 'TRANSPORTATION' | 'ENTERTAINMENT' | 'SHOPPING' | 'BILLS' | 'HEALTHCARE' | 'EDUCATION' | 'OTHER'
  date: Date
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface WeatherData {
  current: {
    temp: number
    humidity: number
    description: string
    icon: string
  }
  daily: Array<{
    date: string
    temp: { min: number; max: number }
    description: string
    icon: string
  }>
}

export interface NewsItem {
  title: string
  description: string
  url: string
  publishedAt: string
  source: {
    name: string
  }
  urlToImage?: string
}

export interface F1Data {
  season: string
  races: Array<{
    round: string
    raceName: string
    date: string
    time?: string
    Circuit: {
      circuitName: string
      Location: {
        country: string
        locality: string
      }
    }
  }>
  standings?: {
    drivers: Array<{
      position: string
      points: string
      Driver: {
        givenName: string
        familyName: string
      }
      Constructors: Array<{
        name: string
      }>
    }>
  }
}

export interface DashboardWidget {
  id: string
  type: 'tasks' | 'weather' | 'finance' | 'news' | 'f1' | 'notes'
  position: { x: number; y: number }
  size: { width: number; height: number }
  settings?: Record<string, any>
}

export interface UserPreferences {
  id: string
  theme: 'light' | 'dark' | 'system'
  dashboardLayout: DashboardWidget[]
  weatherLocation?: string
  newsCategories: string[]
  userId: string
}
