import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/preferences - Get user preferences
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { preferences: true }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || null,
          image: session.user.image || null,
        },
        include: { preferences: true }
      })
    }

    // Create default preferences if they don't exist
    if (!user.preferences) {
      const preferences = await prisma.userPreferences.create({
        data: {
          userId: user.id,
          theme: 'dark',
          monthlyBudget: 2000.0,
          currency: 'USD',
          newsCategories: ['technology', 'business', 'health']
        }
      })
      return NextResponse.json(preferences)
    }

    return NextResponse.json(user.preferences)
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/preferences - Update user preferences
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { theme, monthlyBudget, currency, weatherLocation, newsCategories, dashboardLayout, enabledWidgets } = body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update or create preferences
    const preferences = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        ...(theme && { theme }),
        ...(monthlyBudget !== undefined && { monthlyBudget: parseFloat(monthlyBudget) }),
        ...(currency && { currency }),
        ...(weatherLocation && { weatherLocation }),
        ...(newsCategories && { newsCategories }),
        ...(dashboardLayout && { dashboardLayout }),
        ...(enabledWidgets && { enabledWidgets })
      },
      create: {
        userId: user.id,
        theme: theme || 'dark',
        monthlyBudget: monthlyBudget ? parseFloat(monthlyBudget) : 2000.0,
        currency: currency || 'USD',
        weatherLocation: weatherLocation || null,
        newsCategories: newsCategories || ['technology', 'business', 'health'],
        dashboardLayout: dashboardLayout || null,
        enabledWidgets: enabledWidgets || {
          tasks: true,
          weather: true,
          finance: true,
          news: true,
          f1: true,
          notes: true
        } as any
      }
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
