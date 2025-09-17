import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get check-ins for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const checkIns = await prisma.checkIn.findMany({
      where: {
        userId: user.id,
        date: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Calculate current streak
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const checkInDates = checkIns.map(checkIn => {
      const date = new Date(checkIn.date)
      date.setHours(0, 0, 0, 0)
      return date.toISOString().split('T')[0]
    })

    let currentStreak = 0
    let currentDate = new Date(today)
    
    while (true) {
      const dateString = currentDate.toISOString().split('T')[0]
      if (checkInDates.includes(dateString)) {
        currentStreak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    // Check if user checked in today
    const todayString = today.toISOString().split('T')[0]
    const checkedInToday = checkInDates.includes(todayString)

    return NextResponse.json({
      checkIns,
      currentStreak,
      checkedInToday,
      totalCheckIns: checkIns.length
    })
  } catch (error) {
    console.error('Error fetching check-ins:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || null,
          image: session.user.image || null,
        }
      })
    }

    // Check if user already checked in today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const existingCheckIn = await prisma.checkIn.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today
        }
      }
    })

    if (existingCheckIn) {
      return NextResponse.json({ 
        error: 'Already checked in today',
        checkedInToday: true 
      }, { status: 400 })
    }

    // Create new check-in
    const checkIn = await prisma.checkIn.create({
      data: {
        userId: user.id,
        date: today
      }
    })

    // Calculate new streak
    const checkIns = await prisma.checkIn.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    const checkInDates = checkIns.map(checkIn => {
      const date = new Date(checkIn.date)
      date.setHours(0, 0, 0, 0)
      return date.toISOString().split('T')[0]
    })

    let currentStreak = 0
    let currentDate = new Date(today)
    
    while (true) {
      const dateString = currentDate.toISOString().split('T')[0]
      if (checkInDates.includes(dateString)) {
        currentStreak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return NextResponse.json({
      checkIn,
      currentStreak,
      checkedInToday: true,
      totalCheckIns: checkIns.length
    })
  } catch (error) {
    console.error('Error creating check-in:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
