import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { enabled } = await request.json();
    const { id } = params;

    const client = await clientPromise;
    const db = client.db('tsvweb');

    // Update the site's optimizer status
    const result = await db.collection('wordpress_sites').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          aiOptimizerEnabled: enabled,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Optimizer ${enabled ? 'enabled' : 'disabled'} successfully`
    });

  } catch (error) {
    console.error('Error toggling optimizer:', error);
    return NextResponse.json(
      { error: 'Failed to toggle optimizer' },
      { status: 500 }
    );
  }
}
