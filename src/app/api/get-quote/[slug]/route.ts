import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Inquiry } from '@/models/Inquiry';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.error('⚠️ RESEND_API_KEY is not set in environment variables!');
}

// Generate quote confirmation email
function generateQuoteConfirmationEmail(name: string, estimatedCost: { monthly: number; oneOff: number }, services: string[]): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Quote from TsvWeb</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">🎉 Your Custom Quote</h1>
              <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 16px;">Thank you for choosing TsvWeb!</p>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="padding: 40px 30px 20px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">Hi ${name}! 👋</h2>
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Great news! We've prepared your custom quote based on your requirements. Here's what we can do for you:
              </p>
            </td>
          </tr>
          
          <!-- Pricing -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 20px 0; color: #1e40af; font-size: 24px; text-align: center;">💰 Your Investment</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%" style="padding: 20px; background-color: #ffffff; border-radius: 8px; text-align: center;">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; font-weight: 600;">Monthly Package</p>
                      <p style="margin: 0; color: #2563eb; font-size: 36px; font-weight: bold;">£${estimatedCost.monthly}</p>
                      <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">per month</p>
                    </td>
                    <td width="10"></td>
                    <td width="50%" style="padding: 20px; background-color: #ffffff; border-radius: 8px; text-align: center;">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; font-weight: 600;">One-Off Payment</p>
                      <p style="margin: 0; color: #10b981; font-size: 36px; font-weight: bold;">£${estimatedCost.oneOff}</p>
                      <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">setup & development</p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- Selected Services -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px;">📋 Selected Services:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #4b5563; line-height: 2;">
                ${services.map(service => `<li style="margin-bottom: 8px;">${service}</li>`).join('')}
              </ul>
            </td>
          </tr>
          
          <!-- Next Steps -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #f9fafb; border-left: 4px solid #2563eb; border-radius: 8px; padding: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">🚀 What Happens Next?</h3>
                <ol style="margin: 0; padding-left: 20px; color: #4b5563; line-height: 2;">
                  <li>Our team will review your requirements within 24 hours</li>
                  <li>We'll send you a detailed proposal and timeline</li>
                  <li>Schedule a free consultation call to discuss your project</li>
                  <li>Once approved, we'll start building your dream website!</li>
                </ol>
              </div>
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">Have questions? We're here to help!</p>
              <a href="tel:+4407444358808" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: bold; margin: 0 10px 10px 0;">
                📞 Call Us: 07444 358808
              </a>
              <a href="mailto:support@tsvweb.com" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">
                📧 Email Us
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #1f2937; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 14px;">
                <strong style="color: #ffffff;">TsvWeb</strong><br>
                Professional Web Design & Development in Birmingham
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                📞 07444 358808 | 📧 support@tsvweb.com<br>
                🌐 <a href="https://tsvweb.com" style="color: #60a5fa; text-decoration: none;">www.tsvweb.com</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();

    // Find inquiry by checking if slug is in the message
    const inquiry = await Inquiry.findOne({ 
      message: { $regex: `/request-quote/${params.slug}` }
    });

    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: 'Quote request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        name: inquiry.name,
        email: inquiry.email,
        slug: params.slug,
      },
    });
  } catch (error: any) {
    console.error('Error fetching quote request:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch quote request' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const { businessName, website, industry, services, additionalRequirements, estimatedCost } = body;

    await dbConnect();

    // Find inquiry by checking if slug is in the message
    const inquiry = await Inquiry.findOne({ 
      message: { $regex: `/request-quote/${params.slug}` }
    });

    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: 'Quote request not found' },
        { status: 404 }
      );
    }

    // Update inquiry with quote details
    inquiry.subject = `Quote Request - ${businessName}`;
    inquiry.message = `📋 Business: ${businessName}
🌐 Website: ${website || 'Not provided'}
🏢 Industry: ${industry}

💰 PRICING:
Monthly: £${estimatedCost.monthly}
One-off: £${estimatedCost.oneOff}

🛠️ SERVICES:
${services.map((s: string) => `• ${s}`).join('\n')}

📝 REQUIREMENTS:
${additionalRequirements || 'None specified'}

🔗 Quote URL: /request-quote/${params.slug}`;
    
    inquiry.status = 'new';
    await inquiry.save();

    // Send quote confirmation email
    try {
      console.log('📧 Attempting to send quote confirmation email to:', inquiry.email);
      
      const emailResult = await resend.emails.send({
        from: 'TsvWeb - Quote <quote@mail.tsvweb.com>',
        to: inquiry.email,
        replyTo: 'support@tsvweb.com',
        subject: `${inquiry.name}, here's your custom quote from TsvWeb! 💰`,
        html: generateQuoteConfirmationEmail(inquiry.name, estimatedCost, services),
      });

      console.log('✅ Quote confirmation email sent successfully:', emailResult);
      
      // Update inquiry to note email was sent
      inquiry.message += `\n\n✅ Quote confirmation email sent at ${new Date().toISOString()}`;
      await inquiry.save();
    } catch (emailError: any) {
      console.error('❌ Error sending quote confirmation email:', emailError);
      console.error('Email error details:', {
        message: emailError.message,
        name: emailError.name,
        stack: emailError.stack
      });
      
      // Update inquiry to note email failed
      inquiry.message += `\n\n❌ Quote email failed to send: ${emailError.message}`;
      await inquiry.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Quote request updated successfully',
      data: {
        name: inquiry.name,
        email: inquiry.email,
        businessName,
        estimatedCost,
      },
    });
  } catch (error: any) {
    console.error('Error updating quote request:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update quote request' },
      { status: 500 }
    );
  }
}
