import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/db'
import Announcement from '@/models/Announcement'
import { User } from '@/models/User'
import { ObjectId } from 'mongodb'

interface Params {
  params: {
    id: string
  }
}

// Helper function to check admin authentication
async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    return { authenticated: false, error: 'Unauthorized' }
  }
  
  const userRole = (session.user as any).role
  if (userRole !== 'admin' && userRole !== 'editor') {
    return { authenticated: false, error: 'Forbidden: Admin access required' }
  }
  
  // Get user ID from database using email
  await connectToDatabase()
  const user = await User.findOne({ email: session.user.email }).select('_id').lean()
  
  if (!user) {
    return { authenticated: false, error: 'User not found' }
  }
  
  return { authenticated: true, userId: (user as any)._id }
}

// GET - Fetch single announcement
export async function GET(request: NextRequest, { params }: Params) {
  const auth = await checkAdminAuth()
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, message: auth.error },
      { status: auth.error === 'Unauthorized' ? 401 : 403 }
    )
  }

  try {
    await connectToDatabase()

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid announcement ID' },
        { status: 400 }
      )
    }

    const announcement = await Announcement.findById(params.id)
      .populate('createdBy', 'name email')
      .lean()

    if (!announcement) {
      return NextResponse.json(
        { success: false, message: 'Announcement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: announcement
    })
  } catch (error) {
    console.error('Error fetching announcement:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch announcement' },
      { status: 500 }
    )
  }
}

// PUT - Update announcement
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await checkAdminAuth()
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, message: auth.error },
      { status: auth.error === 'Unauthorized' ? 401 : 403 }
    )
  }

  try {
    await connectToDatabase()

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid announcement ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { title, message, type, priority, status, startDate, endDate, targetAudience } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (message !== undefined) updateData.message = message
    if (type !== undefined) updateData.type = type
    if (priority !== undefined) updateData.priority = priority
    if (status !== undefined) updateData.status = status
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null
    if (targetAudience !== undefined) updateData.targetAudience = targetAudience

    const announcement = await Announcement.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!announcement) {
      return NextResponse.json(
        { success: false, message: 'Announcement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Announcement updated successfully',
      announcement
    })
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update announcement' },
      { status: 500 }
    )
  }
}

// DELETE - Delete announcement
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await checkAdminAuth()
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, message: auth.error },
      { status: auth.error === 'Unauthorized' ? 401 : 403 }
    )
  }

  try {
    await connectToDatabase()

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid announcement ID' },
        { status: 400 }
      )
    }

    const announcement = await Announcement.findByIdAndDelete(params.id)

    if (!announcement) {
      return NextResponse.json(
        { success: false, message: 'Announcement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Announcement deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete announcement' },
      { status: 500 }
    )
  }
}
