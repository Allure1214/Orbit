import { NextRequest, NextResponse } from 'next/server'
import { oauth2Client } from '@/lib/google-calendar'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // This should contain the user ID
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=google_calendar_auth_failed`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=google_calendar_auth_failed`)
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    
    if (!tokens.access_token || !tokens.refresh_token) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=google_calendar_auth_failed`)
    }

    // Update user preferences with Google Calendar tokens
    await prisma.userPreferences.upsert({
      where: { userId: state },
      update: {
        googleCalendarEnabled: true,
        googleCalendarSync: true,
        googleCalendarId: 'primary' // Default to primary calendar
      },
      create: {
        userId: state,
        googleCalendarEnabled: true,
        googleCalendarSync: true,
        googleCalendarId: 'primary',
        theme: 'dark',
        monthlyBudget: 2000.0,
        currency: 'USD',
        newsCategories: ['technology', 'business', 'health'],
        enabledWidgets: {
          tasks: true,
          weather: true,
          finance: true,
          news: true,
          f1: true,
          notes: true,
          currency: true,
          calendar: true,
          pomodoro: true
        }
      }
    })

    // Store tokens securely (in production, use a secure token storage)
    // For now, we'll store them in the database (not recommended for production)
    await prisma.user.update({
      where: { id: state },
      data: {
        // In production, encrypt these tokens
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token
      }
    })

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?success=google_calendar_connected`)
  } catch (error) {
    console.error('Google Calendar OAuth error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=google_calendar_auth_failed`)
  }
}
