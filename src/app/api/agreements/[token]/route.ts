import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Agreement from '@/models/Agreement';
import Contract from '@/models/Contract';
import { sendEmail } from '@/lib/email';

// GET: fetch public view of an agreement by token and increment views
export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  try {
    await connectToDatabase();
    const ag = await Agreement.findOneAndUpdate(
      { token: params.token },
      { $inc: { views: 1 } },
      { new: true }
    ).lean() as any;

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

    // Update linked contract with signature details
    if (ag.userId) {
      await Contract.findOneAndUpdate(
        { userId: ag.userId, clientEmail: ag.clientEmail },
        {
          status: 'signed',
          signedAt: ag.clientSignedAt,
          signedBy: ag.clientSignatureName,
          signatureDetails: {
            signerName: ag.clientSignatureName,
            signedAt: ag.clientSignedAt,
            ip: ag.clientSignatureIp,
            userAgent: ag.clientSignatureUserAgent
          }
        },
        { sort: { createdAt: -1 } }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const agreementUrl = `${baseUrl}/agreements/${ag.token}`;

    // email both parties
    const signedDate = ag.clientSignedAt ? new Date(ag.clientSignedAt).toLocaleString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      timeZoneName: 'short'
    }) : 'Unknown';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">✓ Agreement Signed</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">${ag.title}</h2>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">This agreement has been successfully signed and is now legally binding.</p>
          
          <div style="background: #f9fafb; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px;">Signature Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px;"><strong>Signed by:</strong></td>
                <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${ag.clientSignatureName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Client:</strong></td>
                <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${ag.clientName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Date & Time:</strong></td>
                <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${signedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>IP Address:</strong></td>
                <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-family: monospace;">${ag.clientSignatureIp}</td>
              </tr>
            </table>
          </div>

          <div style="margin: 25px 0; text-align: center;">
            <a href="${agreementUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">View Agreement</a>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">This is an automated notification. The signature has been recorded with timestamp, IP address, and user agent for legal verification purposes.</p>
          </div>
        </div>
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
