import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Inquiry } from '@/models/Inquiry';

// Get all inquiries (with pagination and filters)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    // Build query based on filters
    const query: any = {};
    if (status) query.status = status;
    
    // Get total count for pagination
    const total = await Inquiry.countDocuments(query);
    
    // Get inquiries with pagination
    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    return NextResponse.json({ 
      success: true, 
      data: inquiries,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pageSize: limit,
        pageCount: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

// Create a new inquiry from contact form
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const data = await request.json();
    
    // Create new inquiry
    const newInquiry = new Inquiry(data);
    await newInquiry.save();
    
    return NextResponse.json({ 
      success: true, 
      data: newInquiry 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
}
