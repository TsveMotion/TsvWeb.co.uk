import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const WordPressStats = mongoose.models.WordPressStats || mongoose.model('WordPressStats', WordPressStatsSchema);

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Connect to database
    await connectToDatabase();

    // Delete the site
    await WordPressStats.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Site removed successfully',
    });

  } catch (error) {
    console.error('Error deleting WordPress site:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
