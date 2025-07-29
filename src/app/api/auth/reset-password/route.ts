import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { User } from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

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

    // Connect to database
    await connectToDatabase()

    // Find user by reset token and ensure the token hasn't expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Password reset token is invalid or has expired' },
        { status: 400 }
      )
    }

    // Update user's password and clear reset token fields
    user.password = password // The User model will hash this before saving
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    return NextResponse.json(
      { success: true, message: 'Password has been reset successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}
