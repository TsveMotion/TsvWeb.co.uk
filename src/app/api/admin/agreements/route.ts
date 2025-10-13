import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Agreement from '@/models/Agreement';
import crypto from 'crypto';
import { User } from '@/models/User';

// GET - list agreements (basic)
export async function GET() {
  try {
    await connectToDatabase();
    const items = await Agreement.find({}).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ success: true, items });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to list agreements' }, { status: 500 });
  }
}

// POST - create an agreement (without PDF). Returns agreement and token, then client should upload PDF to /api/admin/agreements/[id]/upload and optionally send.
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const {
      title,
      description,
      userId,
      clientName,
      clientEmail,
      clientCompany,
      companyName = 'TsvWeb',
      companySignerName,
      createdBy,
      pdfPath
    } = body || {};

    if (!title || !clientName || !clientEmail || !createdBy) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const token = crypto.randomUUID().replace(/-/g, '') + Math.random().toString(36).slice(2, 8);

    // If linked to a user, try to backfill client name/email from user
    let finalClientName = clientName;
    let finalClientEmail = clientEmail;
    if (userId) {
      try {
        const u = await User.findById(userId).lean();
        if (u) {
          const uu: any = u as any;
          finalClientName = (uu?.name as string) || finalClientName;
          finalClientEmail = (uu?.email as string) || finalClientEmail;
        }
      } catch {}
    }

    const agreement = await Agreement.create({
      title,
      description,
      token,
      status: 'draft',
      userId,
      clientName: finalClientName,
      clientEmail: finalClientEmail,
      clientCompany,
      companyName,
      companySignerName,
      ...(pdfPath ? { pdfPath } : {}),
      views: 0,
      createdBy,
    });

    return NextResponse.json({ success: true, agreement });
  } catch (error) {
    console.error('Error creating agreement:', error);
    return NextResponse.json({ success: false, error: 'Failed to create agreement' }, { status: 500 });
  }
}
