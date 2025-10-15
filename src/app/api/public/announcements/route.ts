import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Announcement from '@/models/Announcement'

// GET - Fetch active public announcements
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Build query for active, non-expired, public announcements
    const query: any = {
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ],
      // Only show announcements for 'public' or 'all' audiences
      targetAudience: { $in: ['public', 'all'] }
    }

    const announcements = await Announcement.find(query)
      .sort({ publishedAt: -1 })
      .select('title content type displayLocation targetAudience publishedAt')
      .lean()

    return NextResponse.json({
      success: true,
      announcements
    })
  } catch (error) {
    console.error('Error fetching public announcements:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}
