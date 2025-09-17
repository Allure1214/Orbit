import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json()
    const { title, description, startDate, endDate, allDay, location, color, type } = body

    // Check if event exists and belongs to user
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        title: title || existingEvent.title,
        description: description !== undefined ? description : existingEvent.description,
        startDate: startDate ? new Date(startDate) : existingEvent.startDate,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : existingEvent.endDate,
        allDay: allDay !== undefined ? allDay : existingEvent.allDay,
        location: location !== undefined ? location : existingEvent.location,
        color: color || existingEvent.color,
        type: type || existingEvent.type
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if event exists and belongs to user
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    await prisma.event.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
