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
