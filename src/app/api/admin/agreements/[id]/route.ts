import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Agreement from '@/models/Agreement';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import path from 'path';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const ag = await Agreement.findById(params.id);
    if (!ag) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    // If it has a PDF, attempt to delete file as well
    if (ag.pdfPath) {
      try {
        const publicPath = ag.pdfPath.startsWith('/') ? ag.pdfPath.slice(1) : ag.pdfPath;
        const fullPath = path.join(process.cwd(), 'public', publicPath.replace(/^uploads\//, 'uploads/'));
        const { unlink } = await import('fs/promises');
        await unlink(fullPath).catch(() => {});
      } catch {}
    }

    await Agreement.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Agreement delete error:', error);
    return NextResponse.json({ error: 'Failed to delete agreement' }, { status: 500 });
  }
}
