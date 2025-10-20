import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// WordPress Stats Schema - must match the schema used in other routes
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
  // Customer binding
  customerId: { type: String, default: null, index: true },
  customerEmail: { type: String, default: null },
  customerName: { type: String, default: null },
  // AI Optimizer control
  aiOptimizerEnabled: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Use existing model or create new one
const WordPressStats = mongoose.models.WordPressStats || mongoose.model('WordPressStats', WordPressStatsSchema);

/**
 * POST /api/admin/wordpress-sites/[id]/optimizer-control
 * 
 * Toggles the AI optimizer for a WordPress site.
 * 
 * Authentication: Requires authenticated admin user
 * 
 * Request body:
 * - enabled: boolean - Whether to enable or disable the optimizer
 * 
 * Responses:
 * - 200: Optimizer toggled successfully
 * - 401: Unauthorized (not logged in or not admin)
 * - 404: Site not found
 * - 500: Server error
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🔧 [Optimizer Control] POST request received for site ID:', params.id);
  
  try {
    // Step 1: Authenticate the user with NextAuth
    console.log('🔐 [Optimizer Control] Checking authentication...');
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      console.warn('⚠️ [Optimizer Control] No session found - unauthorized');
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized - Please log in' 
        },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const userRole = (session.user as any).role;
    console.log('👤 [Optimizer Control] User role:', userRole);
    
    if (userRole !== 'admin') {
      console.warn('⚠️ [Optimizer Control] User is not admin - forbidden');
      return NextResponse.json(
        { 
          success: false,
          error: 'Forbidden - Admin access required' 
        },
        { status: 403 }
      );
    }

    // Step 2: Parse request body
    console.log('📦 [Optimizer Control] Parsing request body...');
    const body = await request.json();
    const { enabled } = body;
    
    if (typeof enabled !== 'boolean') {
      console.error('❌ [Optimizer Control] Invalid request - enabled must be boolean');
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid request - enabled must be a boolean' 
        },
        { status: 400 }
      );
    }

    console.log('🎯 [Optimizer Control] Setting optimizer to:', enabled);

    // Step 3: Validate site ID format
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('❌ [Optimizer Control] Invalid site ID format:', id);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid site ID format' 
        },
        { status: 400 }
      );
    }

    // Step 4: Connect to MongoDB using Mongoose
    console.log('🗄️ [Optimizer Control] Connecting to MongoDB...');
    await connectToDatabase();

    console.log('📝 [Optimizer Control] Updating WordPress site with Mongoose...');
    
    // Update the site's optimizer status using Mongoose
    const updatedSite = await WordPressStats.findByIdAndUpdate(
      id,
      {
        aiOptimizerEnabled: enabled,
        updatedAt: new Date()
      },
      { new: true } // Return the updated document
    );

    console.log('📊 [Optimizer Control] Update result:', {
      found: !!updatedSite,
      siteId: updatedSite?._id,
      aiOptimizerEnabled: updatedSite?.aiOptimizerEnabled
    });

    // Check if site was found
    if (!updatedSite) {
      console.warn('⚠️ [Optimizer Control] Site not found with ID:', id);
      return NextResponse.json(
        { 
          success: false,
          error: 'Site not found' 
        },
        { status: 404 }
      );
    }

    // Success response
    const message = `AI Optimizer ${enabled ? 'enabled' : 'disabled'} successfully`;
    console.log('✅ [Optimizer Control] Success:', message);
    
    return NextResponse.json({
      success: true,
      message,
      data: {
        siteId: id,
        aiOptimizerEnabled: enabled,
        updatedAt: new Date().toISOString()
      }
    }, { status: 200 });

  } catch (error) {
    // Handle any unexpected errors
    console.error('💥 [Optimizer Control] Unexpected error:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to toggle optimizer',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
