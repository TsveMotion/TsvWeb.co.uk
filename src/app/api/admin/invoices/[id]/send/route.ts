import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Invoice from '@/models/Invoice';
import { verifySession } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authData = await verifySession(request);
    if (!authData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const invoice = await Invoice.findById(params.id);
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const { customMessage } = await request.json();

    // Generate the public URL for the invoice/quote
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const publicUrl = `${baseUrl}/${invoice.type}/${invoice._id}`;

    // Create email content
    const subject = `${invoice.type === 'invoice' ? 'Invoice' : 'Quote'} ${invoice.invoiceNumber}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New ${invoice.type === 'invoice' ? 'Invoice' : 'Quote'}</h2>
        
        <p>Dear ${invoice.customerName},</p>
        
        ${customMessage ? `<p>${customMessage}</p>` : ''}
        
        <p>Please find your ${invoice.type} details below:</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>${invoice.type === 'invoice' ? 'Invoice' : 'Quote'} #${invoice.invoiceNumber}</h3>
          <p><strong>Date:</strong> ${new Date(invoice.issueDate).toLocaleDateString()}</p>
          ${invoice.dueDate ? `<p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>` : ''}
          <p><strong>Total:</strong> ${invoice.currency} ${invoice.total.toFixed(2)}</p>
        </div>
        
        <p>
          <a href="${publicUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View ${invoice.type === 'invoice' ? 'Invoice' : 'Quote'}
          </a>
        </p>
        
        ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
        
        <p>Thank you for your business!</p>
        
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          This email was sent automatically. Please do not reply to this email.
        </p>
      </div>
    `;

    // Send email
    await sendEmail({
      to: invoice.customerEmail,
      subject,
      html: emailHtml
    });

    // Update invoice status and email sent timestamp
    await Invoice.findByIdAndUpdate(params.id, {
      status: invoice.status === 'draft' ? 'sent' : invoice.status,
      emailSentAt: new Date()
    });

    return NextResponse.json({ 
      message: 'Email sent successfully',
      publicUrl 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
