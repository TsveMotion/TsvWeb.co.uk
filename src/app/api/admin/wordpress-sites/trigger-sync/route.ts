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

    // TODO: Implement actual sync trigger
    // This could send a request to the WordPress plugin to sync immediately

    return NextResponse.json({
      success: true,
      message: 'Sync triggered successfully',
    });

  } catch (error) {
    console.error('Error triggering sync:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
