# Google Analytics API Setup Guide

This guide will help you integrate Google Analytics 4 (GA4) with your TsvWeb admin dashboard.

## Prerequisites
- Google Analytics 4 property set up for your website
- Google Cloud Platform account
- Admin access to your GA4 property

## Step-by-Step Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "TsvWeb Analytics" and click "Create"

### 2. Enable Google Analytics Data API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Analytics Data API"
3. Click on it and press "Enable"

### 3. Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in details:
   - **Name**: `tsvweb-analytics`
   - **Description**: `Service account for TsvWeb dashboard analytics`
4. Click "Create and Continue"
5. Skip optional steps and click "Done"

### 4. Generate Service Account Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Click "Create" - a JSON file will download
6. **Keep this file secure!** Never commit it to Git

### 5. Add Service Account to Google Analytics

1. Open the downloaded JSON file
2. Copy the `client_email` value (looks like: `tsvweb-analytics@project-id.iam.gserviceaccount.com`)
3. Go to [Google Analytics](https://analytics.google.com/)
4. Select your property
5. Click "Admin" (gear icon in bottom left)
6. Under "Property", click "Property Access Management"
7. Click "+" button → "Add users"
8. Paste the service account email
9. Select "Viewer" role
10. Uncheck "Notify new users by email"
11. Click "Add"

### 6. Get Your Property ID

1. In Google Analytics, go to "Admin"
2. Under "Property", click "Property Settings"
3. Copy your **Property ID** (format: `properties/123456789`)

### 7. Configure Environment Variables

Add these to your `.env.local` file:

```env
# Google Analytics Configuration
GOOGLE_ANALYTICS_PROPERTY_ID=properties/YOUR_PROPERTY_ID
GOOGLE_ANALYTICS_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_ANALYTICS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- Replace `YOUR_PROPERTY_ID` with your actual property ID (just the numbers)
- Use the `client_email` from your JSON file
- Use the `private_key` from your JSON file (keep the quotes and newlines)

### 8. Install Required Package (Optional - for full implementation)

If you want to implement the full Google Analytics Data API:

```bash
npm install @google-analytics/data
```

### 9. Test the Integration

1. Restart your Next.js development server
2. Go to `/admin/dashboard`
3. Check the "Google Analytics" section
4. If configured correctly, you'll see real data
5. If not configured, you'll see zeros with a message

## API Endpoint

The analytics data is fetched from:
```
GET /api/admin/analytics/google
```

Returns:
```json
{
  "success": true,
  "data": {
    "pageViews": 12543,
    "users": 3421,
    "sessions": 4567,
    "bounceRate": 42.5,
    "avgSessionDuration": 185
  },
  "configured": true
}
```

## Metrics Displayed

- **Page Views**: Total number of page views in last 30 days
- **Users**: Unique users who visited your site
- **Sessions**: Total number of sessions
- **Bounce Rate**: Percentage of single-page sessions
- **Avg. Duration**: Average session duration in seconds

## Troubleshooting

### "Google Analytics not configured" message
- Check that all 3 environment variables are set
- Restart your development server after adding variables

### "Failed to fetch analytics data"
- Verify service account has "Viewer" access in GA4
- Check that Property ID is correct (format: `properties/123456789`)
- Ensure private key is properly formatted with newlines

### No data showing
- Make sure your website has GA4 tracking code installed
- Wait 24-48 hours for data to populate
- Check GA4 dashboard to confirm data is being collected

## Security Best Practices

1. **Never commit** the service account JSON file to Git
2. Add `.env.local` to `.gitignore`
3. Use environment variables for all sensitive data
4. Rotate service account keys periodically
5. Use "Viewer" role only (minimum required permissions)

## Full Implementation (Advanced)

To implement real-time data fetching, update `/api/admin/analytics/google/route.ts`:

```typescript
import { BetaAnalyticsDataClient } from '@google-analytics/data'

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_ANALYTICS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
})

const [response] = await analyticsDataClient.runReport({
  property: process.env.GOOGLE_ANALYTICS_PROPERTY_ID,
  dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
  dimensions: [{ name: 'date' }],
  metrics: [
    { name: 'screenPageViews' },
    { name: 'activeUsers' },
    { name: 'sessions' },
    { name: 'bounceRate' },
    { name: 'averageSessionDuration' }
  ],
})
```

## Resources

- [Google Analytics Data API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Service Account Setup](https://cloud.google.com/iam/docs/creating-managing-service-accounts)
- [GA4 Property Settings](https://support.google.com/analytics/answer/9304153)

---

**Need Help?** Check the console logs for detailed error messages or contact support.
