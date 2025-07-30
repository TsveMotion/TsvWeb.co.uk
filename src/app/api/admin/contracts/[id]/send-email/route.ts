import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Contract from '@/models/Contract';
import { User } from '@/models/User';
import { connectToDatabase } from '@/lib/db';
import nodemailer from 'nodemailer';

// POST - Send contract via email
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
    
    // Get current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get contract
    const contract = await Contract.findById(params.id);
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const body = await request.json();
    const { subject, message, includeAttachments = true } = body;

    if (!subject || !message) {
      return NextResponse.json({
        error: 'Subject and message are required'
      }, { status: 400 });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Prepare attachments
    const attachments = [];
    if (includeAttachments && contract.files.length > 0) {
      for (const file of contract.files) {
        attachments.push({
          filename: file.originalName,
          path: `${process.cwd()}/public${file.path}`
        });
      }
    }

    // Prepare email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">Contract: ${contract.title}</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 4px; margin-bottom: 20px;">
            <p style="color: #555; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">Contract Details:</h3>
            <p><strong>Contract Type:</strong> ${contract.contractType.replace('_', ' ').toUpperCase()}</p>
            <p><strong>Amount:</strong> ${contract.currency} ${contract.amount.toLocaleString()}</p>
            <p><strong>Status:</strong> ${contract.status.toUpperCase()}</p>
            ${contract.startDate ? `<p><strong>Start Date:</strong> ${new Date(contract.startDate).toLocaleDateString()}</p>` : ''}
            ${contract.endDate ? `<p><strong>End Date:</strong> ${new Date(contract.endDate).toLocaleDateString()}</p>` : ''}
          </div>
          
          ${contract.files.length > 0 ? `
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
              <h4 style="color: #856404; margin-bottom: 10px;">📎 Attached Documents:</h4>
              <ul style="color: #856404;">
                ${contract.files.map((file: any) => `<li>${file.originalName}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              This email was sent from TsvWeb Contract Management System<br>
              If you have any questions, please reply to this email.
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email
    const mailOptions = {
      from: `"TsvWeb Contracts" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: contract.clientEmail,
      subject,
      html: htmlContent,
      attachments
    };

    await transporter.sendMail(mailOptions);

    // Update contract with email tracking
    const emailRecord = {
      sentAt: new Date(),
      sentBy: currentUser._id.toString(),
      recipient: contract.clientEmail,
      subject,
      status: 'sent' as const
    };

    contract.emailsSent.push(emailRecord);
    contract.lastEmailSent = new Date();
    if (!contract.sentAt) {
      contract.sentAt = new Date();
      contract.status = 'sent';
    }
    contract.updatedBy = currentUser._id.toString();
    
    await contract.save();

    return NextResponse.json({
      success: true,
      message: 'Contract sent successfully',
      emailRecord,
      contract
    });

  } catch (error) {
    console.error('Error sending contract email:', error);
    
    // Log failed email attempt
    try {
      const contract = await Contract.findById(params.id);
      const currentUser = await User.findOne({ email: (await getServerSession())?.user?.email });
      
      if (contract && currentUser) {
        const emailRecord = {
          sentAt: new Date(),
          sentBy: currentUser._id.toString(),
          recipient: contract.clientEmail,
          subject: 'Failed to send',
          status: 'failed' as const
        };
        
        contract.emailsSent.push(emailRecord);
        await contract.save();
      }
    } catch (logError) {
      console.error('Error logging failed email:', logError);
    }

    return NextResponse.json(
      { error: 'Failed to send contract email' },
      { status: 500 }
    );
  }
}
