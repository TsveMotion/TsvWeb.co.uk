import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

interface Params {
  params: {
    id: string;
  }
}

// Get a single inquiry by ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const { id } = params
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid inquiry ID' },
        { status: 400 }
      )
    }
    
    // First try to find in regular inquiries
    let inquiry = await db.collection('inquiries').findOne({ _id: new ObjectId(id) })
    let inquiryType = 'inquiry'
    
    // If not found, try wizard submissions
    if (!inquiry) {
      inquiry = await db.collection('wizard_submissions').findOne({ _id: new ObjectId(id) })
      inquiryType = 'wizard'
    }
    
    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: 'Inquiry not found' },
        { status: 404 }
      )
    }
    
    // Transform wizard submission to match inquiry format
    if (inquiryType === 'wizard') {
      inquiry = {
        ...inquiry,
        type: 'wizard',
        message: inquiry.additionalInfo || 'No additional information provided.',
        subject: `${inquiry.projectType} Project - ${inquiry.budget}`
      }
    } else {
      inquiry = {
        ...inquiry,
        type: 'inquiry'
      }
    }
    
    // If inquiry has not been read yet, mark as read
    if (inquiry.status === 'new') {
      const updateData = {
        status: 'read',
        readAt: new Date()
      }
      
      if (inquiryType === 'wizard') {
        await db.collection('wizard_submissions').updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        )
      } else {
        await db.collection('inquiries').updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        )
      }
      
      inquiry.status = 'read'
      inquiry.readAt = new Date()
    }
    
    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    console.error(`Error fetching inquiry ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch inquiry' },
      { status: 500 }
    )
  }
}

// Update an inquiry by ID (e.g., to change status)
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const { id } = params
    const data = await request.json()
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid inquiry ID' },
        { status: 400 }
      )
    }
    
    // Validate the data
    const allowedUpdates = ['status', 'notes']
    const updates = Object.keys(data)
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    
    if (!isValidOperation) {
      return NextResponse.json(
        { success: false, message: 'Invalid updates' },
        { status: 400 }
      )
    }
    
    // First try to find in regular inquiries
    let inquiry = await db.collection('inquiries').findOne({ _id: new ObjectId(id) })
    let inquiryType = 'inquiry'
    
    // If not found, try wizard submissions
    if (!inquiry) {
      inquiry = await db.collection('wizard_submissions').findOne({ _id: new ObjectId(id) })
      inquiryType = 'wizard'
    }
    
    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: 'Inquiry not found' },
        { status: 404 }
      )
    }
    
    // Update the inquiry
    const updateData = {
      ...data,
      updatedAt: new Date()
    }
    
    let result
    if (inquiryType === 'wizard') {
      result = await db.collection('wizard_submissions').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      )
    } else {
      result = await db.collection('inquiries').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      )
    }
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Inquiry not found' },
        { status: 404 }
      )
    }
    
    // Fetch the updated inquiry
    const updatedInquiry = inquiryType === 'wizard' 
      ? await db.collection('wizard_submissions').findOne({ _id: new ObjectId(id) })
      : await db.collection('inquiries').findOne({ _id: new ObjectId(id) })
    
    return NextResponse.json({ success: true, inquiry: updatedInquiry })
  } catch (error) {
    console.error(`Error updating inquiry ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: 'Failed to update inquiry' },
      { status: 500 }
    )
  }
}

// Delete an inquiry by ID
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const { id } = params
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid inquiry ID' },
        { status: 400 }
      )
    }
    
    // First try to find in regular inquiries
    let inquiry = await db.collection('inquiries').findOne({ _id: new ObjectId(id) })
    let inquiryType = 'inquiry'
    
    // If not found, try wizard submissions
    if (!inquiry) {
      inquiry = await db.collection('wizard_submissions').findOne({ _id: new ObjectId(id) })
      inquiryType = 'wizard'
    }
    
    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: 'Inquiry not found' },
        { status: 404 }
      )
    }
    
    // Delete the inquiry
    let result
    if (inquiryType === 'wizard') {
      result = await db.collection('wizard_submissions').deleteOne({ _id: new ObjectId(id) })
    } else {
      result = await db.collection('inquiries').deleteOne({ _id: new ObjectId(id) })
    }
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to delete inquiry' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Inquiry deleted successfully' 
    })
  } catch (error) {
    console.error(`Error deleting inquiry ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete inquiry' },
      { status: 500 }
    )
  }
}
