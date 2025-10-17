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

    const body = await request.json();
    const { siteId, siteUrl, email, username, password } = body;

    console.log('Received create-admin request:', { siteId, siteUrl, email, username, hasPassword: !!password });

    // Validate inputs
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, and password are required', received: { email: !!email, username: !!username, password: !!password } },
        { status: 400 }
      );
    }
    
    if (!siteUrl) {
      return NextResponse.json(
        { error: 'Site URL is required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log('Create admin request for site:', siteUrl);
    console.log('Email:', email, 'Username:', username);

    // TODO: Implement actual communication with WordPress plugin
    // This should send a secure request to create an administrator user
    // The WordPress plugin should have a REST API endpoint to handle this

    return NextResponse.json({
      success: true,
      message: 'Administrator creation request sent successfully',
      data: {
        email,
        username,
        site: siteUrl
      }
    });

  } catch (error) {
    console.error('Error creating administrator:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
