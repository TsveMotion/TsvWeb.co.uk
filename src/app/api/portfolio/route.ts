import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Portfolio } from '@/models/Portfolio';

export const dynamic = 'force-dynamic';

// Get all portfolio items (with optional filtering) for public consumption
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const projectType = searchParams.get('projectType');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Build query based on provided filters
    const query: any = {};
    if (featured) {
      query.featured = featured === 'true';
    }
    if (projectType && projectType !== 'all') {
      query.projectType = projectType;
    }
    
    // Get portfolio items
    const items = await Portfolio.find(query)
      .sort({ completionDate: -1, createdAt: -1 })
      .limit(limit);
      
    return NextResponse.json({ 
      success: true, 
      data: items
    });
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}
