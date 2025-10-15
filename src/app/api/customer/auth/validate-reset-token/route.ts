import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { valid: false, message: 'Token is required' },
        { status: 400 }
      )
    }

    // Hash the token to compare with stored hash
    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    // Connect to database
    const client = await clientPromise
    const db = client.db()

    // Find user with this reset token (customer, admin, or editor)
    const user = await db.collection('users').findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() }, // Token not expired
      role: { $in: ['customer', 'admin', 'editor'] }
    })

    if (!user) {
      return NextResponse.json(
        { valid: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { valid: true, message: 'Token is valid' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Validate token error:', error)
    return NextResponse.json(
      { valid: false, message: 'An error occurred validating the token' },
      { status: 500 }
    )
  }
}
