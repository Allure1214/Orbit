import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const base = searchParams.get('base') || 'USD'
    const symbols = searchParams.get('symbols') || 'EUR,GBP,JPY,CAD,AUD,CHF,CNY'
    const date = searchParams.get('date') // Optional: for historical data

    let apiUrl = `https://api.frankfurter.dev/v1/latest?base=${base}&symbols=${symbols}`
    
    // If date is provided, use historical endpoint
    if (date) {
      apiUrl = `https://api.frankfurter.dev/v1/${date}?base=${base}&symbols=${symbols}`
    }

    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error(`Frankfurter API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform the data to include currency names and symbols
    const currencyNames: { [key: string]: string } = {
      'USD': 'US Dollar',
      'EUR': 'Euro',
      'GBP': 'British Pound',
      'JPY': 'Japanese Yen',
      'CAD': 'Canadian Dollar',
      'AUD': 'Australian Dollar',
      'CHF': 'Swiss Franc',
      'CNY': 'Chinese Yuan',
      'BRL': 'Brazilian Real',
      'INR': 'Indian Rupee',
      'KRW': 'South Korean Won',
      'SGD': 'Singapore Dollar',
      'NZD': 'New Zealand Dollar',
      'MXN': 'Mexican Peso',
      'RUB': 'Russian Ruble',
      'ZAR': 'South African Rand',
      'TRY': 'Turkish Lira',
      'SEK': 'Swedish Krona',
      'NOK': 'Norwegian Krone',
      'DKK': 'Danish Krone',
      'PLN': 'Polish Zloty',
      'CZK': 'Czech Koruna',
      'HUF': 'Hungarian Forint',
      'ILS': 'Israeli Shekel',
      'AED': 'UAE Dirham',
      'SAR': 'Saudi Riyal',
      'THB': 'Thai Baht',
      'MYR': 'Malaysian Ringgit',
      'IDR': 'Indonesian Rupiah',
      'PHP': 'Philippine Peso',
      'VND': 'Vietnamese Dong'
    }

    // Transform rates to include currency info
    const transformedRates = Object.entries(data.rates).map(([code, rate]) => ({
      code,
      name: currencyNames[code] || code,
      rate: rate as number,
      change: 0 // We'll calculate this if we have historical data
    }))

    return NextResponse.json({
      base: data.base,
      date: data.date,
      rates: transformedRates,
      baseName: currencyNames[data.base] || data.base
    })
  } catch (error) {
    console.error('Error fetching currency data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch currency data' },
      { status: 500 }
    )
  }
}

// Get available currencies
export async function POST() {
  try {
    const response = await fetch('https://api.frankfurter.dev/v1/currencies')
    
    if (!response.ok) {
      throw new Error(`Frankfurter API error: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching currencies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch currencies' },
      { status: 500 }
    )
  }
}
