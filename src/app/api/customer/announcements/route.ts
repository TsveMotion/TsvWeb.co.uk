import { NextRequest, NextResponse } from 'next/server'
import { verifyCustomerToken } from '@/lib/customer-auth'
import { connectToDatabase } from '@/lib/db'
import Announcement from '@/models/Announcement'

export const dynamic = 'force-dynamic'

// GET - Fetch active announcements for customers
export async function GET(request: NextRequest) {
  try {
    const user = await verifyCustomerToken(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const { searchParams} = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    // Build query for active, non-expired announcements
    const query: any = {
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    }

    // If unreadOnly, exclude announcements viewed by this user
    if (unreadOnly) {
      query['viewedBy.userId'] = { $ne: user.userId }
    }

    const announcements = await Announcement.find(query)
      .sort({ publishedAt: -1 })
      .select('title content type publishedAt expiresAt viewedBy')
      .lean()

    // Add isRead flag for each announcement
    const announcementsWithReadStatus = announcements.map(announcement => ({
      ...announcement,
      isRead: announcement.viewedBy.some(
        (view: any) => view.userId.toString() === user.userId.toString()
      )
    }))

    return NextResponse.json({
      success: true,
      announcements: announcementsWithReadStatus
    })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}

// POST - Mark announcement as read
export async function POST(request: NextRequest) {
  try {
    const user = await verifyCustomerToken(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const body = await request.json()
    const { announcementId } = body

    if (!announcementId) {
      return NextResponse.json(
        { success: false, message: 'Announcement ID is required' },
        { status: 400 }
      )
    }

    // Add user to viewedBy array if not already there
    await Announcement.findByIdAndUpdate(
      announcementId,
      {
        $addToSet: {
          viewedBy: {
            userId: user.userId,
            viewedAt: new Date()
          }
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Announcement marked as read'
    })
  } catch (error) {
    console.error('Error marking announcement as read:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to mark announcement as read' },
      { status: 500 }
    )
  }
}
