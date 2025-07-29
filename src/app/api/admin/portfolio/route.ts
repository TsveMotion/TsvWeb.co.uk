import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Portfolio } from '@/models/Portfolio';

// Get all portfolio items (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    // Build query based on provided filters
    const query: any = {};
    if (featured) {
      query.featured = featured === 'true';
    }
    
    // Get total count for pagination
    const total = await Portfolio.countDocuments(query);
    
    // Get portfolio items with pagination
    const items = await Portfolio.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    return NextResponse.json({ 
      success: true, 
      data: items,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pageSize: limit,
        pageCount: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}

// Create a new portfolio item
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const data = await request.json();
    
    // Create new portfolio item
    const newItem = new Portfolio(data);
    await newItem.save();
    
    return NextResponse.json({ 
      success: true, 
      data: newItem 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create portfolio item' },
      { status: 500 }
    );
  }
}
