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
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { siteId, siteUrl, newPassword } = await request.json();

    // Validate password
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Here you would send the password change request to the WordPress site
    console.log('Password change request for site:', siteUrl);

    // TODO: Implement actual communication with WordPress plugin
    // This should be done securely via:
    // 1. Encrypted REST API endpoint on WordPress
    // 2. Secure token-based authentication
    // 3. HTTPS only

    return NextResponse.json({
      success: true,
      message: 'Password change request sent successfully',
    });

  } catch (error) {
    console.error('Error sending password change request:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
