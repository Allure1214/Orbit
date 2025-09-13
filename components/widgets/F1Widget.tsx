'use client'

import { useState, useEffect } from 'react'

interface F1Driver {
  position: string
  points: string
  driver: {
    givenName: string
    familyName: string
  }
  constructor: {
    name: string
  }
}

interface F1Race {
  round: string
  raceName: string
  date: string
  circuit: {
    circuitName: string
    location: {
      country: string
      locality: string
    }
  }
}

export default function F1Widget() {
  const [drivers, setDrivers] = useState<F1Driver[]>([])
  const [races, setRaces] = useState<F1Race[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'standings' | 'races'>('standings')

  // Mock F1 data
  useEffect(() => {
    const mockDrivers: F1Driver[] = [
      { position: '1', points: '575', driver: { givenName: 'Max', familyName: 'Verstappen' }, constructor: { name: 'Red Bull Racing' } },
      { position: '2', points: '285', driver: { givenName: 'Sergio', familyName: 'Perez' }, constructor: { name: 'Red Bull Racing' } },
      { position: '3', points: '234', driver: { givenName: 'Lewis', familyName: 'Hamilton' }, constructor: { name: 'Mercedes' } },
      { position: '4', points: '206', driver: { givenName: 'Fernando', familyName: 'Alonso' }, constructor: { name: 'Aston Martin' } },
      { position: '5', points: '169', driver: { givenName: 'Carlos', familyName: 'Sainz' }, constructor: { name: 'Ferrari' } },
    ]

    const mockRaces: F1Race[] = [
      { round: '1', raceName: 'Bahrain Grand Prix', date: '2024-03-02', circuit: { circuitName: 'Bahrain International Circuit', location: { country: 'Bahrain', locality: 'Sakhir' } } },
      { round: '2', raceName: 'Saudi Arabian Grand Prix', date: '2024-03-09', circuit: { circuitName: 'Jeddah Corniche Circuit', location: { country: 'Saudi Arabia', locality: 'Jeddah' } } },
      { round: '3', raceName: 'Australian Grand Prix', date: '2024-03-24', circuit: { circuitName: 'Albert Park Circuit', location: { country: 'Australia', locality: 'Melbourne' } } },
      { round: '4', raceName: 'Japanese Grand Prix', date: '2024-04-07', circuit: { circuitName: 'Suzuka International Racing Course', location: { country: 'Japan', locality: 'Suzuka' } } },
    ]

    setTimeout(() => {
      setDrivers(mockDrivers)
      setRaces(mockRaces)
      setLoading(false)
    }, 1000)
  }, [])

  const getConstructorColor = (constructor: string) => {
    const colors: { [key: string]: string } = {
      'Red Bull Racing': 'bg-blue-500/20 text-blue-400',
      'Mercedes': 'bg-teal-500/20 text-teal-400',
      'Ferrari': 'bg-red-500/20 text-red-400',
      'Aston Martin': 'bg-green-500/20 text-green-400',
      'McLaren': 'bg-orange-500/20 text-orange-400',
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
        <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white/5 rounded-lg p-1">
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
      {activeTab === 'standings' ? (
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
                    {driver.driver.givenName} {driver.driver.familyName}
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
          <h4 className="text-white/70 text-sm font-medium mb-3">Upcoming Races</h4>
          {races.map((race, index) => (
            <div key={index} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white font-medium text-sm">{race.raceName}</div>
                <div className="text-white/50 text-xs">Round {race.round}</div>
              </div>
              <div className="text-white/70 text-xs mb-1">
                {race.circuit.circuitName}
              </div>
              <div className="text-white/50 text-xs">
                {race.circuit.location.locality}, {race.circuit.location.country} • {formatDate(race.date)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
