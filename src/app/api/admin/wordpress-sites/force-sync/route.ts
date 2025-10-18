import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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

    const { siteId, siteUrl } = await request.json();

    console.log('Force sync request for site:', siteUrl);

    // Note: The WordPress plugin syncs automatically every 30 seconds
    // This endpoint just confirms the request was received
    // The plugin will pick up the next sync cycle automatically

    return NextResponse.json({
      success: true,
      message: 'Sync request acknowledged. The site will sync within 30 seconds.',
    });

  } catch (error) {
    console.error('Error triggering sync:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
