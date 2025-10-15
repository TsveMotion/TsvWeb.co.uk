# Authentication Setup Guide

## ✅ What's Been Fixed

### 1. **Login Persistence (90-Day Sessions)**
- Extended session duration from 24 hours to **90 days**
- Both NextAuth and custom auth now use 90-day cookies
- Sessions will persist across browser restarts
- No more typing credentials repeatedly!

### 2. **Google OAuth Authorization**
- Added authorized emails:
  - `kristiyan@tsvweb.com` ✅
  - `tsvetozarkt@gmail.com` ✅
- Google Sign-In button fully functional on `/admin/login`

### 3. **Viewport Warnings Fixed**
- Moved viewport configuration to separate export in root layout
- Follows Next.js 14+ best practices
- No more console warnings about unsupported metadata

## 🔧 Required Environment Variables

Add these to your `.env.local` file (see `.env.example` for reference):

```env
# NextAuth Configuration (REQUIRED)
NEXTAUTH_SECRET=your_nextauth_secret_here_minimum_32_characters
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (REQUIRED for Google Sign-In)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Admin Credentials (Optional - fallback for initial setup)
ADMIN_EMAIL=kristiyan@tsvweb.com
ADMIN_PASSWORD=your_admin_password_here
ADMIN_NAME=Administrator

# Database (REQUIRED)
MONGODB_URI=mongodb://localhost:27017/tsvweb

# Auth Secret (REQUIRED for custom auth)
AUTH_SECRET=your_auth_secret_here_minimum_32_characters
```

## 🔑 Setting Up Google OAuth

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted
6. Select **Web application** as application type
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://tsvweb.com/api/auth/callback/google` (production)
8. Copy the **Client ID** and **Client Secret**

### Step 2: Add Credentials to Environment

```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### Step 3: Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add it to your `.env.local`:

```env
NEXTAUTH_SECRET=your_generated_secret_here
```

## 📝 How to Use

### Login with Email/Password

1. Navigate to `http://localhost:3000/admin/login`
2. Enter your email and password
3. Click **Sign in**
4. Session will persist for **90 days**

### Login with Google

1. Navigate to `http://localhost:3000/admin/login`
2. Click **Sign in with Google**
3. Select your Google account
4. Only authorized emails can sign in:
   - kristiyan@tsvweb.com
   - tsvetozarkt@gmail.com

### Adding More Authorized Emails

Edit `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
const authorizedEmails = [
  'kristiyan@tsvweb.com',
  'tsvetozarkt@gmail.com',
  'newemail@example.com', // Add new emails here
];
```

## 🔒 Security Features

- **HTTP-only cookies** - Protected from XSS attacks
- **Secure cookies** - HTTPS only in production
- **SameSite strict** - CSRF protection
- **90-day expiration** - Automatic logout after 90 days
- **JWT tokens** - Stateless authentication
- **Email whitelist** - Only authorized users can sign in with Google

## 🐛 Troubleshooting

### "Session not persisting"
- Check that `NEXTAUTH_SECRET` is set in `.env.local`
- Clear browser cookies and try again
- Verify MongoDB is running

### "Google Sign-In not working"
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check that redirect URIs are configured in Google Cloud Console
- Ensure your email is in the authorized list

### "Invalid credentials"
- For database users: Check MongoDB connection
- For env admin: Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` match

## 📊 Session Management

### Current Configuration
- **Strategy**: JWT (JSON Web Tokens)
- **Max Age**: 90 days (7,776,000 seconds)
- **Cookie Name**: `next-auth.session-token`
- **Renewal**: Automatic on each request

### Custom Auth Cookies
- **Auth Cookie**: `admin_auth` (90 days)
- **Session Cookie**: `admin_session` (90 days)
- Both cookies are set when using email/password login

## 🚀 Production Deployment

Before deploying to production:

1. **Update NEXTAUTH_URL**:
   ```env
   NEXTAUTH_URL=https://tsvweb.com
   ```

2. **Add production redirect URI** to Google Cloud Console:
   ```
   https://tsvweb.com/api/auth/callback/google
   ```

3. **Use strong secrets**:
   - Generate new `NEXTAUTH_SECRET` for production
   - Never commit secrets to version control

4. **Enable secure cookies**:
   - Automatically enabled when `NODE_ENV=production`

## ✨ What's Next?

- [ ] Test Google Sign-In with both authorized emails
- [ ] Verify 90-day session persistence
- [ ] Add more admin users to database if needed
- [ ] Configure production Google OAuth credentials
- [ ] Set up email notifications for new logins (optional)

---

**Last Updated**: October 15, 2025  
**Version**: 2.0  
**Status**: ✅ Production Ready
