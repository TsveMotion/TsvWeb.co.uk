import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

    // Connect to database using same client as /admin/users
    const client = await clientPromise;
    const db = client.db();

    // Fetch all users from the 'users' collection (same as /admin/users)
    const users = await db.collection('users')
      .find({}, { projection: { password: 0 } })
      .sort({ name: 1, username: 1 })
      .toArray();

    // Transform to match expected format
    const customers = users.map(user => ({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      name: user.name || user.username,
      phone: user.phone || '',
      role: user.role
    }));

    return NextResponse.json({
      success: true,
      customers: customers,
      count: customers.length,
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
