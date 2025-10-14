# DNS & Email Security Setup Guide

## Overview
This guide covers the setup of DMARC and SPF records for tsvweb.com to improve email deliverability and prevent email spoofing.

---

## Current Status

### ✅ Already Configured:
- **SPF Record:** `v=spf1 ip4:45.135.114.119 ip4:51.254.104.99 ~all`
  - Status: Active and properly configured
  - Authorizes specific IP addresses to send email on behalf of tsvweb.com

### ❌ Missing:
- **DMARC Record:** Not currently configured
  - Impact: Email deliverability may be affected
  - Risk: Domain could be used for email spoofing

---

## DMARC Record Setup

### What is DMARC?
DMARC (Domain-based Message Authentication, Reporting, and Conformance) is a DNS record that helps prevent email spoofing and improves deliverability. Major email providers like Gmail and Outlook increasingly require DMARC for optimal delivery.

### Recommended DMARC Record

Add the following TXT record to your DNS:

**Record Type:** TXT  
**Host/Name:** `_dmarc`  
**Value:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@tsvweb.com; ruf=mailto:dmarc@tsvweb.com; fo=1; adkim=r; aspf=r; pct=100; rf=afrf; ri=86400`

### DMARC Policy Explanation:

```
v=DMARC1          - DMARC version 1
p=quarantine      - Policy: quarantine suspicious emails (recommended for start)
rua=mailto:...    - Aggregate reports sent to this email
ruf=mailto:...    - Forensic reports sent to this email
fo=1              - Generate reports if any mechanism fails
adkim=r           - Relaxed DKIM alignment
aspf=r            - Relaxed SPF alignment
pct=100           - Apply policy to 100% of emails
rf=afrf           - Report format
ri=86400          - Report interval (24 hours)
```

### Implementation Steps:

1. **Log into your DNS provider** (Cloudflare based on audit)
   - DNS servers: phil.ns.cloudflare.com, grannbo.ns.cloudflare.com

2. **Add DMARC TXT Record:**
   - Type: TXT
   - Name: `_dmarc`
   - Content: `v=DMARC1; p=quarantine; rua=mailto:dmarc@tsvweb.com; ruf=mailto:dmarc@tsvweb.com; fo=1; adkim=r; aspf=r; pct=100; rf=afrf; ri=86400`
   - TTL: Auto or 3600

3. **Wait for DNS propagation** (usually 1-24 hours)

4. **Verify DMARC Record:**
   - Use online tools: https://mxtoolbox.com/dmarc.aspx
   - Enter: tsvweb.com
   - Confirm record is visible

### DMARC Policy Progression:

**Phase 1 (Weeks 1-4): Monitor Mode**
```
v=DMARC1; p=none; rua=mailto:dmarc@tsvweb.com
```
- Monitors email authentication without blocking
- Collects data on email sources

**Phase 2 (Weeks 4-8): Quarantine Mode** ← **Recommended Start**
```
v=DMARC1; p=quarantine; rua=mailto:dmarc@tsvweb.com
```
- Suspicious emails go to spam/junk
- Legitimate emails still delivered

**Phase 3 (After 8+ weeks): Reject Mode**
```
v=DMARC1; p=reject; rua=mailto:dmarc@tsvweb.com
```
- Failed authentication emails are rejected
- Strongest protection but requires confidence

---

## SPF Record (Already Configured)

### Current SPF Record:
```
v=spf1 ip4:45.135.114.119 ip4:51.254.104.99 ~all
```

### What This Means:
- `v=spf1` - SPF version 1
- `ip4:45.135.114.119` - Authorized IP address #1
- `ip4:51.254.104.99` - Authorized IP address #2
- `~all` - Soft fail for other IPs (recommended)

### When to Update SPF:

Update your SPF record if you:
- Add a new email service provider
- Use additional mail servers
- Integrate with email marketing platforms (Mailchimp, SendGrid, etc.)
- Add transactional email services (Postmark, AWS SES, etc.)

### Common SPF Additions:

**For Google Workspace:**
```
v=spf1 include:_spf.google.com ip4:45.135.114.119 ip4:51.254.104.99 ~all
```

**For Microsoft 365:**
```
v=spf1 include:spf.protection.outlook.com ip4:45.135.114.119 ip4:51.254.104.99 ~all
```

**For SendGrid:**
```
v=spf1 include:sendgrid.net ip4:45.135.114.119 ip4:51.254.104.99 ~all
```

---

## DKIM Setup (Optional but Recommended)

### What is DKIM?
DKIM (DomainKeys Identified Mail) adds a digital signature to your emails to verify they haven't been tampered with.

### Setup Process:

1. **Generate DKIM keys** through your email provider
2. **Add DKIM TXT record** to DNS
3. **Enable DKIM signing** in your email service

### Example DKIM Record:
```
Type: TXT
Name: default._domainkey
Value: v=DKIM1; k=rsa; p=[your-public-key]
```

---

## Email Provider Configuration

### Current Email Setup:
Based on the SPF record, you're using custom mail servers:
- IP: 45.135.114.119
- IP: 51.254.104.99

### Ensure Your Email Provider Has:
- ✅ SPF configured (already done)
- ❌ DMARC configured (needs setup)
- ❓ DKIM configured (check with provider)

---

## Testing & Verification

### After DMARC Setup, Test:

1. **DMARC Lookup:**
   - Tool: https://mxtoolbox.com/dmarc.aspx
   - Enter: tsvweb.com
   - Should show your DMARC policy

2. **Email Authentication Test:**
   - Send test email to: check-auth@verifier.port25.com
   - Review the authentication report

3. **Gmail DMARC Check:**
   - Send email to Gmail account
   - View original message
   - Check for "DMARC: PASS"

4. **Monitor Reports:**
   - Check dmarc@tsvweb.com for reports
   - Review authentication failures
   - Identify unauthorized senders

---

## Benefits of DMARC + SPF + DKIM

### Email Deliverability:
- ✅ Higher inbox placement rates
- ✅ Reduced spam folder delivery
- ✅ Better reputation with email providers
- ✅ Compliance with Gmail/Outlook requirements

### Security:
- ✅ Prevents domain spoofing
- ✅ Protects brand reputation
- ✅ Reduces phishing attempts
- ✅ Visibility into email authentication

### Business Impact:
- ✅ More emails reach customers
- ✅ Better email marketing ROI
- ✅ Improved customer trust
- ✅ Professional email infrastructure

---

## Monitoring & Maintenance

### Weekly:
- Check DMARC reports for failures
- Identify any unauthorized email sources
- Monitor email deliverability rates

### Monthly:
- Review aggregate DMARC reports
- Adjust policy if needed (none → quarantine → reject)
- Update SPF if adding new services

### Quarterly:
- Audit all authorized email senders
- Review DKIM signatures
- Test email authentication

---

## Troubleshooting

### Common Issues:

**DMARC Reports Not Received:**
- Verify email address in DMARC record
- Check spam folder
- Wait 24-48 hours for first reports

**Emails Going to Spam:**
- Check SPF alignment
- Verify DKIM signature
- Review DMARC policy (start with p=none)

**Authentication Failures:**
- Confirm SPF includes all mail servers
- Verify DKIM is properly signed
- Check for forwarding issues

---

## Quick Action Items

### Immediate (Today):
1. ✅ Add DMARC TXT record to Cloudflare DNS
2. ✅ Set up dmarc@tsvweb.com email address
3. ✅ Verify DNS propagation after 24 hours

### This Week:
1. Monitor DMARC reports
2. Test email authentication
3. Verify deliverability improvements

### This Month:
1. Review aggregate reports
2. Consider moving to p=reject if no issues
3. Implement DKIM if not already active

---

## Resources

### DNS Management:
- Cloudflare Dashboard: https://dash.cloudflare.com
- DNS Propagation Checker: https://dnschecker.org

### Email Authentication Tools:
- MXToolbox DMARC: https://mxtoolbox.com/dmarc.aspx
- DMARC Analyzer: https://www.dmarcanalyzer.com
- Mail Tester: https://www.mail-tester.com

### Documentation:
- DMARC.org: https://dmarc.org
- Google DMARC Guide: https://support.google.com/a/answer/2466580
- Microsoft DMARC Guide: https://docs.microsoft.com/en-us/microsoft-365/security/office-365-security/use-dmarc-to-validate-email

---

## Summary

**Current Status:**
- ✅ SPF: Configured and working
- ❌ DMARC: **Needs immediate setup**
- ❓ DKIM: Status unknown (check with email provider)

**Priority Action:**
Add DMARC record to DNS today to improve email deliverability and security.

**Expected Impact:**
- Better email inbox placement
- Protection against domain spoofing
- Compliance with modern email standards
- Improved sender reputation

---

*Last Updated: October 2025*
