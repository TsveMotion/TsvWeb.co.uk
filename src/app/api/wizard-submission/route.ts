import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

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
    const { db } = await connectToDatabase()
    
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
      // TODO: Send notification email to admin
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
    
    const { db } = await connectToDatabase()
    
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
