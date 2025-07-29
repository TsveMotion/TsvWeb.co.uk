import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Inquiry } from '@/models/Inquiry';
import { sendInquiryConfirmation } from '@/lib/email';

// Submit a new contact inquiry
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body
    const data = await request.json();
    const { name, email, subject, message, phone } = data;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Create a new inquiry
    const newInquiry = new Inquiry({
      name,
      email,
      subject,
      message,
      phone,
      status: 'new'
    });

    await newInquiry.save();

    // Send confirmation email
    try {
      await sendInquiryConfirmation(email, name, subject);
      // We don't return an error if email sending fails, just log it
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Continue with the response even if email fails
    }

    return NextResponse.json(
      { success: true, message: 'Inquiry submitted successfully', data: newInquiry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error submitting inquiry:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
