import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Inquiry } from '@/models/Inquiry';
import { sendInquiryReply } from '@/lib/email';

// Send a reply to an inquiry and update its status
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await connectToDatabase();

    // Find the inquiry
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: 'Inquiry not found' },
        { status: 404 }
      );
    }

    // Get reply data
    const data = await request.json();
    const { subject, message } = data;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, message: 'Reply message is required' },
        { status: 400 }
      );
    }

    // Send the email reply using our email utility
    const emailResult = await sendInquiryReply(
      inquiry.email,
      inquiry.name,
      subject || `Re: ${inquiry.subject || 'Your Inquiry'}`,
      message
    );

    if (!emailResult.success) {
      console.error('Error sending email:', emailResult.error);
      // We'll still update the status but inform the admin that email sending failed
      // This allows the workflow to continue even if email is not configured yet
    }

    // Update inquiry status to replied
    inquiry.status = 'replied';
    inquiry.repliedAt = new Date();
    await inquiry.save();

    return NextResponse.json({
      success: true,
      message: emailResult.success 
        ? 'Reply sent successfully' 
        : 'Reply marked as sent, but email delivery failed. Check email configuration.',
      emailSent: emailResult.success,
      data: inquiry
    });
  } catch (error: any) {
    console.error('Error sending reply:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to send reply' },
      { status: 500 }
    );
  }
}
