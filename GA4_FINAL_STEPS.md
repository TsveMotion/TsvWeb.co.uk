# Google Analytics 4 - Final Setup Steps

Your service account is configured! Just 2 more steps to get real data:

## ✅ Already Done:
- ✅ Created Google Cloud project "tsvweb-analytics"
- ✅ Downloaded service account JSON file
- ✅ Added credentials to `.env.local`
- ✅ API route implemented and ready

## 🔧 Step 1: Add Service Account to GA4

1. **Copy this email address:**
   ```
   tsvweb-analytics@tsvweb-analytics.iam.gserviceaccount.com
   ```

2. **Go to Google Analytics:**
   - Visit: https://analytics.google.com/
   - Select your TsvWeb property

3. **Add the service account:**
   - Click **Admin** (gear icon, bottom left)
   - Under "Property", click **Property Access Management**
   - Click the **"+"** button
   - Click **"Add users"**
   - Paste the email: `tsvweb-analytics@tsvweb-analytics.iam.gserviceaccount.com`
   - Select **"Viewer"** role
   - **Uncheck** "Notify new users by email"
   - Click **"Add"**

## 🔧 Step 2: Get Your Property ID

1. In Google Analytics, click **Admin** (gear icon)
2. Under "Property", click **Property Settings**
3. Copy your **Property ID** (looks like: `123456789` or `properties/123456789`)

4. **Update `.env.local`:**
   ```env
   GOOGLE_ANALYTICS_PROPERTY_ID=properties/YOUR_PROPERTY_ID_HERE
   ```
   Replace `YOUR_PROPERTY_ID_HERE` with your actual property ID

## 🚀 Step 3: Restart & Test

1. **Restart your dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Check the dashboard:**
   - Go to: http://localhost:3000/admin/dashboard
   - Scroll to "Google Analytics (Last 30 Days)" section
   - You should see real data!

## 🔍 Troubleshooting

### If you see zeros:
- Check that service account email was added to GA4 with "Viewer" role
- Verify Property ID is correct in `.env.local`
- Make sure you restarted the dev server
- Check browser console for error messages

### If you get "403 Forbidden":
- Service account doesn't have access to GA4 property
- Go back to Step 1 and add the service account email

### If you get "404 Not Found":
- Property ID is incorrect
- Make sure it's in format: `properties/123456789`
- Or just the numbers: `123456789`

## 📊 What Data You'll See

The dashboard will show:
- **Page Views** - Total page views in last 30 days
- **Users** - Unique visitors
- **Sessions** - Total sessions
- **Bounce Rate** - Percentage (0-100%)
- **Avg. Duration** - Average session time in seconds

## 🔐 Security Notes

- ✅ Service account JSON file is NOT in Git (it's in Downloads folder)
- ✅ `.env.local` is in `.gitignore`
- ✅ Service account has minimum "Viewer" permissions
- ⚠️ **Never commit** the JSON file or private key to Git!

## 📝 Current Configuration

**Service Account Email:**
```
tsvweb-analytics@tsvweb-analytics.iam.gserviceaccount.com
```

**Project ID:**
```
tsvweb-analytics
```

**What's Configured:**
- ✅ Client Email
- ✅ Private Key
- ⏳ Property ID (needs your GA4 property ID)

---

**Need Help?** 
- Check the full guide: `GOOGLE_ANALYTICS_SETUP.md`
- Look at browser console for detailed errors
- Check server terminal for API errors
