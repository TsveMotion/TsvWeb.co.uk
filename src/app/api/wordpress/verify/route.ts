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

// WordPress Stats Schema
const WordPressStatsSchema = new mongoose.Schema({
  siteUrl: { type: String, required: true, unique: true },
  siteName: { type: String, required: true },
  customerId: { type: String, default: null, index: true },
  customerEmail: { type: String, default: null },
  customerName: { type: String, default: null },
  plan: { type: String, default: 'Standard' },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

const WordPressStats = mongoose.models.WordPressStats || mongoose.model('WordPressStats', WordPressStatsSchema);

/**
 * Verify WordPress site is an official TsvWeb-managed client
 * POST /api/wordpress/verify
 */
export async function POST(request: NextRequest) {
  try {
    // Get API key from header
    const authHeader = request.headers.get('authorization');
    const apiKey = authHeader?.replace('Bearer ', '');

    if (!apiKey) {
      return NextResponse.json(
        { 
          verified: false, 
          message: 'No API key provided' 
        },
        { status: 401 }
      );
    }

    // Allow test key for development
    if (apiKey === 'test-key-12345') {
      return NextResponse.json({
        verified: true,
        message: 'Test client verified',
        client_name: 'Test Client',
        plan: 'Development',
      });
    }

    // Parse request body
    const body = await request.json();
    const { site_url, site_name } = body;

    if (!site_url) {
      return NextResponse.json(
        { 
          verified: false, 
          message: 'Site URL required' 
        },
        { status: 400 }
      );
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
      console.log('Invalid API key attempt for:', site_url);
      return NextResponse.json(
        { 
          verified: false, 
          message: 'Invalid API key' 
        },
        { status: 401 }
      );
    }

    // Verify the site URL matches
    const normalizedSiteUrl = site_url.replace(/\/$/, '').toLowerCase();
    const normalizedApiSiteUrl = apiKeyDoc.siteUrl.replace(/\/$/, '').toLowerCase();

    if (normalizedSiteUrl !== normalizedApiSiteUrl) {
      console.log('Site URL mismatch:', { provided: normalizedSiteUrl, expected: normalizedApiSiteUrl });
      return NextResponse.json(
        { 
          verified: false, 
          message: 'Site URL does not match API key' 
        },
        { status: 403 }
      );
    }

    // Update last used timestamp
    await ApiKey.findByIdAndUpdate(apiKeyDoc._id, {
      lastUsed: new Date(),
    });

    // Get WordPress site info
    const siteInfo = await WordPressStats.findOne({ siteUrl: site_url });

    // Determine plan and client info
    let plan = 'Standard';
    let clientName = '';

    if (siteInfo) {
      plan = siteInfo.plan || 'Standard';
      clientName = siteInfo.customerName || siteInfo.siteName || '';
    }

    console.log('Client verified:', {
      site_url,
      client_name: clientName,
      plan,
    });

    return NextResponse.json({
      verified: true,
      message: 'Client verified successfully',
      client_name: clientName,
      plan: plan,
    });

  } catch (error: any) {
    console.error('Error verifying client:', error);
    return NextResponse.json(
      { 
        verified: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
