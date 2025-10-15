import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import crypto from 'crypto'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Connect to database
    const client = await clientPromise
    const db = client.db()

    // Find user by email (customer or admin)
    const user = await db.collection('users').findOne({ 
      email: email.toLowerCase(),
      role: { $in: ['customer', 'admin', 'editor'] }
    })

    // If user doesn't exist, return success without sending email (prevent enumeration)
    if (!user) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'If an account exists with this email, a reset link has been sent.' 
        },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    // Set token expiry (1 hour)
    const resetTokenExpiry = new Date(Date.now() + 3600000)

    // Save token to user
    await db.collection('users').updateOne(
      { _id: user._id },
      { 
        $set: { 
          resetPasswordToken: resetTokenHash,
          resetPasswordExpires: resetTokenExpiry,
          updatedAt: new Date()
        }
      }
    )

    // Create reset URL based on user role
    const isAdmin = user.role === 'admin' || user.role === 'editor'
    const resetPath = isAdmin ? '/admin/reset-password' : '/customer/reset-password'
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${resetPath}?token=${resetToken}`

    // Send email using Resend
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'TsvWeb <hello@mail.tsvweb.com>',
        to: email,
        subject: 'Password Reset Request - TsvWeb',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                  <p>Hi ${user.name || 'there'},</p>
                  <p>You requested to reset your password for your TsvWeb ${user.role === 'customer' ? 'customer' : 'admin'} account. Click the button below to reset it:</p>
                  <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                  </div>
                  <p>Or copy and paste this link into your browser:</p>
                  <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
                  <p><strong>This link will expire in 1 hour.</strong></p>
                  <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
                  <div class="footer">
                    <p>© ${new Date().getFullYear()} TsvWeb. All rights reserved.</p>
                    <p>Birmingham, UK</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      })

      return NextResponse.json(
        { 
          success: true, 
          message: 'If an account exists with this email, a reset link has been sent.' 
        },
        { status: 200 }
      )
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send reset email. Please try again later.' 
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
