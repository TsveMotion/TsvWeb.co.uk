import { NextRequest, NextResponse } from 'next/server';
import ChatHistory from '@/models/ChatHistory';
import { connectToDatabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { path, title } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    // Record the page visit in the database
    await ChatHistory.findOneAndUpdate(
      { ipAddress: ip },
      {
        $setOnInsert: {
          ipAddress: ip,
          userAgent: userAgent,
          firstVisit: new Date(),
        },
        $set: {
          lastVisit: new Date(),
        },
        $push: {
          pagesVisited: {
            path,
            title: title || path,
            timeSpent: 0, // Will be updated when the user leaves the page
            timestamp: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    );
  }
}
