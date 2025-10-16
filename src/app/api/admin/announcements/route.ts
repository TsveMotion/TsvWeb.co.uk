import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/db'
import Announcement from '@/models/Announcement'
import { User } from '@/models/User'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Helper function to check admin authentication
async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    return { authenticated: false, error: 'Unauthorized' }
  }
  
  const userRole = (session.user as any).role
  if (userRole !== 'admin' && userRole !== 'editor') {
    return { authenticated: false, error: 'Forbidden: Admin access required' }
  }
  
  // Get user ID from database using email
  await connectToDatabase()
  const user = await User.findOne({ email: session.user.email }).select('_id').lean()
  
  if (!user) {
    return { authenticated: false, error: 'User not found' }
  }
  
  return { authenticated: true, userId: (user as any)._id.toString() }
}

// GET - Fetch all announcements (admin view)
export async function GET(request: NextRequest) {
  const auth = await checkAdminAuth()
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, message: auth.error },
      { status: auth.error === 'Unauthorized' ? 401 : 403 }
    )
  }

  try {
    await connectToDatabase()

    const announcements = await Announcement.find({})
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      data: announcements
    })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}

// Email HTML template
function getAnnouncementEmailHTML(title: string, content: string, type: string) {
  const typeColors = {
    info: { bg: '#3B82F6', border: '#2563EB' },
    success: { bg: '#10B981', border: '#059669' },
    warning: { bg: '#F59E0B', border: '#D97706' },
    urgent: { bg: '#EF4444', border: '#DC2626' }
  }

  const colors = typeColors[type as keyof typeof typeColors] || typeColors.info

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">TsvWeb</h1>
              <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 14px;">Customer Portal Announcement</p>
            </td>
          </tr>
          
          <!-- Announcement Badge -->
          <tr>
            <td style="padding: 30px 40px 0;">
              <div style="display: inline-block; padding: 8px 16px; background-color: ${colors.bg}; color: #ffffff; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                ${type}
              </div>
            </td>
          </tr>
          
          <!-- Title -->
          <tr>
            <td style="padding: 20px 40px 0;">
              <h2 style="margin: 0; color: #111827; font-size: 24px; font-weight: 700; line-height: 1.3;">
                ${title}
              </h2>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 20px 40px;">
              <div style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                ${content.replace(/\n/g, '<br>')}
              </div>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 20px 40px 40px;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <a href="${process.env.NEXTAUTH_URL}/customer/dashboard" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
                      View Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                This announcement was sent to all TsvWeb customers.
              </p>
              <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} TsvWeb. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// POST - Create new announcement and send emails
export async function POST(request: NextRequest) {
  const auth = await checkAdminAuth()
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, message: auth.error },
      { status: auth.error === 'Unauthorized' ? 401 : 403 }
    )
  }

  try {
    await connectToDatabase()

    const body = await request.json()
    const { title, message, type, priority, status, startDate, endDate, targetAudience, displayLocation, sendEmail } = body

    // Validation
    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: 'Title and message are required' },
        { status: 400 }
      )
    }

    // Create announcement
    const announcement = await Announcement.create({
      title,
      message,
      type: type || 'info',
      priority: priority || 'medium',
      status: status || 'active',
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      targetAudience: targetAudience || 'all',
      displayLocation: displayLocation || ['header'],
      isActive: status === 'active',
      publishedAt: status === 'active' ? new Date() : null,
      createdBy: auth.userId
    })

    // Send email if requested
    if (sendEmail && status === 'active') {
      try {
        // Import Resend dynamically to avoid errors if not configured
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        
        // Get all customer emails
        const { User } = await import('@/models/User')
        const customers = await User.find({ role: 'customer' }).select('email').lean()
        const emails = customers.map((c: any) => c.email).filter(Boolean)
        
        if (emails.length > 0) {
          // Send in batches of 50
          const batchSize = 50
          for (let i = 0; i < emails.length; i += batchSize) {
            const batch = emails.slice(i, i + batchSize)
            await resend.emails.send({
              from: process.env.EMAIL_FROM || 'TsvWeb <noreply@tsvweb.com>',
              to: batch,
              subject: title,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">${title}</h1>
                  </div>
                  <div style="padding: 30px; background: #f9fafb;">
                    <p style="font-size: 16px; line-height: 1.6; color: #374151;">${message}</p>
                  </div>
                  <div style="padding: 20px; text-align: center; background: #e5e7eb;">
                    <p style="color: #6b7280; font-size: 14px;">TsvWeb - Web Design Birmingham</p>
                  </div>
                </div>
              `
            })
          }
          
          // Update announcement to mark email as sent
          announcement.emailSent = true
          announcement.emailSentAt = new Date()
          await announcement.save()
        }
      } catch (emailError) {
        console.error('Error sending emails:', emailError)
        // Don't fail the announcement creation if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create announcement' },
      { status: 500 }
    )
  }
}

