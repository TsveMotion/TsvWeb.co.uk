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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') // 'active', 'expired', 'all'

    const skip = (page - 1) * limit

    // Build query
    let query: any = {}
    
    if (status === 'active') {
      query.isActive = true
      query.$or = [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    } else if (status === 'expired') {
      query.expiresAt = { $lte: new Date() }
    }

    const announcements = await Announcement.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .lean()

    const total = await Announcement.countDocuments(query)

    return NextResponse.json({
      success: true,
      announcements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
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
    const { title, content, type, targetAudience, displayLocation, expiresAt, sendEmail } = body

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Create announcement
    const announcement = await Announcement.create({
      title,
      content,
      type: type || 'info',
      targetAudience: targetAudience || 'customers',
      displayLocation: displayLocation || ['dashboard'],
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true,
      publishedAt: new Date(),
      createdBy: auth.userId,
      emailSent: false
    })

    // Send emails if requested
    if (sendEmail) {
      try {
        // Build query based on target audience
        let userQuery: any = { email: { $exists: true, $ne: null } }
        
        if (targetAudience === 'customers') {
          userQuery.role = 'customer'
        } else if (targetAudience === 'admins') {
          userQuery.role = { $in: ['admin', 'editor'] }
        } else if (targetAudience === 'all') {
          // Send to all users (customers and admins)
          userQuery.role = { $in: ['customer', 'admin', 'editor'] }
        }
        // For 'public', don't send emails (public is for website visitors)
        
        if (targetAudience !== 'public') {
          const recipients = await User.find(userQuery).select('email name').lean()

          if (recipients.length > 0) {
            const emailHTML = getAnnouncementEmailHTML(title, content, type || 'info')
            
            // Send emails in batches to avoid rate limits
            const batchSize = 50
            for (let i = 0; i < recipients.length; i += batchSize) {
              const batch = recipients.slice(i, i + batchSize)
              
              await Promise.all(
                batch.map(recipient =>
                  resend.emails.send({
                    from: process.env.EMAIL_FROM || 'TsvWeb <hello@mail.tsvweb.com>',
                    to: recipient.email,
                    subject: `📢 ${title}`,
                    html: emailHTML
                  }).catch(err => {
                    console.error(`Failed to send email to ${recipient.email}:`, err)
                    return null
                  })
                )
              )
            }

            // Update announcement to mark email as sent
            await Announcement.findByIdAndUpdate(announcement._id, {
              emailSent: true,
              emailSentAt: new Date()
            })
          }
        }
      } catch (emailError) {
        console.error('Error sending announcement emails:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Announcement created successfully',
      announcement
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create announcement' },
      { status: 500 }
    )
  }
}
