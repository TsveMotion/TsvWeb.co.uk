import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
    if (!ObjectId.isValid(id)) {
      console.error('❌ [Optimizer Control] Invalid site ID format:', id);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid site ID format' 
        },
        { status: 400 }
      );
    }

    // Step 4: Connect to MongoDB directly (bypass Mongoose)
    console.log('🗄️ [Optimizer Control] Connecting to MongoDB...');
    const client = await clientPromise;
    const db = client.db('tsvweb');

    console.log('📝 [Optimizer Control] Updating WordPress site directly in MongoDB (no Mongoose)...');
    
    // Update the site's optimizer status using direct MongoDB
    const result = await db.collection('wordpressstats').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          aiOptimizerEnabled: enabled,
          updatedAt: new Date()
        }
      },
      { 
        returnDocument: 'after' // Return the updated document
      }
    );

    console.log('📊 [Optimizer Control] Update result:', {
      found: !!result,
      siteId: result?._id,
      aiOptimizerEnabled: result?.aiOptimizerEnabled
    });

    // Check if site was found
    if (!result) {
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
