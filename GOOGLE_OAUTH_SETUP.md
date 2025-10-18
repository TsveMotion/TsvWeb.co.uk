# Google OAuth Setup for tsvweb.co.uk

## 🎯 Overview
Complete guide to configure Google OAuth authentication for your new tsvweb.co.uk domain.

---

## 📋 Prerequisites

- Google Cloud Console access
- tsvweb.co.uk deployed and live
- Admin access to your Google account

---

## 🚀 Step-by-Step Setup

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com
2. Sign in with your Google account (kristiyan@tsvweb.com or tsvetozarkt@gmail.com)

### Step 2: Select or Create Project

**Option A: Use Existing Project**
1. Click project dropdown at top
2. Select your existing TsvWeb project

**Option B: Create New Project**
1. Click "Select a project" dropdown
2. Click "NEW PROJECT"
3. Name: `TsvWeb UK` or `TsvWeb Production`
4. Click "CREATE"
5. Wait for project creation (30 seconds)

---

### Step 3: Enable Google+ API

1. In left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for: `Google+ API`
3. Click on **"Google+ API"**
4. Click **"ENABLE"**
5. Wait for activation (10-30 seconds)

---

### Step 4: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**

2. **Choose User Type:**
   - Select **"External"** (for public users)
   - Click **"CREATE"**

3. **App Information:**
   - **App name:** `TsvWeb`
   - **User support email:** `hello@tsvweb.com` or your email
   - **App logo:** (Optional) Upload TsvWeb logo

4. **App Domain:**
   - **Application home page:** `https://tsvweb.co.uk`
   - **Application privacy policy:** `https://tsvweb.co.uk/privacy-policy`
   - **Application terms of service:** `https://tsvweb.co.uk/terms-of-service`

5. **Authorized Domains:**
   - Click **"ADD DOMAIN"**
   - Enter: `tsvweb.co.uk`
   - Click **"ADD DOMAIN"** again
   - Enter: `vercel.app` (if using Vercel preview URLs)

6. **Developer Contact Information:**
   - Email: `kristiyan@tsvweb.com`

7. Click **"SAVE AND CONTINUE"**

8. **Scopes:**
   - Click **"ADD OR REMOVE SCOPES"**
   - Select these scopes:
     - `userinfo.email` - See your email address
     - `userinfo.profile` - See your personal info
   - Click **"UPDATE"**
   - Click **"SAVE AND CONTINUE"**

9. **Test Users (Optional):**
   - Add test emails if app is in testing mode:
     - `kristiyan@tsvweb.com`
     - `tsvetozarkt@gmail.com`
   - Click **"SAVE AND CONTINUE"**

10. **Summary:**
    - Review settings
    - Click **"BACK TO DASHBOARD"**

---

### Step 5: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**

2. Click **"+ CREATE CREDENTIALS"** at top

3. Select **"OAuth client ID"**

4. **Application type:**
   - Select **"Web application"**

5. **Name:**
   - Enter: `TsvWeb Production` or `TsvWeb UK`

6. **Authorized JavaScript origins:**
   - Click **"+ ADD URI"**
   - Enter: `https://tsvweb.co.uk`
   - Click **"+ ADD URI"** again
   - Enter: `http://localhost:3000` (for local development)

7. **Authorized redirect URIs:**
   - Click **"+ ADD URI"**
   - Enter: `https://tsvweb.co.uk/api/auth/callback/google`
   - Click **"+ ADD URI"** again
   - Enter: `http://localhost:3000/api/auth/callback/google` (for local dev)

8. Click **"CREATE"**

9. **Save Your Credentials:**
   - A popup will show your credentials
   - **Client ID:** Copy this (looks like: `123456789-abc123.apps.googleusercontent.com`)
   - **Client Secret:** Copy this (looks like: `GOCSPX-abc123xyz`)
   - Click **"OK"**

---

### Step 6: Update Environment Variables

#### For Vercel (Production):

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your `tsvweb-co-uk` project
3. Go to **Settings** → **Environment Variables**
4. Add/Update these variables:

```env
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
NEXTAUTH_URL=https://tsvweb.co.uk
NEXTAUTH_SECRET=your_existing_secret_or_generate_new_one
```

5. Click **"Save"**
6. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**

#### For Local Development:

1. Open your `.env.local` file
2. Update these variables:

```env
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_min_32_characters
```

3. Restart your development server:
```bash
npm run dev
```

---

### Step 7: Generate NEXTAUTH_SECRET (If Needed)

If you don't have a `NEXTAUTH_SECRET`, generate one:

**Option A: Using OpenSSL (Recommended)**
```bash
openssl rand -base64 32
```

**Option B: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option C: Online Generator**
- Visit: https://generate-secret.vercel.app/32
- Copy the generated secret

**Important:** Must be at least 32 characters!

---

## ✅ Testing Google OAuth

### Test on Production:

1. Go to: `https://tsvweb.co.uk/customer/login`
2. Click **"Sign in with Google"** button
3. Select your Google account
4. Grant permissions
5. You should be redirected to customer dashboard

### Test Admin Login:

1. Go to: `https://tsvweb.co.uk/admin/login`
2. Click **"Sign in with Google"**
3. Should work if your email is authorized (kristiyan@tsvweb.com or tsvetozarkt@gmail.com)

### Common Issues:

**Error: "redirect_uri_mismatch"**
- **Cause:** Redirect URI not added to Google Console
- **Fix:** Add `https://tsvweb.co.uk/api/auth/callback/google` to Authorized redirect URIs

**Error: "Access blocked: This app's request is invalid"**
- **Cause:** OAuth consent screen not configured
- **Fix:** Complete Step 4 (Configure OAuth Consent Screen)

**Error: "invalid_client"**
- **Cause:** Wrong Client ID or Client Secret
- **Fix:** Double-check environment variables match Google Console

---

## 🔒 Security Best Practices

### 1. Authorized Domains
Only add domains you control:
- ✅ `tsvweb.co.uk`
- ✅ `vercel.app` (if using Vercel)
- ❌ Don't add `tsvweb.com` (old spammed domain)

### 2. Authorized Redirect URIs
Only add exact callback URLs:
- ✅ `https://tsvweb.co.uk/api/auth/callback/google`
- ✅ `http://localhost:3000/api/auth/callback/google` (dev only)
- ❌ Don't use wildcards

### 3. Client Secret
- Never commit to Git
- Store only in environment variables
- Rotate if exposed

### 4. OAuth Consent Screen
- Use real privacy policy URL
- Use real terms of service URL
- Keep app information accurate

---

## 📊 Publishing Your App (Optional)

### Testing Mode vs Production Mode

**Testing Mode (Default):**
- Limited to 100 users
- Shows "unverified app" warning
- Good for initial testing

**Production Mode:**
- Unlimited users
- No warning screen
- Requires Google verification

### To Publish (Optional):

1. Go to **OAuth consent screen**
2. Click **"PUBLISH APP"**
3. Click **"CONFIRM"**

**Note:** For internal use, testing mode is fine. Only publish if you need public Google sign-in.

---

## 🔄 Updating from Old Domain

### If You Had OAuth on tsvweb.com:

**Option A: Update Existing Credentials (Recommended)**
1. Go to existing OAuth client in Google Console
2. **Add** new URIs (don't remove old ones yet):
   - Add: `https://tsvweb.co.uk`
   - Add: `https://tsvweb.co.uk/api/auth/callback/google`
3. Keep old URIs active for transition period
4. After 1-2 weeks, remove old tsvweb.com URIs

**Option B: Create New Credentials (Fresh Start)**
1. Create new OAuth client (follow Step 5)
2. Use new Client ID and Secret
3. Leave old credentials active (won't hurt)

---

## 🎯 Quick Reference

### Required Environment Variables:
```env
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz
NEXTAUTH_URL=https://tsvweb.co.uk
NEXTAUTH_SECRET=your_32_char_secret
```

### Required Redirect URIs:
```
https://tsvweb.co.uk/api/auth/callback/google
http://localhost:3000/api/auth/callback/google (dev only)
```

### Required Authorized Origins:
```
https://tsvweb.co.uk
http://localhost:3000 (dev only)
```

### Required Scopes:
```
userinfo.email
userinfo.profile
```

---

## 🐛 Troubleshooting

### Issue: "Error 400: redirect_uri_mismatch"

**Solution:**
1. Check redirect URI in Google Console matches exactly
2. Must be: `https://tsvweb.co.uk/api/auth/callback/google`
3. No trailing slash
4. Must include `/api/auth/callback/google` path

### Issue: "Access blocked: This app's request is invalid"

**Solution:**
1. Complete OAuth consent screen setup
2. Add authorized domain: `tsvweb.co.uk`
3. Add privacy policy and terms URLs

### Issue: "invalid_client"

**Solution:**
1. Verify `GOOGLE_CLIENT_ID` in environment variables
2. Verify `GOOGLE_CLIENT_SECRET` in environment variables
3. Ensure no extra spaces or quotes
4. Redeploy after updating

### Issue: Sign in works but redirects to wrong page

**Solution:**
1. Check `NEXTAUTH_URL` is set to `https://tsvweb.co.uk`
2. No trailing slash on NEXTAUTH_URL
3. Redeploy after updating

---

## ✅ Final Checklist

Before going live:
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] Authorized domain added: `tsvweb.co.uk`
- [ ] OAuth client created
- [ ] Redirect URI added: `https://tsvweb.co.uk/api/auth/callback/google`
- [ ] JavaScript origin added: `https://tsvweb.co.uk`
- [ ] `GOOGLE_CLIENT_ID` set in Vercel
- [ ] `GOOGLE_CLIENT_SECRET` set in Vercel
- [ ] `NEXTAUTH_URL` set to `https://tsvweb.co.uk`
- [ ] `NEXTAUTH_SECRET` set (32+ characters)
- [ ] Application redeployed
- [ ] Tested Google sign-in on production
- [ ] Tested admin login with authorized email

---

## 📞 Support Resources

- **Google Cloud Console:** https://console.cloud.google.com
- **NextAuth.js Docs:** https://next-auth.js.org/providers/google
- **OAuth 2.0 Playground:** https://developers.google.com/oauthplayground

---

**Setup Time:** 10-15 minutes
**Difficulty:** Easy
**Status:** Required for Google sign-in to work on tsvweb.co.uk

Good luck! 🚀
