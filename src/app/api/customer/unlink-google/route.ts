import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('customer-auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any
    const userId = decoded.userId

    // Connect to database
    const client = await clientPromise
    const db = client.db()

    // Unlink Google account
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      {
        $unset: {
          googleId: '',
          googleEmail: ''
        },
        $set: {
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Google account unlinked successfully'
    })

  } catch (error) {
    console.error('Google unlinking error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
