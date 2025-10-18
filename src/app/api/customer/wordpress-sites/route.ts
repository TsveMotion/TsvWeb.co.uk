import { NextRequest, NextResponse } from 'next/server';
import { verifyCustomerToken } from '@/lib/customer-auth';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// WordPress Stats Schema
const WordPressStatsSchema = new mongoose.Schema({
  siteUrl: { type: String, required: true, unique: true },
  siteName: { type: String, required: true },
  wordpressVersion: String,
  phpVersion: String,
  mysqlVersion: String,
  totalPosts: Number,
  totalPages: Number,
  totalUsers: Number,
  activePlugins: Number,
  activeTheme: String,
  themeVersion: String,
  siteHealth: String,
  memoryLimit: String,
  maxUploadSize: String,
  customerId: { type: String, default: null, index: true },
  customerEmail: { type: String, default: null },
  customerName: { type: String, default: null },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const WordPressStats = mongoose.models.WordPressStats || mongoose.model('WordPressStats', WordPressStatsSchema);

export async function GET(request: NextRequest) {
  try {
    // Verify customer authentication using same method as /customer/auth/me
    const user = await verifyCustomerToken(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    // Fetch WordPress sites for this customer using their userId
    const sites = await WordPressStats.find({
      customerId: user.userId
    }).sort({ lastUpdated: -1 });

    return NextResponse.json({
      success: true,
      sites: sites,
      count: sites.length,
    });

  } catch (error) {
    console.error('Error fetching customer WordPress sites:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
