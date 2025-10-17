import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Lead from '@/models/Lead'

// GET - Fetch all leads with optional filters
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const interestLevel = searchParams.get('interestLevel')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }

    if (status && status !== 'all') {
      query.status = status
    }

    if (interestLevel && interestLevel !== 'all') {
      query.interestLevel = interestLevel
    }

    // Get total count
    const total = await Lead.countDocuments(query)

    // Get leads with pagination
    const leads = await Lead.find(query)
      .sort({ dateAdded: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    // Get stats
    const stats = await Lead.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          newLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'New Lead'] }, 1, 0] },
          },
          followUps: {
            $sum: { $cond: [{ $eq: ['$status', 'Follow-Up Needed'] }, 1, 0] },
          },
          converted: {
            $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] },
          },
          veryInterested: {
            $sum: { $cond: [{ $eq: ['$interestLevel', 'Very Interested'] }, 1, 0] },
          },
        },
      },
    ])

    return NextResponse.json({
      success: true,
      leads,
      stats: stats[0] || {
        total: 0,
        newLeads: 0,
        followUps: 0,
        converted: 0,
        veryInterested: 0,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

// POST - Create new lead
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { name, email, phone, googleMapsLink, interestLevel, status, notes, source } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if lead already exists
    const existingLead = await Lead.findOne({ email: email.toLowerCase() })
    if (existingLead) {
      return NextResponse.json(
        { success: false, message: 'A lead with this email already exists' },
        { status: 400 }
      )
    }

    // Create new lead
    const lead = await Lead.create({
      name,
      email: email.toLowerCase(),
      phone,
      googleMapsLink,
      interestLevel: interestLevel || 'Neutral',
      status: status || 'New Lead',
      notes,
      source: source || 'Manual',
      dateAdded: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: 'Lead created successfully',
      lead,
    })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
