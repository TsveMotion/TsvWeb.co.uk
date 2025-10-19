import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// List backups endpoint
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Backups are downloaded directly - no list needed
    const backups: any[] = [];

    return NextResponse.json({
      success: true,
      backups
    });

  } catch (error) {
    console.error('Fetch backups error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch backups' },
      { status: 500 }
    );
  }
}

