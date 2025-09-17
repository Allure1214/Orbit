import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

// Google Calendar API configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google-calendar/callback'

export const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
)

export function getGoogleCalendarAuthUrl(userId: string) {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events'
  ]

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: userId, // Pass user ID in state for security
    prompt: 'consent'
  })
}

export async function getGoogleCalendarClient(accessToken: string, refreshToken: string) {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

export async function fetchGoogleCalendarEvents(accessToken: string, refreshToken: string, calendarId: string = 'primary', timeMin?: string, timeMax?: string) {
  try {
    const calendar = await getGoogleCalendarClient(accessToken, refreshToken)
    
    const response = await calendar.events.list({
      calendarId,
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Next 30 days
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 50
    })

    return response.data.items || []
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error)
    throw error
  }
}

export async function createGoogleCalendarEvent(accessToken: string, refreshToken: string, event: any, calendarId: string = 'primary') {
  try {
    const calendar = await getGoogleCalendarClient(accessToken, refreshToken)
    
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event
    })

    return response.data
  } catch (error) {
    console.error('Error creating Google Calendar event:', error)
    throw error
  }
}

export async function updateGoogleCalendarEvent(accessToken: string, refreshToken: string, eventId: string, event: any, calendarId: string = 'primary') {
  try {
    const calendar = await getGoogleCalendarClient(accessToken, refreshToken)
    
    const response = await calendar.events.update({
      calendarId,
      eventId,
      requestBody: event
    })

    return response.data
  } catch (error) {
    console.error('Error updating Google Calendar event:', error)
    throw error
  }
}

export async function deleteGoogleCalendarEvent(accessToken: string, refreshToken: string, eventId: string, calendarId: string = 'primary') {
  try {
    const calendar = await getGoogleCalendarClient(accessToken, refreshToken)
    
    await calendar.events.delete({
      calendarId,
      eventId
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error)
    throw error
  }
}

export function transformGoogleEventToLocal(googleEvent: any) {
  return {
    id: googleEvent.id,
    title: googleEvent.summary || 'No Title',
    description: googleEvent.description || null,
    startDate: googleEvent.start?.dateTime || googleEvent.start?.date,
    endDate: googleEvent.end?.dateTime || googleEvent.end?.date,
    allDay: !googleEvent.start?.dateTime, // If no time, it's all day
    location: googleEvent.location || null,
    color: googleEvent.colorId ? `#${googleEvent.colorId}` : '#3B82F6',
    type: 'GOOGLE_CALENDAR',
    googleEventId: googleEvent.id,
    googleCalendarId: googleEvent.organizer?.email || 'primary'
  }
}

export function transformLocalEventToGoogle(localEvent: any) {
  const event: any = {
    summary: localEvent.title,
    description: localEvent.description || '',
    location: localEvent.location || '',
    start: localEvent.allDay ? {
      date: localEvent.startDate.split('T')[0]
    } : {
      dateTime: localEvent.startDate,
      timeZone: 'UTC'
    },
    end: localEvent.allDay ? {
      date: localEvent.endDate ? localEvent.endDate.split('T')[0] : localEvent.startDate.split('T')[0]
    } : {
      dateTime: localEvent.endDate || localEvent.startDate,
      timeZone: 'UTC'
    }
  }

  return event
}
