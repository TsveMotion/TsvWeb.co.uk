import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Newsletter from '@/models/Newsletter';
import { verifySession } from '@/lib/auth';
import { sendNewsletterBatch } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authData = await verifySession(request);
    if (!authData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, content, contentType = 'html' } = await request.json();

    if (!subject || !content) {
      return NextResponse.json({ 
        error: 'Subject and content are required' 
      }, { status: 400 });
    }

    await connectToDatabase();

    // Get all active subscribers
    const subscribers = await Newsletter.find({ isActive: true }).select('email unsubscribeToken');

    if (subscribers.length === 0) {
      return NextResponse.json({ 
        message: 'No active subscribers found' 
      }, { status: 200 });
    }

    // Send newsletter using email utility
    const result = await sendNewsletterBatch({
      subscribers: subscribers.map(s => ({
        email: s.email,
        unsubscribeToken: s.unsubscribeToken
      })),
      subject,
      content,
      contentType
    });

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Failed to send newsletter' 
      }, { status: 500 });
    }

    return NextResponse.json({
      message: `Newsletter sent successfully`,
      stats: result.stats
    });

  } catch (error) {
    console.error('Newsletter send error:', error);
    return NextResponse.json({ 
      error: 'Failed to send newsletter' 
    }, { status: 500 });
  }
}
