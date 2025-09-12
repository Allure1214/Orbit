// API utility functions for external services

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new APIError(
        `API request failed: ${response.statusText}`,
        response.status,
        url
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      url
    )
  }
}

// Weather API - Using Open-Meteo (Free, no API key required)
export async function getWeatherData(lat: number, lon: number) {
  // Open-Meteo API - completely free, no API key needed
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
  return fetchWithErrorHandling(url)
}

// Alternative: WeatherAPI.com (requires free API key)
export async function getWeatherDataWeatherAPI(lat: number, lon: number) {
  const apiKey = process.env.WEATHER_API_KEY
  if (!apiKey) {
    throw new Error('WeatherAPI key not configured')
  }

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=no&alerts=no`
  return fetchWithErrorHandling(url)
}

// News API
export async function getNewsData(category?: string, pageSize = 10) {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) {
    throw new Error('News API key not configured')
  }

  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category || 'general'}&pageSize=${pageSize}&apiKey=${apiKey}`
  return fetchWithErrorHandling(url)
}

// F1 API (Ergast)
export async function getF1Data(endpoint: string) {
  const baseUrl = process.env.F1_API_BASE_URL || 'https://ergast.com/api/f1'
  const url = `${baseUrl}/${endpoint}.json`
  return fetchWithErrorHandling(url)
}

// OpenAI API
export async function getAISummary(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new APIError(
      `OpenAI API request failed: ${response.statusText}`,
      response.status,
      'https://api.openai.com/v1/chat/completions'
    )
  }

  const data = await response.json()
  return data.choices[0].message.content
}
