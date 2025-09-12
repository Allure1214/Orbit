'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react'

interface WeatherData {
  current_weather: {
    temperature: number
    weathercode: number
    windspeed: number
    winddirection: number
  }
  daily: {
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weathercode: number[]
    time: string[]
  }
}

const weatherIcons = {
  0: Sun, // Clear sky
  1: Sun, // Mainly clear
  2: Cloud, // Partly cloudy
  3: Cloud, // Overcast
  45: Cloud, // Fog
  48: Cloud, // Depositing rime fog
  51: CloudRain, // Light drizzle
  53: CloudRain, // Moderate drizzle
  55: CloudRain, // Dense drizzle
  61: CloudRain, // Slight rain
  63: CloudRain, // Moderate rain
  65: CloudRain, // Heavy rain
  71: CloudSnow, // Slight snow
  73: CloudSnow, // Moderate snow
  75: CloudSnow, // Heavy snow
  80: CloudRain, // Slight rain showers
  81: CloudRain, // Moderate rain showers
  82: CloudRain, // Violent rain showers
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Default to Kuala Lumpur coordinates
    const lat = 3.1390
    const lon = 101.6869
    
    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
      .then(data => {
        setWeather(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load weather data')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Card className="widget">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !weather) {
    return (
      <Card className="widget">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error || 'No weather data'}</p>
        </CardContent>
      </Card>
    )
  }

  const { current_weather, daily } = weather
  const WeatherIcon = weatherIcons[current_weather.weathercode as keyof typeof weatherIcons] || Cloud

  return (
    <Card className="widget">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WeatherIcon className="h-5 w-5" />
          Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Weather */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{Math.round(current_weather.temperature)}°C</div>
              <div className="text-sm text-muted-foreground">Kuala Lumpur</div>
            </div>
            <WeatherIcon className="h-12 w-12 text-blue-500" />
          </div>

          {/* Wind Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wind className="h-4 w-4" />
            <span>{current_weather.windspeed} km/h</span>
          </div>

          {/* 3-Day Forecast */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">3-Day Forecast</h4>
            <div className="space-y-1">
              {daily.time.slice(0, 3).map((date, index) => {
                const dayIcon = weatherIcons[daily.weathercode[index] as keyof typeof weatherIcons] || Cloud
                const DayIcon = dayIcon
                return (
                  <div key={date} className="flex items-center justify-between text-sm">
                    <span>{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <div className="flex items-center gap-2">
                      <DayIcon className="h-4 w-4" />
                      <span>{Math.round(daily.temperature_2m_max[index])}°/{Math.round(daily.temperature_2m_min[index])}°</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
