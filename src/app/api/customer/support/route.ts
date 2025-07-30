import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Inquiry } from '@/models/Inquiry';
import { verifyCustomerToken } from '@/lib/customer-auth';

export const dynamic = 'force-dynamic';

// POST - Create support ticket from authenticated customer
export async function POST(request: NextRequest) {
  try {
    // Verify customer authentication
    const user = await verifyCustomerToken(request);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized - Please log in' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { subject, message, priority = 'medium', category = 'contracts' } = body;

    // Validate required fields
    if (!subject || !message) {
      return NextResponse.json({ 
        success: false, 
        message: 'Subject and message are required' 
      }, { status: 400 });
    }

    await connectToDatabase();

    // Create new support ticket
    const supportTicket = new Inquiry({
      name: user.username || user.email,
      email: user.email,
      subject: `[SUPPORT] ${subject}`,
      message: `Customer Support Request\n\nCategory: ${category}\nPriority: ${priority}\n\nMessage:\n${message}`,
      phone: '', // Customers might not have phone in their profile
      status: 'new',
      type: 'support', // New type for support tickets
      
      // Additional fields for support tickets
      customerId: user.userId,
      customerUsername: user.username,
      priority,
      category,
      originalMessage: message,
      
      // Metadata
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await supportTicket.save();

    return NextResponse.json({
      success: true,
      message: 'Support ticket created successfully',
      ticketId: supportTicket._id,
      data: {
        id: supportTicket._id,
        subject: supportTicket.subject,
        status: supportTicket.status,
        createdAt: supportTicket.createdAt,
        category,
        priority
      }
    });

  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create support ticket' 
    }, { status: 500 });
  }
}

// GET - Get customer's support tickets
export async function GET(request: NextRequest) {
  try {
    // Verify customer authentication
    const user = await verifyCustomerToken(request);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized - Please log in' 
      }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');

    // Build query for this customer's support tickets only
    const query: any = { 
      customerId: user.userId,
      type: 'support'
    };
    if (status) query.status = status;

    const total = await Inquiry.countDocuments(query);
    const tickets = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v'); // Exclude version field

    return NextResponse.json({
      success: true,
      data: tickets,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + tickets.length < total
      }
    });

  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch support tickets' 
    }, { status: 500 });
  }
}
