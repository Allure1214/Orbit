'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserPreferences {
  id: string
  theme: string
  monthlyBudget: number
  currency: string
  weatherLocation?: string
  newsCategories: string[]
  dashboardLayout?: any
}

export default function PreferencesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
    { value: 'EUR', label: 'Euro (€)', symbol: '€' },
    { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
    { value: 'MYR', label: 'Malaysian Ringgit (RM)', symbol: 'RM' },
    { value: 'SGD', label: 'Singapore Dollar (S$)', symbol: 'S$' },
    { value: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥' },
    { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
    { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' }
  ]

  const newsCategoryOptions = [
    'technology', 'business', 'health', 'science', 'sports', 
    'entertainment', 'politics', 'world', 'local'
  ]

  // Fetch preferences on component mount
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchPreferences()
  }, [session, status, router])

  const fetchPreferences = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/preferences')
      if (!response.ok) {
        throw new Error('Failed to fetch preferences')
      }
      const data = await response.json()
      setPreferences(data)
    } catch (err) {
      setError('Failed to load preferences')
      console.error('Error fetching preferences:', err)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    if (!preferences) return

    try {
      setSaving(true)
      setError(null)
      
      const response = await fetch('/api/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error('Failed to save preferences')
      }

      // Show success message briefly
      const successMessage = document.createElement('div')
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50'
      successMessage.textContent = 'Preferences saved successfully!'
      document.body.appendChild(successMessage)
      setTimeout(() => {
        document.body.removeChild(successMessage)
      }, 3000)

    } catch (err) {
      setError('Failed to save preferences')
      console.error('Error saving preferences:', err)
    } finally {
      setSaving(false)
    }
  }

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    if (!preferences) return
    setPreferences({ ...preferences, [key]: value })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Preferences</h1>
            <p className="text-white/70">Customize your Orbit dashboard experience</p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 text-sm mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {preferences && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Financial Settings */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="text-2xl mr-3">💰</span>
                Financial Settings
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Monthly Budget
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-white/50">
                      {currencies.find(c => c.value === preferences.currency)?.symbol || '$'}
                    </span>
                    <input
                      type="number"
                      value={preferences.monthlyBudget}
                      onChange={(e) => updatePreference('monthlyBudget', parseFloat(e.target.value) || 0)}
                      className="flex-1 bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <p className="text-white/50 text-xs mt-1">
                    Set your monthly spending limit for budget tracking
                  </p>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Currency
                  </label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => updatePreference('currency', e.target.value)}
                    className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2"
                  >
                    {currencies.map(currency => (
                      <option key={currency.value} value={currency.value} className="bg-gray-800">
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="text-2xl mr-3">🎨</span>
                Appearance
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Theme
                  </label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => updatePreference('theme', e.target.value)}
                    className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2"
                  >
                    <option value="dark" className="bg-gray-800">Dark</option>
                    <option value="light" className="bg-gray-800">Light</option>
                    <option value="auto" className="bg-gray-800">Auto</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Weather Settings */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="text-2xl mr-3">🌤️</span>
                Weather
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Default Location
                  </label>
                  <input
                    type="text"
                    value={preferences.weatherLocation || ''}
                    onChange={(e) => updatePreference('weatherLocation', e.target.value)}
                    placeholder="e.g., Kuala Lumpur, Malaysia"
                    className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 placeholder-white/50"
                  />
                  <p className="text-white/50 text-xs mt-1">
                    Leave empty to use your current location
                  </p>
                </div>
              </div>
            </div>

            {/* News Settings */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="text-2xl mr-3">📰</span>
                News Categories
              </h2>
              
              <div className="space-y-4">
                <p className="text-white/70 text-sm">
                  Select the news categories you want to see on your dashboard
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {newsCategoryOptions.map(category => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.newsCategories.includes(category)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...preferences.newsCategories, category]
                            : preferences.newsCategories.filter(c => c !== category)
                          updatePreference('newsCategories', newCategories)
                        }}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                      />
                      <span className="text-white text-sm capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        {preferences && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={savePreferences}
              disabled={saving}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
