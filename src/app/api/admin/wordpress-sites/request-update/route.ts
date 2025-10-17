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

    const { siteId, siteUrl, request: updateRequest } = await request.json();

    // Here you would send the update request to the WordPress site
    // For now, we'll just log it and send a success response
    console.log('Update request for site:', siteUrl);
    console.log('Request:', updateRequest);

    // TODO: Implement actual communication with WordPress plugin
    // This could be done via:
    // 1. REST API endpoint on WordPress
    // 2. Email notification to site admin
    // 3. Database flag that plugin checks

    return NextResponse.json({
      success: true,
      message: 'Update request sent successfully',
    });

  } catch (error) {
    console.error('Error sending update request:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
