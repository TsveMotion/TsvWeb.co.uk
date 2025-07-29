import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Portfolio } from '@/models/Portfolio';

interface Params {
  params: {
    slug: string;
  }
}

// Get a single portfolio item by slug
export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    
    const { slug } = params;
    const item = await Portfolio.findOne({ slug });
    
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Portfolio item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error(`Error fetching portfolio item with slug ${params.slug}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch portfolio item' },
      { status: 500 }
    );
  }
}
