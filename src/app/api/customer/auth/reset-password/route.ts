import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import crypto from 'crypto'
import { hash } from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
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
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10)

    // Update user's password and clear reset token
    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date()
        },
        $unset: {
          resetPasswordToken: '',
          resetPasswordExpires: ''
        }
      }
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Password has been reset successfully'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred resetting the password' },
      { status: 500 }
    )
  }
}
