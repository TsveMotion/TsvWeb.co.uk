import { NextRequest, NextResponse } from 'next/server';
import ChatHistory from '@/models/ChatHistory';
import { connectToDatabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body with error handling
    let body;
    try {
      const text = await req.text();
      body = text ? JSON.parse(text) : {};
    } catch (parseErr) {
      console.error('[track-visit] JSON parse error:', parseErr);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { path, title } = body;
    
    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    try {
      await connectToDatabase();
    } catch (dbErr) {
      console.warn('[track-visit] Database unavailable, skipping persistence.');
      // Return success without persisting to avoid breaking UX when DB is down
      return NextResponse.json({ success: true, persisted: false });
    }
    
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

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

    return NextResponse.json({ success: true, persisted: true });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    );
  }
}

