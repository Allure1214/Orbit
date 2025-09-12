import { NextRequest, NextResponse } from 'next/server'
import { getWeatherData } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '3.1390') // Default to Kuala Lumpur
    const lon = parseFloat(searchParams.get('lon') || '101.6869')

    const weatherData = await getWeatherData(lat, lon)
    
    return NextResponse.json(weatherData)
  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}
