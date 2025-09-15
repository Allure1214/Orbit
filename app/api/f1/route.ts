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

    // Fetch data from Ergast API (new URL)
    const ergastBaseUrl = 'https://api.jolpi.ca/ergast/f1'
    
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
    
    return NextResponse.json({
      error: 'Failed to fetch F1 data',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 'error'
    }, { status: 500 })
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

