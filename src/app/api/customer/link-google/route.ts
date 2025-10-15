import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { getServerSession } from 'next-auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    // Get customer token from cookie
    const token = request.cookies.get('customer-auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No customer session' },
        { status: 401 }
      )
    }

    // Verify customer token
    const decoded = verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any
    const userId = decoded.userId

    // Get NextAuth session (Google OAuth)
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'No Google session found' },
        { status: 400 }
      )
    }

    // Connect to database
    const client = await clientPromise
    const db = client.db()

    // Get customer
    const customer = await db.collection('users').findOne({ _id: new ObjectId(userId) })

    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      )
    }

    // Check if Google account is already linked to another user
    const existingLink = await db.collection('users').findOne({
      googleEmail: session.user.email,
      _id: { $ne: new ObjectId(userId) }
    })

    if (existingLink) {
      return NextResponse.json(
        { success: false, message: 'This Google account is already linked to another user' },
        { status: 400 }
      )
    }

    // Link Google account to customer
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          googleId: (session.user as any).id || session.user.email,
          googleEmail: session.user.email,
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Google account linked successfully',
      googleEmail: session.user.email
    })

  } catch (error) {
    console.error('Google linking error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
