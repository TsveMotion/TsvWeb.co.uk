import { NextRequest, NextResponse } from 'next/server';
import ChatHistory from '@/models/ChatHistory';
import { connectToDatabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { path, timeSpent } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    if (!path || typeof timeSpent !== 'number') {
      return NextResponse.json({ error: 'Path and timeSpent are required' }, { status: 400 });
    }

    // Find the most recent page visit for this path and update the time spent
    await ChatHistory.findOneAndUpdate(
      { 
        ipAddress: ip,
        'pagesVisited.path': path 
      },
      {
        $set: {
          'pagesVisited.$.timeSpent': timeSpent,
          lastVisit: new Date()
        }
      },
      { 
        sort: { 'pagesVisited.timestamp': -1 },
        new: true 
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking time spent:', error);
    return NextResponse.json(
      { error: 'Failed to track time spent' },
      { status: 500 }
    );
  }
}
