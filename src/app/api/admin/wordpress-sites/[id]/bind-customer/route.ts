import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

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

// POST - Bind WordPress site to customer
export async function POST(
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
    if (userRole !== 'admin' && userRole !== 'editor') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    await connectToDatabase();

    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
    }

    // Get user details from users collection (same as /admin/users)
    const mongoClient = await clientPromise;
    const db = mongoClient.db();
    
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(customerId) 
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update WordPress site with customer binding
    const site = await WordPressStats.findByIdAndUpdate(
      params.id,
      {
        customerId: user._id.toString(),
        customerEmail: user.email,
        customerName: user.name || user.username
      },
      { new: true }
    );

    if (!site) {
      return NextResponse.json({ error: 'WordPress site not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Site bound to customer successfully',
      site
    });

  } catch (error) {
    console.error('Error binding site to customer:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Unbind WordPress site from customer
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
    if (userRole !== 'admin' && userRole !== 'editor') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    await connectToDatabase();

    // Remove customer binding
    const site = await WordPressStats.findByIdAndUpdate(
      params.id,
      {
        customerId: null,
        customerEmail: null,
        customerName: null
      },
      { new: true }
    );

    if (!site) {
      return NextResponse.json({ error: 'WordPress site not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Site unbound from customer successfully',
      site
    });

  } catch (error) {
    console.error('Error unbinding site from customer:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
