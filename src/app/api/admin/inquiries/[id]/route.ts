import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Inquiry } from '@/models/Inquiry';

interface Params {
  params: {
    id: string;
  }
}

// Get a single inquiry by ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const inquiry = await Inquiry.findById(id);
    
    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: 'Inquiry not found' },
        { status: 404 }
      );
    }
    
    // If inquiry has not been read yet, mark as read
    if (inquiry.status === 'new') {
      inquiry.status = 'read';
      inquiry.readAt = new Date();
      await inquiry.save();
    }
    
    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    console.error(`Error fetching inquiry ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch inquiry' },
      { status: 500 }
    );
  }
}

// Update an inquiry by ID (e.g., to change status)
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const data = await request.json();
    
    // Check if inquiry exists
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: 'Inquiry not found' },
        { status: 404 }
      );
    }
    
    // If marking as replied and it wasn't replied before, set repliedAt date
    if (data.status === 'replied' && inquiry.status !== 'replied') {
      data.repliedAt = new Date();
    }
    
    // Update inquiry
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, data: updatedInquiry });
  } catch (error) {
    console.error(`Error updating inquiry ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}

// Delete an inquiry by ID
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    // Check if inquiry exists
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: 'Inquiry not found' },
        { status: 404 }
      );
    }
    
    // Delete inquiry
    await Inquiry.findByIdAndDelete(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Inquiry deleted successfully' 
    });
  } catch (error) {
    console.error(`Error deleting inquiry ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}
