import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { fetchGoogleCalendarEvents, transformGoogleEventToLocal } from '@/lib/google-calendar'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user with preferences and tokens
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { preferences: true }
    })

    if (!user || !user.preferences?.googleCalendarEnabled) {
      return NextResponse.json({ error: 'Google Calendar not enabled' }, { status: 400 })
    }

    if (!user.googleAccessToken || !user.googleRefreshToken) {
      return NextResponse.json({ error: 'Google Calendar not connected' }, { status: 400 })
    }

    // Fetch events from Google Calendar
    const googleEvents = await fetchGoogleCalendarEvents(
      user.googleAccessToken,
      user.googleRefreshToken,
      user.preferences.googleCalendarId || 'primary'
    )

    // Transform Google events to local format
    const transformedEvents = googleEvents.map(transformGoogleEventToLocal)

    // Get existing local events to avoid duplicates
    const existingEvents = await prisma.event.findMany({
      where: {
        userId: user.id,
        type: 'GOOGLE_CALENDAR'
      }
    })

    const existingGoogleIds = new Set(existingEvents.map(e => e.googleEventId).filter(Boolean))

    // Filter out events that already exist
    const newEvents = transformedEvents.filter(event => 
      event.googleEventId && !existingGoogleIds.has(event.googleEventId)
    )

    // Create new events in database
    const createdEvents = []
    for (const event of newEvents) {
      try {
        const createdEvent = await prisma.event.create({
          data: {
            title: event.title,
            description: event.description,
            startDate: new Date(event.startDate),
            endDate: event.endDate ? new Date(event.endDate) : null,
            allDay: event.allDay,
            location: event.location,
            color: event.color,
            type: 'GOOGLE_CALENDAR',
            userId: user.id,
            googleEventId: event.googleEventId,
            googleCalendarId: event.googleCalendarId
          }
        })
        createdEvents.push(createdEvent)
      } catch (error) {
        console.error('Error creating event:', error)
      }
    }

    return NextResponse.json({
      success: true,
      syncedEvents: createdEvents.length,
      totalGoogleEvents: googleEvents.length,
      events: createdEvents
    })
  } catch (error) {
    console.error('Error syncing Google Calendar:', error)
    return NextResponse.json({ error: 'Failed to sync Google Calendar' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()

    if (action === 'disconnect') {
      // Disconnect Google Calendar
      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          googleAccessToken: null,
          googleRefreshToken: null
        }
      })

      await prisma.userPreferences.updateMany({
        where: { 
          user: { email: session.user.email }
        },
        data: {
          googleCalendarEnabled: false,
          googleCalendarSync: false,
          googleCalendarId: null
        }
      })

      // Delete all Google Calendar events
      await prisma.event.deleteMany({
        where: {
          user: { email: session.user.email },
          type: 'GOOGLE_CALENDAR'
        }
      })

      return NextResponse.json({ success: true, message: 'Google Calendar disconnected' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error handling Google Calendar action:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
