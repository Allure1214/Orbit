'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, Clock, MapPin, Edit2, Trash2, RefreshCw } from 'lucide-react'

interface Event {
  id: string
  title: string
  description?: string
  startDate: string
  endDate?: string
  allDay: boolean
  location?: string
  color: string
  type: string
  googleEventId?: string
  googleCalendarId?: string
}

interface GoogleCalendarStatus {
  enabled: boolean
  synced: boolean
  calendarId?: string
}

export default function CalendarWidget() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [filterType, setFilterType] = useState('ALL')
  const [googleCalendarStatus, setGoogleCalendarStatus] = useState<GoogleCalendarStatus>({
    enabled: false,
    synced: false
  })
  const [syncing, setSyncing] = useState(false)

  const eventTypes = [
    { value: 'ALL', label: 'All Events', color: '#6B7280' },
    { value: 'PERSONAL', label: 'Personal', color: '#3B82F6' },
    { value: 'WORK', label: 'Work', color: '#10B981' },
    { value: 'MEETING', label: 'Meeting', color: '#F59E0B' },
    { value: 'DEADLINE', label: 'Deadline', color: '#EF4444' },
    { value: 'BIRTHDAY', label: 'Birthday', color: '#EC4899' },
    { value: 'HOLIDAY', label: 'Holiday', color: '#8B5CF6' },
    { value: 'F1_RACE', label: 'F1 Race', color: '#DC2626' },
    { value: 'GOOGLE_CALENDAR', label: 'Google Calendar', color: '#4285F4' }
  ]

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const startDate = new Date(selectedDate)
      startDate.setDate(1) // First day of month
      const endDate = new Date(selectedDate)
      endDate.setMonth(endDate.getMonth() + 1)
      endDate.setDate(0) // Last day of month

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        type: filterType
      })

      const response = await fetch(`/api/events?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const fetchGoogleCalendarStatus = async () => {
    try {
      const response = await fetch('/api/preferences')
      if (response.ok) {
        const prefs = await response.json()
        setGoogleCalendarStatus({
          enabled: prefs.googleCalendarEnabled || false,
          synced: prefs.googleCalendarSync || false,
          calendarId: prefs.googleCalendarId
        })
      }
    } catch (error) {
      console.error('Error fetching Google Calendar status:', error)
    }
  }

  const connectGoogleCalendar = () => {
    // Redirect to Google OAuth
    window.location.href = '/api/auth/google-calendar'
  }

  const syncGoogleCalendar = async () => {
    setSyncing(true)
    try {
      const response = await fetch('/api/calendar/google-sync', {
        method: 'GET'
      })
      
      if (response.ok) {
        const result = await response.json()
        setGoogleCalendarStatus(prev => ({ ...prev, synced: true }))
        // Refresh events to show synced ones
        fetchEvents()
      } else {
        throw new Error('Failed to sync Google Calendar')
      }
    } catch (error) {
      console.error('Error syncing Google Calendar:', error)
      setError('Failed to sync Google Calendar')
    } finally {
      setSyncing(false)
    }
  }

  const disconnectGoogleCalendar = async () => {
    try {
      const response = await fetch('/api/calendar/google-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'disconnect' })
      })
      
      if (response.ok) {
        setGoogleCalendarStatus({
          enabled: false,
          synced: false
        })
        // Refresh events to remove Google Calendar events
        fetchEvents()
      } else {
        throw new Error('Failed to disconnect Google Calendar')
      }
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error)
      setError('Failed to disconnect Google Calendar')
    }
  }

  useEffect(() => {
    fetchEvents()
    fetchGoogleCalendarStatus()
  }, [selectedDate, filterType])

  const handleAddEvent = async (eventData: Partial<Event>) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      })

      if (response.ok) {
        const newEvent = await response.json()
        setEvents(prev => [...prev, newEvent])
        setShowAddForm(false)
      } else {
        throw new Error('Failed to create event')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      setError('Failed to create event')
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setEvents(prev => prev.filter(event => event.id !== eventId))
      } else {
        throw new Error('Failed to delete event')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      setError('Failed to delete event')
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getUpcomingEvents = () => {
    const now = new Date()
    return events
      .filter(event => new Date(event.startDate) >= now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 5)
  }

  const getEventTypeColor = (type: string) => {
    const eventType = eventTypes.find(et => et.value === type)
    return eventType?.color || '#3B82F6'
  }

  if (loading && events.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Calendar</h3>
          <div className="w-6 h-6 bg-white/20 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-white/20 rounded-full animate-pulse" />
              <div className="w-32 h-4 bg-white/20 rounded animate-pulse" />
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
          <h3 className="text-lg font-semibold text-white">Calendar</h3>
          <button
            onClick={fetchEvents}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center py-8">
          <div className="text-red-400 mb-2">⚠️</div>
          <p className="text-white/70 mb-4">{error}</p>
          <button
            onClick={fetchEvents}
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
        <h3 className="text-lg font-semibold text-white">Calendar</h3>
        <div className="flex items-center space-x-2">
          {/* Google Calendar Integration */}
          {!googleCalendarStatus.enabled ? (
            <button
              onClick={connectGoogleCalendar}
              className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
              title="Connect Google Calendar"
            >
              Connect Google
            </button>
          ) : (
            <div className="flex items-center space-x-1">
              <button
                onClick={syncGoogleCalendar}
                disabled={syncing}
                className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm disabled:opacity-50"
                title="Sync Google Calendar"
              >
                {syncing ? 'Syncing...' : 'Sync'}
              </button>
              <button
                onClick={disconnectGoogleCalendar}
                className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                title="Disconnect Google Calendar"
              >
                ×
              </button>
            </div>
          )}
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Add Event"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          {eventTypes.map(type => (
            <option key={type.value} value={type.value} className="bg-gray-800">
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <AddEventForm 
          onAdd={handleAddEvent}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Events List */}
      <div className="space-y-3">
        {getUpcomingEvents().map((event) => (
          <div key={event.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: getEventTypeColor(event.type) }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium truncate">{event.title}</div>
              <div className="flex items-center space-x-2 text-white/60 text-sm">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(event.startDate)}</span>
                {!event.allDay && (
                  <>
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(event.startDate)}</span>
                  </>
                )}
                {event.location && (
                  <>
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{event.location}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="p-1 text-white/50 hover:text-red-400 transition-colors"
                title="Delete Event"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {getUpcomingEvents().length === 0 && (
        <div className="text-center py-8 text-white/70">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-white/30" />
          <p>No upcoming events</p>
          <p className="text-sm">Add an event to get started</p>
        </div>
      )}
    </div>
  )
}

// Add Event Form Component
function AddEventForm({ onAdd, onCancel }: { onAdd: (event: Partial<Event>) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: '',
    allDay: false,
    location: '',
    color: '#3B82F6',
    type: 'PERSONAL'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) return

    onAdd({
      ...formData,
      endDate: formData.endDate || undefined
    })

    // Reset form
    setFormData({
      title: '',
      description: '',
      startDate: new Date().toISOString().slice(0, 16),
      endDate: '',
      allDay: false,
      location: '',
      color: '#3B82F6',
      type: 'PERSONAL'
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Event title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <input
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            required
          />
          <input
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="PERSONAL" className="bg-gray-800">Personal</option>
            <option value="WORK" className="bg-gray-800">Work</option>
            <option value="MEETING" className="bg-gray-800">Meeting</option>
            <option value="DEADLINE" className="bg-gray-800">Deadline</option>
            <option value="BIRTHDAY" className="bg-gray-800">Birthday</option>
            <option value="HOLIDAY" className="bg-gray-800">Holiday</option>
            <option value="F1_RACE" className="bg-gray-800">F1 Race</option>
            <option value="OTHER" className="bg-gray-800">Other</option>
          </select>
          <input
            type="text"
            placeholder="Location (optional)"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-white/70 text-sm">
            <input
              type="checkbox"
              checked={formData.allDay}
              onChange={(e) => setFormData(prev => ({ ...prev, allDay: e.target.checked }))}
              className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50"
            />
            <span>All day</span>
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
          >
            Add Event
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
