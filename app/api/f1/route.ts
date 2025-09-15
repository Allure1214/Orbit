import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/f1 - Get F1 data (schedule, standings, etc.)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'schedule'
    const year = searchParams.get('year') || new Date().getFullYear().toString()

    // Fetch data from Ergast API
    const ergastBaseUrl = 'http://ergast.com/api/f1'
    
    let apiUrl = ''
    switch (type) {
      case 'schedule':
        apiUrl = `${ergastBaseUrl}/${year}.json`
        break
      case 'standings':
        apiUrl = `${ergastBaseUrl}/${year}/driverStandings.json`
        break
      case 'constructors':
        apiUrl = `${ergastBaseUrl}/${year}/constructorStandings.json`
        break
      case 'nextRace':
        apiUrl = `${ergastBaseUrl}/current/next.json`
        break
      default:
        apiUrl = `${ergastBaseUrl}/${year}.json`
    }

    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error(`Ergast API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.MRData) {
      throw new Error('Invalid data from Ergast API')
    }

    // Transform the data based on type
    let transformedData = {}
    
    switch (type) {
      case 'schedule':
        transformedData = {
          races: data.MRData.RaceTable?.Races?.map((race: any) => ({
            id: race.round,
            name: race.raceName,
            circuit: race.Circuit?.circuitName || 'Unknown Circuit',
            location: race.Circuit?.Location?.locality || 'Unknown',
            country: race.Circuit?.Location?.country || 'Unknown',
            date: race.date,
            time: race.time,
            url: race.url,
            status: getRaceStatus(race.date, race.time)
          })) || [],
          season: data.MRData.RaceTable?.season || year
        }
        break
        
      case 'standings':
        transformedData = {
          standings: data.MRData.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.map((driver: any) => ({
            position: driver.position,
            points: driver.points,
            wins: driver.wins,
            driver: {
              id: driver.Driver.driverId,
              name: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
              nationality: driver.Driver.nationality,
              code: driver.Driver.code
            },
            constructor: {
              name: driver.Constructors?.[0]?.name || 'Unknown',
              nationality: driver.Constructors?.[0]?.nationality || 'Unknown'
            }
          })) || [],
          season: data.MRData.StandingsTable?.season || year
        }
        break
        
      case 'constructors':
        transformedData = {
          standings: data.MRData.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings?.map((constructor: any) => ({
            position: constructor.position,
            points: constructor.points,
            wins: constructor.wins,
            constructor: {
              name: constructor.Constructor.name,
              nationality: constructor.Constructor.nationality
            }
          })) || [],
          season: data.MRData.StandingsTable?.season || year
        }
        break
        
      case 'nextRace':
        const nextRace = data.MRData.RaceTable?.Races?.[0]
        if (nextRace) {
          transformedData = {
            race: {
              id: nextRace.round,
              name: nextRace.raceName,
              circuit: nextRace.Circuit?.circuitName || 'Unknown Circuit',
              location: nextRace.Circuit?.Location?.locality || 'Unknown',
              country: nextRace.Circuit?.Location?.country || 'Unknown',
              date: nextRace.date,
              time: nextRace.time,
              url: nextRace.url,
              status: getRaceStatus(nextRace.date, nextRace.time)
            },
            season: data.MRData.RaceTable?.season || year
          }
        } else {
          transformedData = { race: null, season: year }
        }
        break
        
      default:
        transformedData = data
    }

    return NextResponse.json({
      ...transformedData,
      status: 'ok',
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching F1 data:', error)
    
    // Return fallback mock data on error
    const fallbackData = getFallbackF1Data()
    return NextResponse.json({
      ...fallbackData,
      status: 'error',
      message: 'Failed to fetch F1 data, showing fallback data'
    })
  }
}

// Helper function to determine race status
function getRaceStatus(date: string, time: string): 'upcoming' | 'live' | 'completed' {
  const now = new Date()
  const raceDateTime = new Date(`${date}T${time}`)
  
  if (now > raceDateTime) {
    return 'completed'
  } else if (now >= new Date(raceDateTime.getTime() - 2 * 60 * 60 * 1000)) { // 2 hours before
    return 'live'
  } else {
    return 'upcoming'
  }
}

// Fallback data when API fails
function getFallbackF1Data() {
  return {
    races: [
      {
        id: '1',
        name: 'Bahrain Grand Prix',
        circuit: 'Bahrain International Circuit',
        location: 'Sakhir',
        country: 'Bahrain',
        date: '2024-03-02',
        time: '15:00:00Z',
        url: 'https://www.formula1.com/en/racing/2024/Bahrain.html',
        status: 'upcoming'
      },
      {
        id: '2',
        name: 'Saudi Arabian Grand Prix',
        circuit: 'Jeddah Corniche Circuit',
        location: 'Jeddah',
        country: 'Saudi Arabia',
        date: '2024-03-09',
        time: '17:00:00Z',
        url: 'https://www.formula1.com/en/racing/2024/Saudi_Arabia.html',
        status: 'upcoming'
      },
      {
        id: '3',
        name: 'Australian Grand Prix',
        circuit: 'Albert Park Circuit',
        location: 'Melbourne',
        country: 'Australia',
        date: '2024-03-24',
        time: '05:00:00Z',
        url: 'https://www.formula1.com/en/racing/2024/Australia.html',
        status: 'upcoming'
      }
    ],
    standings: [
      {
        position: '1',
        points: '25',
        wins: '1',
        driver: {
          id: 'max_verstappen',
          name: 'Max Verstappen',
          nationality: 'Dutch',
          code: 'VER'
        },
        constructor: {
          name: 'Red Bull Racing',
          nationality: 'Austrian'
        }
      },
      {
        position: '2',
        points: '18',
        wins: '0',
        driver: {
          id: 'sergio_perez',
          name: 'Sergio Perez',
          nationality: 'Mexican',
          code: 'PER'
        },
        constructor: {
          name: 'Red Bull Racing',
          nationality: 'Austrian'
        }
      }
    ],
    season: '2024'
  }
}
