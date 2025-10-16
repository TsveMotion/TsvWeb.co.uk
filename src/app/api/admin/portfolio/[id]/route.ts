import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Portfolio } from '@/models/Portfolio';

interface Params {
  params: {
    id: string;
  }
}

// Get a single portfolio item by ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    // Skip if id is "new" (create page route)
    if (id === 'new') {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    const item = await Portfolio.findById(id);
    
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Portfolio item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error(`Error fetching portfolio item ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch portfolio item' },
      { status: 500 }
    );
  }
}

// Partially update a portfolio item by ID (e.g., toggle featured status)
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const data = await request.json();
    
    // Check if item exists
    const item = await Portfolio.findById(id);
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Portfolio item not found' },
        { status: 404 }
      );
    }
    
    // Update only the provided fields
    const updatedItem = await Portfolio.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error(`Error partially updating portfolio item ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update portfolio item' },
      { status: 500 }
    );
  }
}

// Update a portfolio item by ID (full update)
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const data = await request.json();
    
    // Check if item exists
    const item = await Portfolio.findById(id);
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Portfolio item not found' },
        { status: 404 }
      );
    }
    
    // Update item
    const updatedItem = await Portfolio.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error(`Error updating portfolio item ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update portfolio item' },
      { status: 500 }
    );
  }
}

// Delete a portfolio item by ID
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    // Check if item exists
    const item = await Portfolio.findById(id);
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Portfolio item not found' },
        { status: 404 }
      );
    }
    
    // Delete item
    await Portfolio.findByIdAndDelete(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Portfolio item deleted successfully' 
    });
  } catch (error) {
    console.error(`Error deleting portfolio item ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete portfolio item' },
      { status: 500 }
    );
  }
}
