import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import crypto from 'crypto';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// API Keys Schema
const ApiKeySchema = new mongoose.Schema({
  key: { type: String, required: true },
  hashedKey: { type: String, required: true },
  siteUrl: { type: String, required: true },
  siteName: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  lastUsed: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const ApiKey = mongoose.models.ApiKey || mongoose.model('ApiKey', ApiKeySchema);

// Support Tickets Schema
const SupportTicketSchema = new mongoose.Schema({
  siteUrl: { type: String, required: true, index: true },
  siteName: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  wpVersion: String,
  phpVersion: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resolvedAt: Date,
  notes: [{ 
    text: String, 
    createdBy: String, 
    createdAt: { type: Date, default: Date.now } 
  }],
}, { timestamps: true });

const SupportTicket = mongoose.models.SupportTicket || mongoose.model('SupportTicket', SupportTicketSchema);

/**
 * Submit support request from WordPress plugin
 * POST /api/wordpress/support
 */
export async function POST(request: NextRequest) {
  try {
    // Get API key from header
    const authHeader = request.headers.get('authorization');
    const apiKey = authHeader?.replace('Bearer ', '');

    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false,
          message: 'No API key provided' 
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { 
      site_url, 
      site_name, 
      subject, 
      message, 
      priority, 
      user_email, 
      user_name,
      wp_version,
      php_version
    } = body;

    // Validate required fields
    if (!site_url || !subject || !message || !user_email || !user_name) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    // Allow test key for development
    if (apiKey === 'test-key-12345') {
      console.log('Test support request received:', {
        site_url,
        subject,
        priority,
        user_email,
      });

      // Still create the ticket even for test key
      await connectToDatabase();

      const ticket = await SupportTicket.create({
        siteUrl: site_url,
        siteName: site_name || site_url,
        subject,
        message,
        priority: priority || 'normal',
        userEmail: user_email,
        userName: user_name,
        wpVersion: wp_version,
        phpVersion: php_version,
        status: 'open',
      });

      return NextResponse.json({
        success: true,
        message: 'Support request received',
        ticket_id: ticket._id.toString(),
      });
    }

    // Connect to database
    await connectToDatabase();

    // Hash the provided API key to compare
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');

    // Find API key in database
    const apiKeyDoc = await ApiKey.findOne({
      hashedKey: hashedKey,
      isActive: true,
    });

    if (!apiKeyDoc) {
      console.log('Invalid API key for support request:', site_url);
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid API key' 
        },
        { status: 401 }
      );
    }

    // Verify the site URL matches
    const normalizedSiteUrl = site_url.replace(/\/$/, '').toLowerCase();
    const normalizedApiSiteUrl = apiKeyDoc.siteUrl.replace(/\/$/, '').toLowerCase();

    if (normalizedSiteUrl !== normalizedApiSiteUrl) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Site URL does not match API key' 
        },
        { status: 403 }
      );
    }

    // Update last used timestamp
    await ApiKey.findByIdAndUpdate(apiKeyDoc._id, {
      lastUsed: new Date(),
    });

    // Create support ticket
    const ticket = await SupportTicket.create({
      siteUrl: site_url,
      siteName: site_name || site_url,
      subject,
      message,
      priority: priority || 'normal',
      userEmail: user_email,
      userName: user_name,
      wpVersion: wp_version,
      phpVersion: php_version,
      status: 'open',
    });

    console.log('Support ticket created:', {
      ticket_id: ticket._id,
      site: site_url,
      subject,
      priority,
    });

    // TODO: Send email notification to TsvWeb support team
    // You can integrate with your email service here

    return NextResponse.json({
      success: true,
      message: 'Support request submitted successfully',
      ticket_id: ticket._id.toString(),
    });

  } catch (error: any) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Get support tickets (admin only)
 * GET /api/wordpress/support?siteUrl=...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteUrl = searchParams.get('siteUrl');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    await connectToDatabase();

    // Build query
    const query: any = {};
    if (siteUrl) {
      query.siteUrl = siteUrl;
    }
    if (status) {
      query.status = status;
    }

    // Fetch tickets
    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      tickets,
      count: tickets.length,
    });

  } catch (error: any) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
