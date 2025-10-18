import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Agreement from '@/models/Agreement';
import { put, del } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectToDatabase();

    const agreement = await Agreement.findById(params.id);
    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as unknown as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate PDF only
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const blobPath = `agreements/${params.id}/${timestamp}_${safeName}`;

    // Upload to Vercel Blob
    const blob = await put(blobPath, file, {
      access: 'public',
      addRandomSuffix: false
    });

    agreement.pdfPath = blob.url;
    agreement.pdfOriginalName = file.name;
    agreement.pdfSize = file.size;
    agreement.pdfMimeType = file.type;
    agreement.updatedBy = session.user.email || 'admin';
    await agreement.save();

    return NextResponse.json({ success: true, agreement });
  } catch (error) {
    console.error('Agreement PDF upload error:', error);
    return NextResponse.json({ error: 'Failed to upload PDF' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const agreement = await Agreement.findById(params.id);
    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    if (!agreement.pdfPath) {
      return NextResponse.json({ error: 'No PDF to remove' }, { status: 400 });
    }

    // Delete from Vercel Blob if it's a blob URL
    if (agreement.pdfPath.includes('vercel-storage.com')) {
      try {
        await del(agreement.pdfPath);
      } catch (error) {
        console.error('Error deleting from blob:', error);
      }
    }

    agreement.pdfPath = undefined;
    agreement.pdfOriginalName = undefined as any;
    agreement.pdfSize = undefined as any;
    agreement.pdfMimeType = undefined as any;
    agreement.updatedBy = session.user.email || 'admin';
    await agreement.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Agreement PDF delete error:', error);
    return NextResponse.json({ error: 'Failed to remove PDF' }, { status: 500 });
  }
}
