/**
 * Admin Notification System
 * Sends email notifications to admin for all new inquiries
 */

import { sendEmail } from './email';

interface InquiryNotification {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  urgency?: 'critical' | 'high' | 'normal';
  priority?: string;
  category?: string;
  createdAt: Date;
}

/**
 * Send admin notification for new inquiry
 */
export async function sendAdminNotification(inquiry: InquiryNotification): Promise<boolean> {
  try {
    const isCritical = inquiry.urgency === 'critical' || inquiry.priority === 'urgent';
    const isHigh = inquiry.urgency === 'high' || inquiry.priority === 'high';
    
    let urgencyEmoji = '📧';
    let urgencyText = 'New Inquiry';
    let urgencyColor = '#3B82F6'; // Blue
    
    if (isCritical) {
      urgencyEmoji = '🚨🚨🚨';
      urgencyText = 'CRITICAL PROBLEM';
      urgencyColor = '#DC2626'; // Red
    } else if (isHigh) {
      urgencyEmoji = '⚠️';
      urgencyText = 'HIGH PRIORITY ISSUE';
      urgencyColor = '#EA580C'; // Orange
    }
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .alert-header { 
      background: ${urgencyColor}; 
      color: white; 
      padding: 20px; 
      text-align: center; 
      border-radius: 8px 8px 0 0;
      font-size: 24px;
      font-weight: bold;
    }
    .content { 
      background: #f9fafb; 
      padding: 30px; 
      border: 3px solid ${urgencyColor};
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    .info-box { 
      background: white; 
      padding: 15px; 
      margin: 15px 0; 
      border-left: 4px solid ${urgencyColor};
      border-radius: 4px;
    }
    .label { 
      font-weight: bold; 
      color: ${urgencyColor}; 
      display: inline-block;
      min-width: 120px;
    }
    .message-box {
      background: white;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      border: 2px solid #e5e7eb;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      padding: 20px;
      color: #666;
      font-size: 12px;
    }
    .cta-button {
      display: inline-block;
      background: ${urgencyColor};
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="alert-header">
      ${urgencyEmoji} ${urgencyText} ${urgencyEmoji}
    </div>
    <div class="content">
      <h2 style="color: ${urgencyColor}; margin-top: 0;">New Inquiry Received!</h2>
      
      <p style="font-size: 16px; margin-bottom: 20px;">
        ${isCritical ? 'A <strong>CRITICAL</strong> inquiry has been submitted and requires immediate attention.' : 
          isHigh ? 'A <strong>HIGH PRIORITY</strong> inquiry has been submitted.' : 
          'A new inquiry has been submitted.'}
      </p>

      <div class="info-box">
        <p><span class="label">Customer Name:</span> ${inquiry.name}</p>
        <p><span class="label">Email:</span> <a href="mailto:${inquiry.email}" style="color: ${urgencyColor};">${inquiry.email}</a></p>
        ${inquiry.phone ? `<p><span class="label">Phone:</span> <a href="tel:${inquiry.phone}" style="color: ${urgencyColor}; font-size: 16px; font-weight: bold;">📞 ${inquiry.phone}</a></p>` : ''}
        ${inquiry.category ? `<p><span class="label">Category:</span> ${inquiry.category}</p>` : ''}
        ${inquiry.priority ? `<p><span class="label">Priority:</span> <strong>${inquiry.priority}</strong></p>` : ''}
        <p><span class="label">Received:</span> ${new Date(inquiry.createdAt).toLocaleString('en-GB', { 
          day: 'numeric',
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>

      <div class="info-box">
        <p><span class="label">Subject:</span></p>
        <p style="font-size: 18px; font-weight: bold; margin: 10px 0;">${inquiry.subject}</p>
      </div>

      <div class="message-box">
        <p style="font-weight: bold; color: ${urgencyColor}; margin-bottom: 10px;">Customer Message:</p>
        <p style="white-space: pre-wrap; font-size: 14px;">${inquiry.message}</p>
      </div>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/inquiries" class="cta-button">
          View in Admin Panel →
        </a>
      </div>

      ${isCritical ? `
      <div style="background: #FEE2E2; padding: 15px; border-radius: 6px; margin-top: 20px; border-left: 4px solid #DC2626;">
        <p style="margin: 0; color: #991B1B; font-weight: bold;">
          ⚠️ This is a CRITICAL inquiry. Please respond immediately!
        </p>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      <p>This is an automated notification from TsvWeb Admin System</p>
      <p>Log in to the admin panel to respond to the customer.</p>
    </div>
  </div>
</body>
</html>
    `;

    await sendEmail({
      to: 'Kristiyan@Tsvweb.com',
      subject: `${urgencyEmoji} ${urgencyText}: ${inquiry.subject}`,
      html: htmlContent
    });

    console.log(`✅ Admin notification sent for inquiry from ${inquiry.email}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error);
    return false;
  }
}
