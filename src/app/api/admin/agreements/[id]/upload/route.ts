import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Agreement from '@/models/Agreement';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifySession } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await verifySession(request as any);
    if (!session?.authenticated || session.role !== 'admin') {
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

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'agreements');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {}

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${params.id}_${timestamp}_${safeName}`;
    const filepath = path.join(uploadDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    agreement.pdfPath = `/uploads/agreements/${filename}`;
    agreement.pdfOriginalName = file.name;
    agreement.pdfSize = file.size;
    agreement.pdfMimeType = file.type;
    agreement.updatedBy = session.email || 'admin';
    await agreement.save();

    return NextResponse.json({ success: true, agreement });
  } catch (error) {
    console.error('Agreement PDF upload error:', error);
    return NextResponse.json({ error: 'Failed to upload PDF' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await verifySession(request as any);
    if (!session?.authenticated || session.role !== 'admin') {
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

    try {
      const publicPath = agreement.pdfPath.startsWith('/') ? agreement.pdfPath.slice(1) : agreement.pdfPath;
      const fullPath = path.join(process.cwd(), 'public', publicPath.replace(/^uploads\//, 'uploads/'));
      const { unlink } = await import('fs/promises');
      await unlink(fullPath).catch(() => {});
    } catch {}

    agreement.pdfPath = undefined;
    agreement.pdfOriginalName = undefined as any;
    agreement.pdfSize = undefined as any;
    agreement.pdfMimeType = undefined as any;
    agreement.updatedBy = session.email || 'admin';
    await agreement.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Agreement PDF delete error:', error);
    return NextResponse.json({ error: 'Failed to remove PDF' }, { status: 500 });
  }
}
