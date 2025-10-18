import { NextRequest, NextResponse } from 'next/server';
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
  users: [{
    id: Number,
    email: String,
    username: String,
    display_name: String,
    registered: String,
    role: String
  }],
  // Customer binding
  customerId: { type: String, default: null, index: true },
  customerEmail: { type: String, default: null },
  customerName: { type: String, default: null },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Create or get model
const WordPressStats = mongoose.models.WordPressStats || mongoose.model('WordPressStats', WordPressStatsSchema);

// API Keys Schema
const ApiKeySchema = new mongoose.Schema({
  key: String,
  hashedKey: { type: String, required: true },
  siteUrl: String,
  siteName: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  lastUsed: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const ApiKey = mongoose.models.ApiKey || mongoose.model('ApiKey', ApiKeySchema);

export async function POST(request: NextRequest) {
  try {
    // Get API key from header
    const authHeader = request.headers.get('authorization');
    const apiKey = authHeader?.replace('Bearer ', '');
    
    // Validate API key
    if (!apiKey || apiKey.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Connect to database first
    await connectToDatabase();

    // Allow test key for development
    if (apiKey !== 'test-key-12345') {
      // Hash the provided API key
      const crypto = require('crypto');
      const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');

      // Check if the hashed key exists and is active
      const validKey = await ApiKey.findOne({ hashedKey, isActive: true });
      
      if (!validKey) {
        return NextResponse.json(
          { success: false, error: 'Invalid or inactive API key' },
          { status: 401 }
        );
      }

      // Update last used timestamp
      await ApiKey.updateOne(
        { _id: validKey._id },
        { lastUsed: new Date() }
      );
    }
    
    // Parse request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.site_url || !data.site_name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Prepare stats data
    const statsData = {
      siteUrl: data.site_url,
      siteName: data.site_name,
      wordpressVersion: data.wordpress_version,
      phpVersion: data.php_version,
      mysqlVersion: data.mysql_version,
      totalPosts: data.total_posts,
      totalPages: data.total_pages,
      totalUsers: data.total_users,
      activePlugins: data.active_plugins,
      activeTheme: data.active_theme,
      themeVersion: data.theme_version,
      siteHealth: data.site_health,
      memoryLimit: data.memory_limit,
      maxUploadSize: data.max_upload_size,
      users: data.users || [],
      lastUpdated: new Date(),
    };
    
    // Update or create stats
    const result = await WordPressStats.findOneAndUpdate(
      { siteUrl: data.site_url },
      statsData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    console.log('WordPress stats received from:', data.site_url);
    
    return NextResponse.json({
      success: true,
      message: 'Stats received successfully',
      data: {
        site: data.site_url,
        lastUpdated: result.lastUpdated,
      }
    });
    
  } catch (error) {
    console.error('Error processing WordPress stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint could be used to retrieve stats
    // For now, return a simple message
    return NextResponse.json({
      success: true,
      message: 'WordPress Stats API',
      version: '1.0.0',
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
