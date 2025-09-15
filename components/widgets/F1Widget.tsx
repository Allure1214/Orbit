'use client'

import { useState, useEffect } from 'react'

interface F1Driver {
  position: string
  points: string
  wins: string
  driver: {
    id: string
    name: string
    nationality: string
    code: string
  }
  constructor: {
    name: string
    nationality: string
  }
}

interface F1Race {
  id: string
  name: string
  circuit: string
  location: string
  country: string
  date: string
  time: string
  url: string
  status: 'upcoming' | 'live' | 'completed'
}

interface NextRace {
  race: F1Race | null
  season: string
}

export default function F1Widget() {
  const [drivers, setDrivers] = useState<F1Driver[]>([])
  const [races, setRaces] = useState<F1Race[]>([])
  const [nextRace, setNextRace] = useState<NextRace | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'standings' | 'races' | 'countdown'>('countdown')
  const [countdown, setCountdown] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  // Fetch F1 data from API
  const fetchF1Data = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch standings
      const standingsResponse = await fetch('/api/f1?type=standings')
      if (standingsResponse.ok) {
        const standingsData = await standingsResponse.json()
        setDrivers(standingsData.standings || [])
      } else {
        const errorData = await standingsResponse.json()
        throw new Error(errorData.message || 'Failed to fetch standings')
      }

      // Fetch race schedule
      const racesResponse = await fetch('/api/f1?type=schedule')
      if (racesResponse.ok) {
        const racesData = await racesResponse.json()
        setRaces(racesData.races || [])
      } else {
        const errorData = await racesResponse.json()
        throw new Error(errorData.message || 'Failed to fetch race schedule')
      }

      // Fetch next race
      const nextRaceResponse = await fetch('/api/f1?type=nextRace')
      if (nextRaceResponse.ok) {
        const nextRaceData = await nextRaceResponse.json()
        setNextRace(nextRaceData)
      } else {
        const errorData = await nextRaceResponse.json()
        throw new Error(errorData.message || 'Failed to fetch next race')
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load F1 data'
      setError(errorMessage)
      console.error('Error fetching F1 data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load F1 data on component mount
  useEffect(() => {
    fetchF1Data()
  }, [])

  // Countdown timer for next race
  useEffect(() => {
    if (!nextRace?.race || nextRace.race.status !== 'upcoming') {
      setCountdown(null)
      return
    }

    const updateCountdown = () => {
      const raceDateTime = new Date(`${nextRace.race.date}T${nextRace.race.time}`)
      const now = new Date()
      const diff = raceDateTime.getTime() - now.getTime()

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setCountdown({ days, hours, minutes, seconds })
      } else {
        setCountdown(null)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [nextRace])

  const getConstructorColor = (constructor: string) => {
    const colors: { [key: string]: string } = {
      'Red Bull Racing': 'bg-blue-500/20 text-blue-400',
      'Mercedes': 'bg-teal-500/20 text-teal-400',
      'Ferrari': 'bg-red-500/20 text-red-400',
      'Aston Martin': 'bg-green-500/20 text-green-400',
      'McLaren': 'bg-orange-500/20 text-orange-400',
      'Alpine': 'bg-pink-500/20 text-pink-400',
      'AlphaTauri': 'bg-indigo-500/20 text-indigo-400',
      'Haas': 'bg-gray-500/20 text-gray-400',
      'Alfa Romeo': 'bg-red-600/20 text-red-300',
      'Williams': 'bg-blue-600/20 text-blue-300'
    }
    return colors[constructor] || 'bg-gray-500/20 text-gray-400'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(`${dateString}T${timeString}`)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const getRaceStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/20 text-blue-400'
      case 'live': return 'bg-red-500/20 text-red-400'
      case 'completed': return 'bg-green-500/20 text-green-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const refreshData = () => {
    fetchF1Data()
  }

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">F1 Statistics</h3>
            <p className="text-white/70 text-sm">Loading F1 data...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-white/10 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">F1 Statistics</h3>
          <p className="text-white/70 text-sm">Formula 1 races and standings</p>
        </div>
        <button 
          onClick={refreshData}
          disabled={loading}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={refreshData}
            className="text-red-400 hover:text-red-300 text-xs mt-1"
          >
            Retry
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white/5 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('countdown')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'countdown'
              ? 'bg-white/20 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Countdown
        </button>
        <button
          onClick={() => setActiveTab('standings')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'standings'
              ? 'bg-white/20 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Standings
        </button>
        <button
          onClick={() => setActiveTab('races')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'races'
              ? 'bg-white/20 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Races
        </button>
      </div>

      {/* Content */}
      {activeTab === 'countdown' ? (
        <div className="space-y-4">
          {nextRace?.race ? (
            <>
              <div className="text-center">
                <h4 className="text-white font-bold text-lg mb-2">{nextRace.race.name}</h4>
                <p className="text-white/70 text-sm mb-1">{nextRace.race.circuit}</p>
                <p className="text-white/50 text-xs">{nextRace.race.location}, {nextRace.race.country}</p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getRaceStatusColor(nextRace.race.status)}`}>
                  {nextRace.race.status.toUpperCase()}
                </div>
              </div>
              
              {countdown ? (
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{countdown.days}</div>
                    <div className="text-white/50 text-xs">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{countdown.hours}</div>
                    <div className="text-white/50 text-xs">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{countdown.minutes}</div>
                    <div className="text-white/50 text-xs">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{countdown.seconds}</div>
                    <div className="text-white/50 text-xs">Seconds</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-white/50 text-sm">Race has started or completed</p>
                </div>
              )}
              
              <div className="text-center">
                <p className="text-white/70 text-sm">
                  {formatDateTime(nextRace.race.date, nextRace.race.time)}
                </p>
                {nextRace.race.url && (
                  <a
                    href={nextRace.race.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-xs mt-2 inline-block"
                  >
                    View on Formula1.com →
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/50">No upcoming race found</p>
            </div>
          )}
        </div>
      ) : activeTab === 'standings' ? (
        <div className="space-y-3">
          <h4 className="text-white/70 text-sm font-medium mb-3">Driver Standings</h4>
          {drivers.map((driver, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {driver.position}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">
                    {driver.driver.name}
                  </div>
                  <div className="text-white/50 text-xs">{driver.constructor.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-sm">{driver.points}</div>
                <div className="text-white/50 text-xs">pts</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <h4 className="text-white/70 text-sm font-medium mb-3">Race Schedule</h4>
          {races.map((race, index) => (
            <div key={index} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white font-medium text-sm">{race.name}</div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRaceStatusColor(race.status)}`}>
                  {race.status.toUpperCase()}
                </div>
              </div>
              <div className="text-white/70 text-xs mb-1">
                {race.circuit}
              </div>
              <div className="text-white/50 text-xs">
                {race.location}, {race.country} • {formatDate(race.date)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
