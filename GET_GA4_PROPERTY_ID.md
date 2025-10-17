# How to Find Your GA4 Property ID

## Quick Steps:

### 1. Go to Google Analytics
Visit: https://analytics.google.com/

### 2. Select Your Property
- Click on the property dropdown (top left)
- Select your TsvWeb property

### 3. Get Property ID
**Option A - From Admin:**
1. Click **Admin** (gear icon, bottom left)
2. Under "Property" column, click **Property Settings**
3. Look for **Property ID** at the top
4. It will look like: `123456789` (just numbers)

**Option B - From URL:**
1. Look at the URL in your browser
2. It will look like: `https://analytics.google.com/analytics/web/#/p123456789/...`
3. The number after `/p` is your Property ID (e.g., `123456789`)

### 4. Update .env.local
Once you have the Property ID (e.g., `123456789`), update your `.env.local`:

```env
GOOGLE_ANALYTICS_PROPERTY_ID=properties/123456789
```

Or just the number:
```env
GOOGLE_ANALYTICS_PROPERTY_ID=123456789
```

### 5. Add Service Account to GA4
**IMPORTANT:** You also need to add the service account email to your GA4 property!

1. In Google Analytics, go to **Admin**
2. Under "Property", click **Property Access Management**
3. Click **"+"** button → **"Add users"**
4. Paste this email:
   ```
   tsvweb-analytics@tsvweb-analytics.iam.gserviceaccount.com
   ```
5. Select **"Viewer"** role
6. **Uncheck** "Notify new users by email"
7. Click **"Add"**

### 6. Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

## Common Property IDs You Might See:

❌ **WRONG - These are NOT Property IDs:**
- `tsvweb-analytics` (This is your Google Cloud project name)
- `102061841740045284050` (This is OAuth Client ID)
- `G-8EWS5EDT81` (This is Measurement ID for gtag.js)

✅ **CORRECT - Property ID looks like:**
- `123456789` (Just numbers, usually 9-10 digits)
- `properties/123456789` (With "properties/" prefix)

## If You Don't Have GA4 Yet:

If you haven't set up Google Analytics 4 for tsvweb.com:

1. Go to https://analytics.google.com/
2. Click **Admin** → **Create Property**
3. Name it "TsvWeb"
4. Set timezone and currency
5. Add website details
6. Get your Property ID from Property Settings

## Current Configuration Status:

✅ Service Account Created
✅ Private Key Configured
✅ Client Email Configured
❌ Property ID - **NEEDS YOUR GA4 PROPERTY ID**
❌ Service Account Access - **NEEDS TO BE ADDED TO GA4**

---

**Once you complete steps 4, 5, and 6, the dashboard will show real GA4 data!**
