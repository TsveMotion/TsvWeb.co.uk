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

// WordPress Stats Schema with payment info
const WordPressStatsSchema = new mongoose.Schema({
  siteUrl: { type: String, required: true, unique: true },
  siteName: { type: String, required: true },
  customerId: { type: String, default: null, index: true },
  customerEmail: { type: String, default: null },
  customerName: { type: String, default: null },
  plan: { type: String, default: 'Standard' },
  // Payment tracking
  paymentStatus: { type: String, default: 'unknown' }, // paid, overdue, pending, unknown
  paymentAmount: { type: String, default: '' },
  nextPaymentDate: { type: String, default: '' },
  paymentMessage: { type: String, default: '' },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

const WordPressStats = mongoose.models.WordPressStats || mongoose.model('WordPressStats', WordPressStatsSchema);

/**
 * Get payment status for WordPress site
 * GET /api/wordpress/payment-status
 */
export async function GET(request: NextRequest) {
  try {
    // Get API key from header
    const authHeader = request.headers.get('authorization');
    const apiKey = authHeader?.replace('Bearer ', '');

    if (!apiKey) {
      return NextResponse.json(
        { 
          status: 'unknown',
          message: 'No API key provided' 
        },
        { status: 401 }
      );
    }

    // Allow test key for development
    if (apiKey === 'test-key-12345') {
      return NextResponse.json({
        status: 'paid',
        message: 'Paid for October 2025',
        next_payment: '28 Nov 2025',
        amount: '49.99',
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
      return NextResponse.json(
        { 
          status: 'unknown',
          message: 'Invalid API key' 
        },
        { status: 401 }
      );
    }

    // Get WordPress site info
    const siteInfo = await WordPressStats.findOne({ siteUrl: apiKeyDoc.siteUrl });

    if (!siteInfo) {
      return NextResponse.json({
        status: 'unknown',
        message: 'Site not found',
        next_payment: '',
        amount: '',
      });
    }

    // Calculate next payment date if not set
    let nextPayment = siteInfo.nextPaymentDate || '';
    if (!nextPayment) {
      // Default to 28th of next month
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 28);
      nextPayment = nextMonth.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    }

    // Determine payment status
    let status = siteInfo.paymentStatus || 'paid';
    let message = siteInfo.paymentMessage || '';
    
    if (!message) {
      if (status === 'paid') {
        const now = new Date();
        const monthName = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        message = `Paid for ${monthName}`;
      } else if (status === 'overdue') {
        message = 'Payment overdue - please contact TsvWeb';
      } else if (status === 'pending') {
        message = 'Payment pending';
      } else {
        message = 'Status unknown';
      }
    }

    // Get amount
    const amount = siteInfo.paymentAmount || '49.99';

    console.log('Payment status retrieved:', {
      site: apiKeyDoc.siteUrl,
      status,
      next_payment: nextPayment,
    });

    return NextResponse.json({
      status: status,
      message: message,
      next_payment: nextPayment,
      amount: amount,
    });

  } catch (error: any) {
    console.error('Error getting payment status:', error);
    return NextResponse.json(
      { 
        status: 'unknown',
        message: 'Internal server error',
        next_payment: '',
        amount: '',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Update payment status (admin only)
 * POST /api/wordpress/payment-status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteUrl, status, amount, nextPaymentDate, message, adminKey } = body;

    // Simple admin key check (you should use proper authentication)
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!siteUrl) {
      return NextResponse.json(
        { error: 'Site URL required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Update payment info
    const updated = await WordPressStats.findOneAndUpdate(
      { siteUrl: siteUrl },
      {
        paymentStatus: status || 'paid',
        paymentAmount: amount || '',
        nextPaymentDate: nextPaymentDate || '',
        paymentMessage: message || '',
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment status updated',
      site: updated,
    });

  } catch (error: any) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
