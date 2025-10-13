import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Agreement from '@/models/Agreement';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await verifySession(request as any);
    if (!session?.authenticated || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    await connectToDatabase();
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const ag = await Agreement.findById(params.id);
    if (!ag) return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });

    ag.userId = userId;
    ag.clientName = (user as any).name || ag.clientName;
    ag.clientEmail = (user as any).email || ag.clientEmail;
    ag.updatedBy = session.email || 'admin';
    await ag.save();

    return NextResponse.json({ success: true, agreement: ag });
  } catch (error) {
    console.error('Agreement bind error:', error);
    return NextResponse.json({ error: 'Failed to bind agreement' }, { status: 500 });
  }
}
