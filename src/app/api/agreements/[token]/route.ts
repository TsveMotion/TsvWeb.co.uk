import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Agreement from '@/models/Agreement';
import { sendEmail } from '@/lib/email';

// GET: fetch public view of an agreement by token and increment views
export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  try {
    await connectToDatabase();
    const ag = await Agreement.findOneAndUpdate(
      { token: params.token },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!ag) return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });

    return NextResponse.json({
      success: true,
      agreement: {
        title: ag.title,
        description: ag.description,
        status: ag.status,
        pdfPath: ag.pdfPath,
        clientName: ag.clientName,
        clientEmail: ag.clientEmail,
        companyName: ag.companyName,
        companySignerName: ag.companySignerName,
        sentAt: ag.sentAt,
        clientSignedAt: ag.clientSignedAt,
        companySignedAt: ag.companySignedAt,
      },
    });
  } catch (error) {
    console.error('Agreement fetch error:', error);
    return NextResponse.json({ error: 'Failed to load agreement' }, { status: 500 });
  }
}

// POST: submit signature
export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { signerName, accept } = body || {};

    if (!signerName || !accept) {
      return NextResponse.json({ error: 'Signer name and acceptance are required' }, { status: 400 });
    }

    const ag = await Agreement.findOne({ token: params.token });
    if (!ag) return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });

    if (ag.status === 'signed') {
      return NextResponse.json({ success: true, alreadySigned: true });
    }

    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const ua = req.headers.get('user-agent') || 'unknown';

    ag.clientSignatureName = signerName;
    ag.clientSignedAt = new Date();
    ag.clientSignatureIp = ip;
    ag.clientSignatureUserAgent = ua;
    ag.status = 'signed';
    await ag.save();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const agreementUrl = `${baseUrl}/agreements/${ag.token}`;

    // email both parties
    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Agreement Signed: ${ag.title}</h2>
        <p>The agreement has been signed by <strong>${ag.clientName}</strong> at ${ag.clientSignedAt?.toISOString()}.</p>
        <p>Signer Name (typed): ${ag.clientSignatureName}</p>
        <p>IP: ${ag.clientSignatureIp}</p>
        <p>User-Agent: ${ag.clientSignatureUserAgent}</p>
        <p>You can view the agreement here: <a href="${agreementUrl}">${agreementUrl}</a></p>
      </div>
    `;

    await Promise.all([
      sendEmail({ to: ag.clientEmail, subject: `Signed: ${ag.title}`, html }),
      sendEmail({ to: process.env.EMAIL_FROM || 'contact@yourdomain.com', subject: `Agreement signed by ${ag.clientName}`, html }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Agreement sign error:', error);
    return NextResponse.json({ error: 'Failed to sign agreement' }, { status: 500 });
  }
}
