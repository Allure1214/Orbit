import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getGoogleCalendarAuthUrl } from '@/lib/google-calendar'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/signin`)
    }

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=user_not_found`)
    }

    // Generate Google Calendar OAuth URL
    const authUrl = getGoogleCalendarAuthUrl(user.id)
    
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Google Calendar OAuth initiation error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=google_calendar_auth_failed`)
  }
}
