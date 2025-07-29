import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { User } from '@/models/User'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectToDatabase()

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return NextResponse.json(
        { success: true, message: 'If your email exists in our database, you will receive a password reset link' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour from now

    // Save token to user
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetTokenExpiry
    await user.save()

    // In a production environment, send an email with the reset link
    // For demo purposes, we'll just return the token in the response
    // In real-world, NEVER return the token in the response
    
    /* 
    Example email code (not implemented):
    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) requested a password reset.
            Please click on the following link, or paste it into your browser to complete the process:
            ${process.env.APP_URL}/admin/reset-password?token=${resetToken}
            If you did not request this, please ignore this email and your password will remain unchanged.`
    })
    */

    // For demo purposes:
    const resetLink = `/admin/reset-password?token=${resetToken}`
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Password reset email sent',
        // Only in development/demo, include the token and link
        ...(process.env.NODE_ENV !== 'production' ? { resetToken, resetLink } : {})
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}
