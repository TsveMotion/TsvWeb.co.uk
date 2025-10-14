import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Inquiry } from '@/models/Inquiry';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.error('⚠️ RESEND_API_KEY is not set in environment variables!');
}

// Generate unique slug
function generateSlug(name: string): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 20);
  
  return `${nameSlug}-${timestamp}-${randomStr}`;
}

// Generate SEO Audit HTML
function generateSEOAuditHTML(name: string, slug: string): string {
  const quoteUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://tsvweb.com'}/request-quote/${slug}`;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Free SEO Audit - TsvWeb</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">🎁 Your Free SEO Audit</h1>
              <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 16px;">Discover how to rank higher in Birmingham</p>
            </td>
          </tr>
          
          <!-- Personalized Greeting -->
          <tr>
            <td style="padding: 40px 30px 20px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">Hi ${name}! 👋</h2>
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thank you for your interest in TsvWeb! We're excited to help you dominate the Birmingham market with a powerful online presence.
              </p>
            </td>
          </tr>
          
          <!-- SEO Checklist -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #2563eb; border-radius: 8px; padding: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 20px;">📊 Quick SEO Checklist</h3>
                <ul style="margin: 0; padding-left: 20px; color: #1f2937;">
                  <li style="margin-bottom: 10px;">✅ Mobile-responsive design (Google's #1 ranking factor)</li>
                  <li style="margin-bottom: 10px;">✅ Fast page load speed (under 3 seconds)</li>
                  <li style="margin-bottom: 10px;">✅ Birmingham-focused local SEO optimization</li>
                  <li style="margin-bottom: 10px;">✅ Google Business Profile integration</li>
                  <li style="margin-bottom: 10px;">✅ Schema markup for better search visibility</li>
                  <li style="margin-bottom: 10px;">✅ SSL certificate (HTTPS)</li>
                  <li style="margin-bottom: 10px;">✅ Optimized meta titles and descriptions</li>
                  <li style="margin-bottom: 0;">✅ Regular content updates and blog posts</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Key Benefits -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px;">🚀 What You'll Get:</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 15px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 10px;">
                    <strong style="color: #2563eb;">🎯 Targeted Traffic</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Attract customers actively searching for your services in Birmingham</p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #f9fafb; border-radius: 8px;">
                    <strong style="color: #2563eb;">💰 Higher Conversions</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Turn visitors into paying customers with optimized design</p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #f9fafb; border-radius: 8px;">
                    <strong style="color: #2563eb;">📈 Measurable Results</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Track your growth with detailed analytics and reporting</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <a href="${quoteUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 12px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);">
                🎁 Get Your Custom Quote Now
              </a>
              <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">Takes less than 2 minutes • No credit card required</p>
            </td>
          </tr>
          
          <!-- Social Proof -->
          <tr>
            <td style="padding: 0 30px 30px 30px; background-color: #f9fafb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                ⭐⭐⭐⭐⭐<br>
                <strong style="color: #1f2937;">Trusted by 50+ Birmingham businesses</strong><br>
                Fast, SEO-optimised websites that bring real results
              </p>
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Generate unique slug
    const slug = generateSlug(name);

    // Create inquiry with quote request details
    const inquiry = await Inquiry.create({
      name,
      email,
      subject: 'Quote Request - SEO Audit',
      message: `New quote request from ${name}. Awaiting service selection.\n\nQuote URL: /request-quote/${slug}`,
      status: 'new',
    });

    // Send SEO Audit Email
    try {
      console.log('📧 Attempting to send SEO audit email to:', email);
      
      const emailResult = await resend.emails.send({
        from: 'TsvWeb - Quote <quote@mail.tsvweb.com>',
        to: email,
        replyTo: 'support@tsvweb.com',
        subject: `${name}, here's your FREE SEO Audit + Custom Quote 🎁`,
        html: generateSEOAuditHTML(name, slug),
      });

      console.log('✅ Email sent successfully:', emailResult);
      
      // Update inquiry message to note email was sent
      inquiry.message += `\n\n✅ SEO Audit email sent at ${new Date().toISOString()}`;
      await inquiry.save();
    } catch (emailError: any) {
      console.error('❌ Error sending email:', emailError);
      console.error('Email error details:', {
        message: emailError.message,
        name: emailError.name,
        stack: emailError.stack
      });
      
      // Update inquiry to note email failed
      inquiry.message += `\n\n❌ Email failed to send: ${emailError.message}`;
      await inquiry.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Quote request created successfully',
      data: {
        slug,
        quoteUrl: `/request-quote/${slug}`,
      },
    });
  } catch (error: any) {
    console.error('Error creating quote request:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create quote request' },
      { status: 500 }
    );
  }
}
