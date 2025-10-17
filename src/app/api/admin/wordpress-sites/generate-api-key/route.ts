import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import crypto from 'crypto';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// API Keys Schema
const ApiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  hashedKey: { type: String, required: true },
  siteUrl: { type: String, required: true },
  siteName: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  lastUsed: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const ApiKey = mongoose.models.ApiKey || mongoose.model('ApiKey', ApiKeySchema);

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userRole = (session.user as any).role;
    if (userRole !== 'admin' && userRole !== 'editor') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { siteUrl, siteName } = await request.json();

    if (!siteUrl) {
      return NextResponse.json(
        { error: 'Site URL is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Generate a secure random API key
    const apiKey = 'tsvweb_' + crypto.randomBytes(32).toString('hex');
    
    // Hash the API key for storage
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');

    // Check if site already has an API key
    const existingKey = await ApiKey.findOne({ siteUrl, isActive: true });
    
    if (existingKey) {
      return NextResponse.json({
        success: false,
        error: 'Site already has an active API key. Deactivate it first.',
      }, { status: 400 });
    }

    // Store the hashed key
    const newKey = await ApiKey.create({
      key: apiKey.substring(0, 20) + '...', // Store partial key for reference
      hashedKey: hashedKey,
      siteUrl: siteUrl,
      siteName: siteName || siteUrl,
      createdBy: (session.user as any).email || 'admin',
      isActive: true,
    });

    // Return the actual API key (only time it's shown in plain text)
    return NextResponse.json({
      success: true,
      apiKey: apiKey, // Full key - show this to user ONCE
      message: 'API key generated successfully. Save this key - it will not be shown again!',
      keyId: newKey._id,
    });

  } catch (error) {
    console.error('Error generating API key:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userRole = (session.user as any).role;
    if (userRole !== 'admin' && userRole !== 'editor') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Connect to database
    await connectToDatabase();

    // Get all API keys (without full keys)
    const keys = await ApiKey.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      keys: keys.map(k => ({
        id: k._id,
        keyPreview: k.key,
        siteUrl: k.siteUrl,
        siteName: k.siteName,
        createdBy: k.createdBy,
        createdAt: k.createdAt,
        lastUsed: k.lastUsed,
        isActive: k.isActive,
      })),
    });

  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
