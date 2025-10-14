# TsvWeb Email Configuration

## Email Sender Addresses

TsvWeb uses different email addresses for different types of communications to maintain professionalism and improve deliverability.

### Current Email Addresses

| Email Address | Purpose | Used For |
|--------------|---------|----------|
| **outreach@tsvweb.com** | Lead notifications & inquiries | Admin notifications when new leads come in |
| **marketing@tsvweb.com** | Marketing & promotional emails | Customer confirmation emails, newsletters |
| **transactions@tsvweb.com** | Transactional emails | Invoices, receipts, payment confirmations |
| **support@tsvweb.com** | Customer support | Support tickets, help requests |
| **hello@tsvweb.com** | General inquiries | Reply-to address for customer emails |

## Implementation

### Wizard Submission Emails

**Admin Notification:**
- **From:** `outreach@tsvweb.com`
- **To:** `Kristiyan@tsvweb.com`
- **Reply-To:** Customer's email address
- **Purpose:** Notify admin of new website inquiry

**Customer Confirmation:**
- **From:** `marketing@tsvweb.com`
- **To:** Customer's email address
- **Reply-To:** `hello@tsvweb.com`
- **Purpose:** Confirm receipt of inquiry and set expectations

## DNS Configuration Required

To use these email addresses with Resend, you need to verify your domain and add the following DNS records:

### SPF Record
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

### DKIM Records
Resend will provide these after domain verification. They look like:
```
Type: TXT
Name: resend._domainkey
Value: [Provided by Resend]
```

### DMARC Record (Optional but Recommended)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@tsvweb.com
```

## Resend Dashboard Setup

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add domain: `tsvweb.com`
3. Copy the DNS records provided
4. Add them to your domain registrar (e.g., Namecheap, GoDaddy)
5. Wait for verification (usually 5-30 minutes)
6. Once verified, all email addresses will work automatically

## Email Types & Future Use Cases

### Outreach Emails (`outreach@tsvweb.com`)
- New lead notifications
- Partnership inquiries
- Business development emails

### Marketing Emails (`marketing@tsvweb.com`)
- Welcome emails
- Newsletter campaigns
- Promotional offers
- Event invitations
- Blog post notifications

### Transaction Emails (`transactions@tsvweb.com`)
- Invoice emails
- Payment confirmations
- Receipt emails
- Subscription renewals
- Contract notifications

### Support Emails (`support@tsvweb.com`)
- Support ticket responses
- Technical assistance
- Bug reports
- Feature requests

### General Emails (`hello@tsvweb.com`)
- General inquiries
- Contact form submissions
- Default reply-to address

## Code Implementation

The email configuration is centralized in `/src/app/api/wizard-submission/route.ts`:

```typescript
const EMAIL_SENDERS = {
  outreach: 'outreach@tsvweb.com',
  transactions: 'transactions@tsvweb.com',
  marketing: 'marketing@tsvweb.com',
  support: 'support@tsvweb.com',
  hello: 'hello@tsvweb.com'
}
```

## Best Practices

1. **Consistency:** Always use the appropriate sender address for each email type
2. **Reply-To:** Set appropriate reply-to addresses so customers can respond easily
3. **Monitoring:** Check email deliverability in Resend dashboard
4. **Testing:** Test emails before going live
5. **Compliance:** Follow GDPR and CAN-SPAM regulations

## Testing

Before going live, test each email type:

```bash
# Test outreach email
curl -X POST http://localhost:3000/api/wizard-submission \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"1234567890","company":"Test Co","projectType":"new-website","budget":"discuss","timeline":"asap"}'
```

## Troubleshooting

### Emails Not Sending
1. Check Resend API key in `.env.local`
2. Verify domain in Resend dashboard
3. Check DNS records are properly configured
4. Review Resend logs for errors

### Emails Going to Spam
1. Ensure SPF, DKIM, and DMARC are configured
2. Warm up your domain by sending gradually increasing volumes
3. Maintain good sender reputation
4. Use proper email formatting and avoid spam triggers

## Environment Variables

Required in `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

No need to set individual email addresses as they're hardcoded in the configuration.
