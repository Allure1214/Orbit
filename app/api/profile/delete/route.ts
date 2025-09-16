import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// DELETE /api/profile/delete - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { confirmEmail } = await request.json()

    // Verify email confirmation
    if (confirmEmail !== session.user.email) {
      return NextResponse.json({ error: 'Email confirmation does not match' }, { status: 400 })
    }

    // Delete user and all related data (cascade will handle this)
    await prisma.user.delete({
      where: { email: session.user.email }
    })

    return NextResponse.json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
