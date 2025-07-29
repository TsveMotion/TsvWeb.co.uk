import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

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

// Email notification function
async function sendNotificationEmail(submission: WizardSubmission) {
  try {
    // You can integrate with services like:
    // - Nodemailer with SMTP
    // - SendGrid
    // - Resend
    // - AWS SES
    
    // For now, we'll log the email details
    console.log('📧 New Setup Wizard Submission:')
    console.log('Name:', submission.name)
    console.log('Email:', submission.email)
    console.log('Company:', submission.company)
    console.log('Project Type:', submission.projectType)
    console.log('Budget:', submission.budget)
    console.log('Timeline:', submission.timeline)
    console.log('Goals:', submission.goals.join(', '))
    console.log('Additional Info:', submission.additionalInfo)
    
    // TODO: Replace with actual email service
    // Example with Nodemailer:
    /*
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'your-email@example.com',
      subject: `New Setup Wizard Submission from ${submission.name}`,
      html: `
        <h2>New Project Inquiry</h2>
        <p><strong>Name:</strong> ${submission.name}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        <p><strong>Company:</strong> ${submission.company}</p>
        <p><strong>Project Type:</strong> ${submission.projectType}</p>
        <p><strong>Budget:</strong> ${submission.budget}</p>
        <p><strong>Timeline:</strong> ${submission.timeline}</p>
        <p><strong>Goals:</strong> ${submission.goals.join(', ')}</p>
        <p><strong>Additional Info:</strong> ${submission.additionalInfo}</p>
      `
    })
    */
    
  } catch (error) {
    console.error('Failed to send notification email:', error)
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
      // Send notification email to admin
      await sendNotificationEmail(submission)
      
      // TODO: Send confirmation email to user
      // TODO: Integrate with CRM or project management system
      
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
