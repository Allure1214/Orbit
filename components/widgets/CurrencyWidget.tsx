'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface CurrencyRate {
  code: string
  name: string
  rate: number
  change: number
}

interface CurrencyData {
  base: string
  baseName: string
  date: string
  rates: CurrencyRate[]
}

export default function CurrencyWidget() {
  const [data, setData] = useState<CurrencyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [baseCurrency, setBaseCurrency] = useState('USD')
  const [selectedCurrencies, setSelectedCurrencies] = useState(['EUR', 'GBP', 'JPY', 'CAD', 'AUD'])
  const [availableCurrencies, setAvailableCurrencies] = useState<{ [key: string]: string }>({})
  const [showSettings, setShowSettings] = useState(false)

  const fetchCurrencies = async () => {
    try {
      const response = await fetch('/api/currency', {
        method: 'POST'
      })
      if (response.ok) {
        const currencies = await response.json()
        setAvailableCurrencies(currencies)
      }
    } catch (error) {
      console.error('Error fetching currencies:', error)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const symbols = selectedCurrencies.join(',')
      const response = await fetch(`/api/currency?base=${baseCurrency}&symbols=${symbols}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch currency data')
      }
      
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching currency data:', error)
      setError('Failed to load currency data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrencies()
  }, [])

  useEffect(() => {
    if (selectedCurrencies.length > 0) {
      fetchData()
    }
  }, [baseCurrency, selectedCurrencies])

  const handleRefresh = () => {
    fetchData()
  }

  const handleCurrencyToggle = (currency: string) => {
    setSelectedCurrencies(prev => {
      if (prev.includes(currency)) {
        return prev.filter(c => c !== currency)
      } else {
        return [...prev, currency]
      }
    })
  }

  const formatRate = (rate: number) => {
    if (rate >= 1000) {
      return rate.toFixed(2)
    } else if (rate >= 1) {
      return rate.toFixed(4)
    } else {
      return rate.toFixed(6)
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500'
    if (change < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  if (loading && !data) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Currency Tracker</h3>
          <div className="w-6 h-6 bg-white/20 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="w-20 h-4 bg-white/20 rounded animate-pulse" />
              <div className="w-16 h-4 bg-white/20 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Currency Tracker</h3>
          <button
            onClick={handleRefresh}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center py-8">
          <div className="text-red-400 mb-2">⚠️</div>
          <p className="text-white/70 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Currency Tracker</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Settings"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h4 className="text-sm font-medium text-white mb-3">Settings</h4>
          
          {/* Base Currency Selection */}
          <div className="mb-4">
            <label className="block text-xs text-white/70 mb-2">Base Currency</label>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {Object.entries(availableCurrencies).map(([code, name]) => (
                <option key={code} value={code} className="bg-gray-800">
                  {code} - {name}
                </option>
              ))}
            </select>
          </div>

          {/* Currency Selection */}
          <div>
            <label className="block text-xs text-white/70 mb-2">Tracked Currencies</label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {Object.entries(availableCurrencies)
                .filter(([code]) => code !== baseCurrency)
                .map(([code, name]) => (
                  <label key={code} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCurrencies.includes(code)}
                      onChange={() => handleCurrencyToggle(code)}
                      className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50"
                    />
                    <span className="text-white/70">{code}</span>
                  </label>
                ))}
            </div>
          </div>
        </div>
      )}

      {data && (
        <>
          <div className="mb-4 text-sm text-white/70">
            <span className="font-medium">{data.baseName} ({data.base})</span>
            <span className="mx-2">•</span>
            <span>{new Date(data.date).toLocaleDateString()}</span>
          </div>

          <div className="space-y-3">
            {data.rates.map((rate) => (
              <div key={rate.code} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {rate.code.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-white font-medium">{rate.code}</div>
                    <div className="text-white/60 text-xs">{rate.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-mono text-lg">
                    {formatRate(rate.rate)}
                  </div>
                  <div className={`text-xs flex items-center justify-end space-x-1 ${getChangeColor(rate.change)}`}>
                    {getChangeIcon(rate.change)}
                    <span>{rate.change > 0 ? '+' : ''}{rate.change.toFixed(4)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.rates.length === 0 && (
            <div className="text-center py-8 text-white/70">
              <div className="text-4xl mb-2">💱</div>
              <p>No currencies selected</p>
              <p className="text-sm">Use settings to add currencies to track</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
