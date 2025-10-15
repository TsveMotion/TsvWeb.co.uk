import { NextRequest, NextResponse } from 'next/server';
import ChatHistory from '@/models/ChatHistory';
import { connectToDatabase } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userRole = (session.user as any).role;
    if (userRole !== 'admin' && userRole !== 'editor') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    await connectToDatabase();
    
    // Parse query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const search = url.searchParams.get('search') || '';
    
    // Build query
    const query: any = {};
    if (search) {
      query.$or = [
        { ipAddress: { $regex: search, $options: 'i' } },
        { 'messages.content': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get total count for pagination
    const total = await ChatHistory.countDocuments(query);
    
    // Get chat history with pagination
    const chatHistories = await ChatHistory.find(query)
      .sort({ lastVisit: -1 })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      data: chatHistories,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}

// Get details for a specific chat history
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userRole = (session.user as any).role;
    if (userRole !== 'admin' && userRole !== 'editor') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    await connectToDatabase();
    
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const chatHistory = await ChatHistory.findById(id);
    
    if (!chatHistory) {
      return NextResponse.json({ error: 'Chat history not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data: chatHistory });
  } catch (error) {
    console.error('Error fetching chat history details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history details' },
      { status: 500 }
    );
  }
}
