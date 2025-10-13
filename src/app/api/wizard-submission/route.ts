import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { Resend } from 'resend'

interface WizardSubmission {
  name: string
  email: string
  phone: string
  company: string
  projectType: string
  budget: string
  timeline: string
  goals: string[]
  additionalInfo: string
  submittedAt: Date
  status: 'new' | 'contacted' | 'converted'
}

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Send notification email to admin
async function sendAdminNotification(submission: WizardSubmission) {
  try {
    const projectTypeLabels: Record<string, string> = {
      'new-website': 'New Website',
      'redesign': 'Website Redesign',
      'ecommerce': 'E-commerce Store',
      'seo': 'SEO Optimization',
      'marketing': 'Digital Marketing'
    }

    const budgetLabels: Record<string, string> = {
      '30-month': '£30/month',
      '50-month': '£50/month',
      '75-month': '£75/month',
      '100-month': '£100/month',
      'discuss': "Let's Discuss"
    }

    const timelineLabels: Record<string, string> = {
      'asap': 'ASAP',
      '1-month': '1 Month',
      '2-3-months': '2-3 Months',
      '3-plus-months': '3+ Months'
    }

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'hello@mail.tsvweb.com',
      to: 'Kristiyan@tsvweb.com',
      subject: `🚀 New Website Inquiry from ${submission.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #007BFF 0%, #0056D2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #007BFF; }
            .label { font-weight: bold; color: #007BFF; }
            .value { color: #333; margin-bottom: 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Website Inquiry!</h1>
              <p>You've got a new lead from your website</p>
            </div>
            <div class="content">
              <div class="info-box">
                <div class="value"><span class="label">Name:</span> ${submission.name}</div>
                <div class="value"><span class="label">Email:</span> ${submission.email}</div>
                <div class="value"><span class="label">Phone:</span> ${submission.phone || 'Not provided'}</div>
                <div class="value"><span class="label">Company:</span> ${submission.company || 'Not provided'}</div>
              </div>
              
              <div class="info-box">
                <h3 style="color: #007BFF; margin-top: 0;">Project Details</h3>
                <div class="value"><span class="label">Project Type:</span> ${projectTypeLabels[submission.projectType] || submission.projectType}</div>
                <div class="value"><span class="label">Budget:</span> ${budgetLabels[submission.budget] || submission.budget}</div>
                <div class="value"><span class="label">Timeline:</span> ${timelineLabels[submission.timeline] || submission.timeline}</div>
              </div>
              
              ${submission.additionalInfo ? `
              <div class="info-box">
                <h3 style="color: #007BFF; margin-top: 0;">Additional Information</h3>
                <p>${submission.additionalInfo}</p>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #007BFF; font-weight: bold;">⚡ Follow up within 24 hours for best conversion!</p>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from your TsvWeb website inquiry form</p>
            </div>
          </div>
        </body>
        </html>
      `
    })
    
    console.log('✅ Admin notification sent to Kristiyan@tsvweb.com')
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error)
  }
}

// Send confirmation email to customer
async function sendCustomerConfirmation(submission: WizardSubmission) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'hello@mail.tsvweb.com',
      to: submission.email,
      subject: '🎉 Thank You for Your Inquiry - TsvWeb',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #007BFF 0%, #0056D2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .logo { width: 80px; height: 80px; background: white; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; color: #007BFF; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .step-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; display: flex; align-items: start; }
            .step-number { background: #007BFF; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #007BFF 0%, #0056D2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">TSV</div>
              <h1>Thank You, ${submission.name}! 🎉</h1>
              <p>We've received your inquiry and we're excited to work with you!</p>
            </div>
            <div class="content">
              <h2 style="color: #007BFF; text-align: center;">What Happens Next?</h2>
              
              <div class="step-box">
                <div class="step-number">1</div>
                <div>
                  <h3 style="margin: 0 0 10px 0; color: #333;">We'll call you within 24 hours</h3>
                  <p style="margin: 0; color: #666;">Our team will reach out to discuss your project in detail</p>
                </div>
              </div>
              
              <div class="step-box">
                <div class="step-number">2</div>
                <div>
                  <h3 style="margin: 0 0 10px 0; color: #333;">Get your custom quote</h3>
                  <p style="margin: 0; color: #666;">Transparent pricing tailored to your needs</p>
                </div>
              </div>
              
              <div class="step-box">
                <div class="step-number">3</div>
                <div>
                  <h3 style="margin: 0 0 10px 0; color: #333;">Your website goes live in 3-5 days</h3>
                  <p style="margin: 0; color: #666;">Fast turnaround, professional results</p>
                </div>
              </div>
              
              <div style="background: #FFF3CD; border-left: 4px solid #FFA500; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="margin: 0; color: #856404;">⚡ <strong>Limited slots available!</strong> We only take on 10 new projects per month to ensure quality.</p>
              </div>
              
              <div style="text-align: center;">
                <a href="https://tsvweb.com/portfolio" class="cta-button">View Our Portfolio</a>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #ddd;">
                <p style="color: #666;">Have questions? Call us now:</p>
                <p style="font-size: 24px; font-weight: bold; color: #007BFF; margin: 10px 0;">07444 358808</p>
              </div>
            </div>
            <div class="footer">
              <p>TsvWeb - Professional Web Design & Digital Services</p>
              <p>Birmingham, UK | www.tsvweb.com</p>
            </div>
          </div>
        </body>
        </html>
      `
    })
    
    console.log(`✅ Confirmation email sent to ${submission.email}`)
  } catch (error) {
    console.error('❌ Failed to send customer confirmation:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.projectType || !body.budget || !body.timeline) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Connect to database
    const client = await clientPromise
    const db = client.db()
    
    // Create submission object
    const submission: WizardSubmission = {
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      company: body.company || '',
      projectType: body.projectType,
      budget: body.budget,
      timeline: body.timeline,
      goals: body.goals || [],
      additionalInfo: body.additionalInfo || '',
      submittedAt: new Date(),
      status: 'new'
    }

    // Save to database
    const result = await db.collection('wizard_submissions').insertOne(submission)
    
    if (result.insertedId) {
      // Send emails (don't wait for them to complete)
      sendAdminNotification(submission).catch(err => 
        console.error('Email notification failed:', err)
      )
      sendCustomerConfirmation(submission).catch(err => 
        console.error('Customer confirmation failed:', err)
      )
      
      return NextResponse.json({
        success: true,
        message: 'Submission received successfully',
        submissionId: result.insertedId
      })
    } else {
      throw new Error('Failed to save submission')
    }
    
  } catch (error) {
    console.error('Error processing wizard submission:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint could be used by admin to view submissions
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    
    const client = await clientPromise
    const db = client.db()
    
    // Build query
    const query: any = {}
    if (status && status !== 'all') {
      query.status = status
    }
    
    // Get submissions with pagination
    const submissions = await db.collection('wizard_submissions')
      .find(query)
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()
    
    // Get total count
    const total = await db.collection('wizard_submissions').countDocuments(query)
    
    return NextResponse.json({
      success: true,
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching wizard submissions:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
