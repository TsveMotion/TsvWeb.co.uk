import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db';
import Newsletter from '@/models/Newsletter';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Verify authentication with NextAuth
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - Please login' }, { status: 401 });
    }

    const { subject, content, contentType = 'html', selectedSubscribers } = await request.json();

    if (!subject || !content) {
      return NextResponse.json({ 
        error: 'Subject and content are required' 
      }, { status: 400 });
    }

    await connectToDatabase();

    // Get subscribers based on selection
    let query: any = { isActive: true };
    if (selectedSubscribers && selectedSubscribers.length > 0) {
      query._id = { $in: selectedSubscribers };
    }

    const subscribers = await Newsletter.find(query).select('email');

    if (subscribers.length === 0) {
      return NextResponse.json({ 
        error: 'No active subscribers found',
        stats: { successful: 0, failed: 0 }
      }, { status: 400 });
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ 
        error: 'Resend API key not configured. Please add RESEND_API_KEY to .env.local',
        stats: { successful: 0, failed: 0 }
      }, { status: 500 });
    }

    // Send emails in batches
    const batchSize = 50;
    let successful = 0;
    let failed = 0;
    const emails = subscribers.map(s => s.email);

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'TsvWeb <noreply@tsvweb.com>',
          to: batch,
          subject: subject,
          html: contentType === 'html' ? content : `<pre>${content}</pre>`,
        });
        successful += batch.length;
      } catch (error) {
        console.error('Batch send error:', error);
        failed += batch.length;
      }
    }

    return NextResponse.json({
      message: `Newsletter sent successfully`,
      stats: { successful, failed }
    });

  } catch (error: any) {
    console.error('Newsletter send error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to send newsletter',
      stats: { successful: 0, failed: 0 }
    }, { status: 500 });
  }
}
