// Email utility functions using Resend
import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
// Note: This will be undefined until the API key is added to .env.local
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// From email address for all emails
const fromEmail = process.env.EMAIL_FROM || 'contact@yourdomain.com';

/**
 * Send a confirmation email to a user who submitted a contact inquiry
 */
export async function sendInquiryConfirmation(
  to: string,
  name: string,
  subject?: string
) {
  if (!resend) {
    console.error('Resend API key not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: 'We received your inquiry',
      html: `
        <div>
          <h1>Thank you for contacting us, ${name}!</h1>
          <p>We have received your inquiry${subject ? ` regarding "${subject}"` : ''}.</p>
          <p>Our team will review your message and get back to you as soon as possible.</p>
          <p>This is an automated response, please do not reply to this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending confirmation email:', error);
    return { success: false, error };
  }
}

/**
 * Send a reply email from admin to an inquiry
 */
export async function sendInquiryReply(
  to: string,
  name: string,
  subject: string,
  message: string
) {
  if (!resend) {
    console.error('Resend API key not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html: `
        <div>
          <p>Hello ${name},</p>
          <div>${message}</div>
          <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            Thank you for contacting us.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending reply email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending reply email:', error);
    return { success: false, error };
  }
}

/**
 * Send a welcome email to a new newsletter subscriber
 */
export async function sendNewsletterWelcome(to: string) {
  if (!resend) {
    console.error('Resend API key not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: 'Welcome to our Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Welcome to TsvWeb Newsletter!</h1>
            <p style="color: #6b7280; font-size: 16px;">Thank you for subscribing to our newsletter</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-top: 0;">What to expect:</h2>
            <ul style="color: #4b5563; line-height: 1.6;">
              <li>Latest web development tips and trends</li>
              <li>Project showcases and case studies</li>
              <li>Industry insights and best practices</li>
              <li>Exclusive offers and updates</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px;">
              You're receiving this email because you subscribed to our newsletter.<br>
              If you didn't subscribe or want to unsubscribe, please contact us.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending newsletter welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending newsletter welcome email:', error);
    return { success: false, error };
  }
}

/**
 * Send a newsletter to multiple subscribers
 */
export async function sendNewsletterBatch({
  subscribers,
  subject,
  content,
  contentType = 'html'
}: {
  subscribers: Array<{ email: string; unsubscribeToken: string }>;
  subject: string;
  content: string;
  contentType?: 'html' | 'text';
}) {
  if (!resend) {
    console.error('Resend API key not configured');
    return { success: false, error: 'Email service not configured' };
  }

  const results = {
    successful: 0,
    failed: 0,
    errors: [] as any[]
  };

  // Send emails in batches to avoid overwhelming the service
  const batchSize = 10;
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    
    const emailPromises = batch.map(async (subscriber) => {
      try {
        const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`;
        
        let emailContent = content;
        
        // Add unsubscribe link to content
        if (contentType === 'html') {
          emailContent += `
            <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666; text-align: center;">
              You received this email because you subscribed to our newsletter.<br>
              <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe</a>
            </p>
          `;
        } else {
          emailContent += `\n\n---\nYou received this email because you subscribed to our newsletter.\nUnsubscribe: ${unsubscribeUrl}`;
        }

        const emailOptions: any = {
          from: fromEmail,
          to: subscriber.email,
          subject: subject,
        };
        
        if (contentType === 'html') {
          emailOptions.html = emailContent;
        } else {
          emailOptions.text = emailContent;
        }

        const { data, error } = await resend.emails.send(emailOptions);

        if (error) {
          results.failed++;
          results.errors.push({ email: subscriber.email, error });
        } else {
          results.successful++;
        }
      } catch (error) {
        results.failed++;
        results.errors.push({ email: subscriber.email, error });
      }
    });

    await Promise.all(emailPromises);
    
    // Add a small delay between batches
    if (i + batchSize < subscribers.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return {
    success: true,
    stats: {
      total: subscribers.length,
      successful: results.successful,
      failed: results.failed
    },
    errors: results.errors
  };
}

/**
 * Send a generic email (used for invoices, quotes, etc.)
 */
export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.error('Resend API key not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending email:', error);
    return { success: false, error };
  }
}
