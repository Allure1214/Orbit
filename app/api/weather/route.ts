import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getWeatherData } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')

    // Default to Kuala Lumpur coordinates if not provided
    const latitude = lat ? parseFloat(lat) : 3.1390
    const longitude = lon ? parseFloat(lon) : 101.6869

    const weatherData = await getWeatherData(latitude, longitude)

    // Transform the data to match our widget format
    const transformedData = {
      current: {
        temp: Math.round(weatherData.current_weather.temperature),
        humidity: 75, // Open-Meteo doesn't provide humidity in basic plan
        description: getWeatherDescription(weatherData.current_weather.weathercode),
        icon: getWeatherIcon(weatherData.current_weather.weathercode),
        windSpeed: weatherData.current_weather.windspeed,
        windDirection: weatherData.current_weather.winddirection
      },
      daily: weatherData.daily.time.slice(0, 7).map((date: string, index: number) => ({
        date,
        temp: {
          min: Math.round(weatherData.daily.temperature_2m_min[index]),
          max: Math.round(weatherData.daily.temperature_2m_max[index])
        },
        description: getWeatherDescription(weatherData.daily.weathercode[index]),
        icon: getWeatherIcon(weatherData.daily.weathercode[index])
      })),
      location: {
        name: 'Kuala Lumpur', // You can enhance this with reverse geocoding
        country: 'Malaysia'
      }
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 })
  }
}

// Weather code to description mapping (WMO Weather interpretation codes)
function getWeatherDescription(code: number): string {
  const descriptions: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  }
  return descriptions[code] || 'Unknown'
}

// Weather code to icon mapping
function getWeatherIcon(code: number): string {
  const icons: { [key: number]: string } = {
    0: '☀️',
    1: '🌤️',
    2: '⛅',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    51: '🌦️',
    53: '🌦️',
    55: '🌦️',
    56: '🌨️',
    57: '🌨️',
    61: '🌧️',
    63: '🌧️',
    65: '🌧️',
    66: '🌨️',
    67: '🌨️',
    71: '❄️',
    73: '❄️',
    75: '❄️',
    77: '❄️',
    80: '🌦️',
    81: '🌦️',
    82: '🌦️',
    85: '🌨️',
    86: '🌨️',
    95: '⛈️',
    96: '⛈️',
    99: '⛈️'
  }
  return icons[code] || '🌤️'
}
