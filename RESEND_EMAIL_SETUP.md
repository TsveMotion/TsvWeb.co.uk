# 📧 RESEND EMAIL SETUP GUIDE

**Date:** October 16, 2025  
**Status:** ✅ **READY TO CONFIGURE**

---

## 🚀 **QUICK SETUP (5 MINUTES)**

### **Step 1: Get Resend API Key**

1. Go to: https://resend.com
2. Sign up or login
3. Go to **API Keys** section
4. Click **Create API Key**
5. Copy the key (starts with `re_`)

---

### **Step 2: Add to Environment Variables**

Open `.env.local` file and add:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=TsvWeb <noreply@tsvweb.com>
```

**Important:**
- Replace `re_your_api_key_here` with your actual API key
- Change `noreply@tsvweb.com` to your verified domain email

---

### **Step 3: Verify Domain (Important!)**

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain: `tsvweb.com`
4. Add the DNS records Resend provides:
   - SPF record
   - DKIM record
   - DMARC record (optional)
5. Wait for verification (usually 5-10 minutes)

**Until domain is verified:**
- You can only send to your own email
- Use this for testing

---

### **Step 4: Restart Development Server**

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

---

## ✅ **TESTING**

### **Test 1: Check Configuration**

1. Go to: `http://localhost:3000/admin/newsletter`
2. Try to send a newsletter
3. If you see "Resend API key not configured" → Check `.env.local`
4. If you see "Unauthorized" → Login to admin panel

### **Test 2: Send Test Email**

1. Add your email as a subscriber
2. Compose a simple newsletter:
   ```
   Subject: Test Newsletter
   Content: This is a test email from TsvWeb!
   ```
3. Click "Send to X Subscribers"
4. Check your inbox (and spam folder)

---

## 🔧 **CONFIGURATION OPTIONS**

### **Environment Variables:**

```env
# Required
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional (with defaults)
EMAIL_FROM=TsvWeb <noreply@tsvweb.com>
```

### **Email Limits:**

**Free Plan:**
- 100 emails/day
- 3,000 emails/month

**Pro Plan:**
- 50,000 emails/month
- Custom limits available

---

## 📝 **EXAMPLE .env.local FILE**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/tsvweb

# NextAuth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Resend Email (ADD THESE)
RESEND_API_KEY=re_123abc456def789ghi
EMAIL_FROM=TsvWeb <hello@tsvweb.com>

# Admin Credentials
ADMIN_EMAIL=admin@tsvweb.com
ADMIN_PASSWORD=your-admin-password
```

---

## 🐛 **TROUBLESHOOTING**

### **Error: "Resend API key not configured"**

**Solution:**
1. Check `.env.local` file exists
2. Verify `RESEND_API_KEY` is set
3. Restart dev server
4. Clear browser cache

### **Error: "Unauthorized - Please login"**

**Solution:**
1. Login to admin panel
2. Go to `/admin/newsletter`
3. Try again

### **Error: "Domain not verified"**

**Solution:**
1. Go to Resend dashboard
2. Verify your domain
3. Add DNS records
4. Wait for verification

### **Emails not arriving**

**Check:**
1. ✅ Spam folder
2. ✅ Email address is correct
3. ✅ Domain is verified in Resend
4. ✅ API key is valid
5. ✅ Check Resend dashboard logs

---

## 📊 **HOW IT WORKS**

### **Flow:**

```
1. Admin composes newsletter
   ↓
2. Clicks "Send to X Subscribers"
   ↓
3. System checks authentication (NextAuth)
   ↓
4. Gets active subscribers from database
   ↓
5. Sends emails in batches of 50
   ↓
6. Each batch sent via Resend API
   ↓
7. Returns success/failure stats
```

### **Batch Sending:**

```typescript
// Sends 50 emails at a time
const batchSize = 50;

for (let i = 0; i < emails.length; i += batchSize) {
  const batch = emails.slice(i, i + batchSize);
  await resend.emails.send({
    from: 'TsvWeb <noreply@tsvweb.com>',
    to: batch,
    subject: subject,
    html: content
  });
}
```

---

## 🎯 **FEATURES**

### **✅ Working:**
- Batch email sending (50 per batch)
- HTML and plain text support
- Selective subscriber sending
- Success/failure tracking
- Error handling
- API key validation

### **✅ Supported:**
- Multiple recipients
- HTML templates
- Plain text fallback
- Custom from address
- Subject customization

---

## 🔐 **SECURITY**

### **Best Practices:**

1. ✅ **Never commit `.env.local`** to git
2. ✅ **Use environment variables** for API keys
3. ✅ **Verify domain** before production
4. ✅ **Monitor usage** in Resend dashboard
5. ✅ **Rotate API keys** periodically

### **Production Checklist:**

- [ ] Domain verified in Resend
- [ ] DNS records added
- [ ] API key in production environment
- [ ] EMAIL_FROM uses verified domain
- [ ] Test emails sent successfully
- [ ] Monitoring set up

---

## 📧 **EMAIL TEMPLATES**

### **HTML Email:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563eb;">Newsletter Title</h1>
  <p>Your content here...</p>
</div>
```

### **Plain Text:**
```
Newsletter Title

Your content here...

Best regards,
TsvWeb Team
```

---

## 🎉 **RESULT**

**After setup, you can:**
- ✅ Send newsletters to all subscribers
- ✅ Send to selected subscribers only
- ✅ Preview emails before sending
- ✅ Generate AI content
- ✅ Track success/failure rates
- ✅ Use HTML or plain text

---

## 📚 **RESOURCES**

- **Resend Docs:** https://resend.com/docs
- **API Reference:** https://resend.com/docs/api-reference
- **Domain Setup:** https://resend.com/docs/dashboard/domains/introduction
- **Pricing:** https://resend.com/pricing

---

## ⚡ **QUICK COMMANDS**

### **Check if configured:**
```bash
# In terminal
echo $RESEND_API_KEY
```

### **Test API key:**
```bash
curl -X POST https://api.resend.com/emails \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your@email.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

---

## ✅ **SETUP COMPLETE!**

**Next Steps:**
1. Get Resend API key
2. Add to `.env.local`
3. Verify domain
4. Restart server
5. Test sending

**Need Help?**
- Check Resend dashboard logs
- Review error messages
- Verify domain status
- Check API key validity

---

**🎉 EMAIL SENDING READY TO USE!** 📧
