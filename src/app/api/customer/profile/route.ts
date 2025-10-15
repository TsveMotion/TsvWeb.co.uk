import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(request: NextRequest) {
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

    // Get update data
    const { name, email, phone } = await request.json()

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Connect to database
    const client = await clientPromise
    const db = client.db()

    // Check if email is already taken by another user
    const existingUser = await db.collection('users').findOne({
      email: email.toLowerCase(),
      _id: { $ne: new ObjectId(userId) }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email is already in use' },
        { status: 400 }
      )
    }

    // Update user profile
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          name,
          email: email.toLowerCase(),
          phone: phone || null,
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
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
