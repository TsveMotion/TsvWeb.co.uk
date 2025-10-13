import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Agreement from '@/models/Agreement';
import { sendEmail } from '@/lib/email';
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

    if (!agreement.pdfPath) {
      return NextResponse.json({ error: 'Agreement PDF not uploaded' }, { status: 400 });
    }

    // mark as sent and set company signature timestamp if not already set
    agreement.status = 'sent';
    agreement.sentAt = new Date();
    agreement.companySignedAt = agreement.companySignedAt ?? new Date();
    agreement.companySignerName = agreement.companySignerName || session.name || 'TsvWeb';
    agreement.updatedBy = session.email || 'admin';
    await agreement.save();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const signUrl = `${baseUrl}/agreements/${agreement.token}`;

    // send email to client with signing link
    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Agreement: ${agreement.title}</h2>
        <p>Hello ${agreement.clientName},</p>
        <p>You have an agreement awaiting your review and signature. Please click the button below to read and sign.</p>
        <p style="margin:24px 0;"><a href="${signUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 18px;border-radius:6px;text-decoration:none;">View & Sign Agreement</a></p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${signUrl}">${signUrl}</a></p>
        <hr />
        <p style="color:#6b7280;font-size:12px;">This link is unique to your agreement. If you have questions, reply to this email.</p>
      </div>
    `;

    await sendEmail({ to: agreement.clientEmail, subject: `Please sign: ${agreement.title}`, html });

    return NextResponse.json({ success: true, signUrl });
  } catch (error) {
    console.error('Agreement send error:', error);
    return NextResponse.json({ error: 'Failed to send agreement' }, { status: 500 });
  }
}
