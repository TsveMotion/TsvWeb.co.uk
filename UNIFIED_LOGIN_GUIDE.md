# Unified Login System - Customer & Admin Portal

## Overview
The customer login page (`/customer/login`) now supports **both customers AND admins**, with Google OAuth integration for seamless authentication.

## Features

### 1. **Dual Login Support**
- **Customers**: Use username/password to access customer dashboard
- **Admins**: Use email/password to access admin dashboard
- System automatically detects user type and redirects appropriately

### 2. **Google OAuth Integration**
- **For Customers**: Link Google account to existing customer account
- **For Admins**: Sign in with authorized Google emails
- One-click sign-in with Google button

### 3. **Smart Routing**
- Customer login → `/customer/dashboard`
- Admin login → `/admin/dashboard`
- Google OAuth → Redirects based on user role in database

## How It Works

### Customer Login Flow:
1. User enters **username** and password
2. System checks customer database first
3. If found → Redirect to customer dashboard ✅
4. If not found → Try admin authentication
5. If admin → Redirect to admin dashboard ✅
6. If neither → Show error ❌

### Admin Login Flow:
1. Admin enters **email** and password
2. System tries customer login first (will fail)
3. Then tries admin authentication via NextAuth
4. If successful → Redirect to admin dashboard ✅

### Google OAuth Flow:
1. User clicks "Sign in with Google"
2. Google popup appears
3. User selects account
4. System checks database for existing user:
   - **If customer exists**: Links Google account + redirects to customer dashboard
   - **If admin email authorized**: Redirects to admin dashboard
   - **If new customer**: Creates account + redirects to customer dashboard

## Account Linking

### For Existing Customers:
When a customer signs in with Google for the first time:
1. System finds customer by email in database
2. Links Google ID to customer account
3. Saves Google email for future logins
4. Customer can now use either:
   - Username/password (original method)
   - Google sign-in (new method)

### Database Updates:
```javascript
// Customer model gets updated with:
{
  googleId: "google-oauth-id-here",
  googleEmail: "customer@gmail.com"
}
```

## Configuration

### Environment Variables Required:
```env
# Google OAuth (already configured)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000  # or https://tsvweb.com
```

### Authorized Admin Emails:
Located in: `src/app/api/auth/[...nextauth]/route.ts`
```javascript
const authorizedEmails = [
  'kristiyan@tsvweb.com',
  'tsvetozarkt@gmail.com',
];
```

## User Experience

### Login Page UI:
```
┌─────────────────────────────────────┐
│     Customer & Admin Portal         │
│   Sign in to access your dashboard  │
├─────────────────────────────────────┤
│  Username: [____________]           │
│  Password: [____________] 👁️        │
│  [Sign in]                          │
├─────────────────────────────────────┤
│       Or continue with              │
│  [🔵 Sign in with Google]           │
├─────────────────────────────────────┤
│       New customer?                 │
│  [Contact us to get started]        │
│  [Start Project Wizard]             │
└─────────────────────────────────────┘
```

## Benefits

### For Customers:
- ✅ One login page for everything
- ✅ Option to link Google account
- ✅ Faster login with Google OAuth
- ✅ No need to remember passwords
- ✅ Secure authentication

### For Admins:
- ✅ Can use customer login page
- ✅ No need to remember separate URL
- ✅ Google OAuth support
- ✅ Automatic role detection
- ✅ Seamless experience

### For Business:
- ✅ Simplified user experience
- ✅ Reduced support requests
- ✅ Modern authentication
- ✅ Better security
- ✅ Professional appearance

## Security Features

1. **Password Protection**: All passwords hashed with bcrypt
2. **Secure Cookies**: HttpOnly, SameSite=lax, Secure in production
3. **90-Day Sessions**: Long-lasting but secure
4. **OAuth 2.0**: Industry-standard Google authentication
5. **Role-Based Access**: Automatic detection and routing
6. **Account Linking**: Secure Google ID association

## Testing

### Test Customer Login:
1. Go to `/customer/login`
2. Enter customer username and password
3. Should redirect to `/customer/dashboard`

### Test Admin Login:
1. Go to `/customer/login`
2. Enter admin email and password
3. Should redirect to `/admin/dashboard`

### Test Google OAuth:
1. Go to `/customer/login`
2. Click "Sign in with Google"
3. Select Google account
4. Should redirect based on role:
   - Customer → `/customer/dashboard`
   - Admin → `/admin/dashboard`

## Files Modified

1. **`src/app/customer/login/page.tsx`**
   - Added NextAuth integration
   - Added Google OAuth button
   - Added dual authentication logic
   - Added smart routing

2. **`src/app/api/auth/[...nextauth]/route.ts`**
   - Updated redirect logic
   - Enhanced account linking
   - Improved role detection

## Future Enhancements

- [ ] Add "Link Google Account" button in customer dashboard
- [ ] Show which login method is active (password vs Google)
- [ ] Add option to unlink Google account
- [ ] Add email verification for new Google sign-ups
- [ ] Add 2FA support for admin accounts

## Support

For issues or questions:
- Check console logs for authentication errors
- Verify environment variables are set
- Ensure Google OAuth credentials are valid
- Test with both customer and admin accounts
