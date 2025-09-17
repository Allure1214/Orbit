'use client'

import { useState, useEffect } from 'react'

interface WeatherData {
  current: {
    temp: number
    humidity: number
    description: string
    icon: string
    windSpeed?: number
    windDirection?: number
  }
  daily: Array<{
    date: string
    temp: { min: number; max: number }
    description: string
    icon: string
  }>
  location: {
    name: string
    country: string
  }
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isForecastExpanded, setIsForecastExpanded] = useState(false)
  const [showWeatherMap, setShowWeatherMap] = useState(false)

  // Fetch real weather data
  const fetchWeatherData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/weather')
      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }
      
      const data = await response.json()
      setWeather(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError('Failed to load weather data')
      console.error('Error fetching weather data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeatherData()
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
          <p className="text-white/70 text-sm">
            {weather?.location.name}, {weather?.location.country}
          </p>
          {lastUpdated && (
            <p className="text-white/50 text-xs">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowWeatherMap(true)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="View Weather Map"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </button>
          <button 
            onClick={fetchWeatherData}
            disabled={loading}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh Weather"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={fetchWeatherData}
            className="text-red-400 hover:text-red-300 text-xs mt-1"
          >
            Retry
          </button>
        </div>
      )}

      {/* Current Weather */}
      {weather && (
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{weather.current.icon}</div>
          <div className="text-3xl font-bold text-white mb-1">{weather.current.temp}°C</div>
          <div className="text-white/70 text-sm mb-2">{weather.current.description}</div>
          <div className="flex justify-center space-x-4 text-white/50 text-xs">
            <span>Humidity: {weather.current.humidity}%</span>
            {weather.current.windSpeed && (
              <span>Wind: {weather.current.windSpeed} km/h</span>
            )}
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      {weather && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white/70 text-sm font-medium">7-Day Forecast</h4>
            <button
              onClick={() => setIsForecastExpanded(!isForecastExpanded)}
              className="flex items-center space-x-1 text-white/50 hover:text-white text-xs transition-colors"
            >
              <span>{isForecastExpanded ? 'Collapse' : 'Expand'}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isForecastExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          <div className={`transition-all duration-300 ${
            isForecastExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className="space-y-2 pb-2">
              {weather.daily.map((day, index) => (
                <div key={index} className="flex items-center justify-between py-3 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
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
          
          {/* Show first 3 days when collapsed */}
          {!isForecastExpanded && (
            <div className="space-y-2 pb-2">
              {weather.daily.slice(0, 3).map((day, index) => (
                <div key={index} className="flex items-center justify-between py-3 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
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
          )}
        </div>
      )}

      {/* Weather Map Modal */}
      {showWeatherMap && (
        <WeatherMapModal 
          onClose={() => setShowWeatherMap(false)}
          location={weather?.location}
        />
      )}
    </div>
  )
}

// Weather Map Modal Component
function WeatherMapModal({ onClose, location }: { onClose: () => void, location?: { name: string, country: string } }) {
  const [mapType, setMapType] = useState<'temperature' | 'precipitation' | 'clouds' | 'wind'>('temperature')
  const [mapLayer, setMapLayer] = useState<'current' | 'forecast'>('current')

  const getMapUrl = () => {
    const baseUrl = 'https://tile.openweathermap.org/map'
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo'
    
    const layerMap = {
      temperature: 'temp_new',
      precipitation: 'precipitation_new',
      clouds: 'clouds_new',
      wind: 'wind_new'
    }

    const layer = layerMap[mapType]
    const time = mapLayer === 'current' ? '' : '_forecast'
    
    return `${baseUrl}/${layer}${time}/{z}/{x}/{y}.png?appid=${apiKey}`
  }

  const mapTypes = [
    { value: 'temperature', label: 'Temperature', icon: '🌡️' },
    { value: 'precipitation', label: 'Precipitation', icon: '🌧️' },
    { value: 'clouds', label: 'Clouds', icon: '☁️' },
    { value: 'wind', label: 'Wind', icon: '💨' }
  ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-white">Weather Map</h2>
            <p className="text-white/70 text-sm">
              {location ? `${location.name}, ${location.country}` : 'Interactive Weather Map'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-white/20">
          <div className="flex flex-wrap items-center gap-4">
            {/* Map Type Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-white/70 text-sm">Layer:</span>
              <div className="flex space-x-1">
                {mapTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setMapType(type.value as any)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      mapType === type.value
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <span className="mr-1">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-white/70 text-sm">Time:</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setMapLayer('current')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    mapLayer === 'current'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Current
                </button>
                <button
                  onClick={() => setMapLayer('forecast')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    mapLayer === 'forecast'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Forecast
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-b-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Interactive Weather Map</h3>
              <p className="text-white/70 mb-4">
                {mapType === 'temperature' && 'Temperature distribution and heat maps'}
                {mapType === 'precipitation' && 'Rainfall and precipitation patterns'}
                {mapType === 'clouds' && 'Cloud coverage and cloud types'}
                {mapType === 'wind' && 'Wind speed and direction patterns'}
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-white/60">
                <span>🌡️ Temperature</span>
                <span>🌧️ Precipitation</span>
                <span>☁️ Clouds</span>
                <span>💨 Wind</span>
              </div>
            </div>
          </div>
          
          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
            <div className="font-medium mb-2">Legend</div>
            <div className="space-y-1">
              {mapType === 'temperature' && (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Hot (30°C+)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Warm (20-30°C)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Cool (10-20°C)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span>Cold (&lt;10°C)</span>
                  </div>
                </>
              )}
              {mapType === 'precipitation' && (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span>Heavy Rain</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-400 rounded"></div>
                    <span>Light Rain</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span>No Rain</span>
                  </div>
                </>
              )}
              {mapType === 'clouds' && (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-600 rounded"></div>
                    <span>Overcast</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span>Partly Cloudy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-400 rounded"></div>
                    <span>Clear</span>
                  </div>
                </>
              )}
              {mapType === 'wind' && (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Strong Wind</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Moderate Wind</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Light Wind</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
