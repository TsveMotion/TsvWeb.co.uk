import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Contract from '@/models/Contract';
import { connectToDatabase } from '@/lib/db';
import nodemailer from 'nodemailer';

// POST - Send contract for e-signature
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const contract = await Contract.findById(params.id).lean();
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    // Generate signature token
    const signatureToken = generateSignatureToken();
    const signatureUrl = `${process.env.NEXTAUTH_URL}/sign-contract/${params.id}?token=${signatureToken}`;

    // Update contract with signature request info
    await Contract.findByIdAndUpdate(params.id, {
      signatureRequestId: signatureToken,
      status: 'sent',
      sentAt: new Date(),
      lastEmailSent: new Date(),
      $push: {
        emailsSent: {
          sentAt: new Date(),
          sentBy: session.user.email,
          recipient: (contract as any).clientEmail,
          subject: 'Contract Ready for Signature',
          status: 'sent'
        }
      }
    });

    // Send email to client
    await sendSignatureEmail({
      to: (contract as any).clientEmail,
      clientName: (contract as any).clientName,
      contractTitle: (contract as any).title,
      signatureUrl: signatureUrl
    });

    return NextResponse.json({
      success: true,
      message: 'Contract sent for signature successfully',
      signatureUrl: signatureUrl
    });

  } catch (error) {
    console.error('Error sending contract for signature:', error);
    return NextResponse.json(
      { error: 'Failed to send contract for signature' },
      { status: 500 }
    );
  }
}

function generateSignatureToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

async function sendSignatureEmail(params: {
  to: string;
  clientName: string;
  contractTitle: string;
  signatureUrl: string;
}) {
  // Create transporter (you'll need to configure this with your email service)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Contract Ready for Signature</h1>
        </div>
        <div class="content">
          <p>Dear ${params.clientName},</p>
          <p>Your contract "<strong>${params.contractTitle}</strong>" is ready for your electronic signature.</p>
          <p>Please click the button below to review and sign the contract:</p>
          <p style="text-align: center;">
            <a href="${params.signatureUrl}" class="button">Review & Sign Contract</a>
          </p>
          <p>This link will expire in 30 days for security purposes.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>TsvWeb Team</p>
        </div>
        <div class="footer">
          <p>TsvWeb - Professional Web Development<br>Birmingham, UK</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@tsvweb.com',
    to: params.to,
    subject: `Contract Ready for Signature - ${params.contractTitle}`,
    html: emailHtml,
  });
}
