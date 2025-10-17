import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Lead from '@/models/Lead'

// GET - Fetch single lead
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const lead = await Lead.findById(params.id)

    if (!lead) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      lead,
    })
  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch lead' },
      { status: 500 }
    )
  }
}

// PUT - Update lead
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { name, email, phone, googleMapsLink, interestLevel, status, notes, lastContacted } = body

    const lead = await Lead.findByIdAndUpdate(
      params.id,
      {
        name,
        email: email?.toLowerCase(),
        phone,
        googleMapsLink,
        interestLevel,
        status,
        notes,
        lastContacted: lastContacted || (status === 'Contacted' ? new Date() : undefined),
      },
      { new: true, runValidators: true }
    )

    if (!lead) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully',
      lead,
    })
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update lead' },
      { status: 500 }
    )
  }
}

// DELETE - Delete lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const lead = await Lead.findByIdAndDelete(params.id)

    if (!lead) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}
