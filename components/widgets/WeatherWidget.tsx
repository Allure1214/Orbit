'use client'

import { useState, useEffect } from 'react'

interface WeatherData {
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

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState('Kuala Lumpur')

  // Mock weather data for demonstration
  useEffect(() => {
    const mockWeather: WeatherData = {
      current: {
        temp: 28,
        humidity: 75,
        description: 'Partly Cloudy',
        icon: '⛅'
      },
      daily: [
        { date: '2024-01-13', temp: { min: 24, max: 32 }, description: 'Sunny', icon: '☀️' },
        { date: '2024-01-14', temp: { min: 23, max: 30 }, description: 'Cloudy', icon: '☁️' },
        { date: '2024-01-15', temp: { min: 25, max: 31 }, description: 'Rainy', icon: '🌧️' },
        { date: '2024-01-16', temp: { min: 24, max: 29 }, description: 'Thunderstorm', icon: '⛈️' },
        { date: '2024-01-17', temp: { min: 26, max: 33 }, description: 'Sunny', icon: '☀️' },
        { date: '2024-01-18', temp: { min: 25, max: 32 }, description: 'Partly Cloudy', icon: '⛅' },
        { date: '2024-01-19', temp: { min: 24, max: 30 }, description: 'Cloudy', icon: '☁️' },
      ]
    }
    
    setTimeout(() => {
      setWeather(mockWeather)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Weather</h3>
            <p className="text-white/70 text-sm">Loading weather data...</p>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-20 bg-white/10 rounded-lg mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Weather</h3>
          <p className="text-white/70 text-sm">{location}</p>
        </div>
        <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Current Weather */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{weather?.current.icon}</div>
        <div className="text-3xl font-bold text-white mb-1">{weather?.current.temp}°C</div>
        <div className="text-white/70 text-sm mb-2">{weather?.current.description}</div>
        <div className="text-white/50 text-xs">
          Humidity: {weather?.current.humidity}%
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="space-y-2">
        <h4 className="text-white/70 text-sm font-medium mb-3">7-Day Forecast</h4>
        {weather?.daily.map((day, index) => (
          <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{day.icon}</span>
              <div>
                <div className="text-white text-sm font-medium">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-white/50 text-xs">{day.description}</div>
              </div>
            </div>
            <div className="text-white text-sm">
              <span className="font-medium">{day.temp.max}°</span>
              <span className="text-white/50 ml-1">{day.temp.min}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
