# TsvWeb WordPress Monitor - Installation Guide

## Quick Start Guide

### Step 1: Prepare the Plugin

1. Navigate to: `c:\Users\tsvet\Documents\tsvweb\tsvweb\wordpress-plugin\`
2. Zip the `tsvweb-monitor` folder (right-click → Send to → Compressed folder)
3. You should have: `tsvweb-monitor.zip`

### Step 2: Install on WordPress Site

1. Log in to your WordPress admin panel
2. Go to **Plugins → Add New → Upload Plugin**
3. Click **Choose File** and select `tsvweb-monitor.zip`
4. Click **Install Now**
5. Click **Activate Plugin**

### Step 3: Configure the Plugin

1. Go to **Settings → TsvWeb Monitor**
2. Enter your API Key (see below how to generate)
3. Click **Save Changes**
4. Click **Send Stats Now** to test the connection

### Step 4: Generate API Key (For Testing)

For now, use any string longer than 10 characters as your API key. Example:
```
test-api-key-12345
```

**Note:** In production, you should implement proper API key generation and validation in your TsvWeb dashboard.

### Step 5: Update API URL (Important!)

Before deploying to production, edit `tsvweb-monitor.php` line 17:

```php
// Change from:
private $api_url = 'http://localhost:3000/api/wordpress/stats';

// To your production URL:
private $api_url = 'https://yourdomain.com/api/wordpress/stats';
```

## Viewing Data in TsvWeb Dashboard

1. Start your Next.js development server:
   ```bash
   cd c:\Users\tsvet\Documents\tsvweb\tsvweb
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/admin/wordpress-sites`

3. You should see all connected WordPress sites with their stats!

## Testing the Integration

### Test 1: Manual Sync
1. In WordPress: Settings → TsvWeb Monitor
2. Click **Send Stats Now**
3. You should see "Stats sent successfully!"
4. Check your TsvWeb dashboard to see the data

### Test 2: Automatic Sync
- Stats are automatically sent once per day
- You can test this by waiting or manually triggering WordPress cron

### Test 3: View Stats Preview
- In WordPress: Settings → TsvWeb Monitor
- Scroll down to see "Current Stats Preview"
- This shows what data will be sent

## Troubleshooting

### Plugin Not Sending Data?

1. **Check API Key**: Make sure it's entered correctly
2. **Check API URL**: Verify the URL is correct and accessible
3. **Check WordPress Logs**: Look for errors in WordPress debug log
4. **Check Network**: Use browser dev tools to see if request is being sent

### Data Not Showing in Dashboard?

1. **Check Database**: Make sure MongoDB is running
2. **Check API Response**: Look at browser console for errors
3. **Refresh Dashboard**: Sometimes you need to refresh the page

### Common Issues

**Issue:** "Failed to send stats"
- **Solution:** Check that your Next.js server is running and the API URL is correct

**Issue:** "Invalid API key"
- **Solution:** Make sure the API key is at least 10 characters long

**Issue:** Data is old
- **Solution:** Click "Send Stats Now" to manually update

## What Data is Collected?

The plugin collects:
- ✅ WordPress version
- ✅ PHP version
- ✅ MySQL version
- ✅ Number of posts, pages, users
- ✅ Number of active plugins
- ✅ Active theme name and version
- ✅ Site health status
- ✅ Memory limit
- ✅ Max upload size

**Not collected:**
- ❌ User passwords
- ❌ Post content
- ❌ Personal data
- ❌ Database credentials

## Next Steps

### For Production:

1. **Implement Proper API Keys**:
   - Create API key generation in your dashboard
   - Store keys securely in database
   - Validate keys on each request

2. **Add More Metrics**:
   - Plugin updates available
   - Security issues
   - Performance metrics
   - Uptime monitoring

3. **Add Notifications**:
   - Email alerts for issues
   - Dashboard notifications
   - Slack/Discord integration

4. **Improve Security**:
   - Use HTTPS only
   - Rate limiting
   - IP whitelisting
   - Encrypted data transmission

## Support

For issues or questions:
- Email: support@tsvweb.com
- Documentation: https://tsvweb.com/docs

## File Structure

```
wordpress-plugin/
├── tsvweb-monitor/
│   ├── tsvweb-monitor.php (Main plugin file)
│   └── README.md (Plugin documentation)
├── INSTALLATION_GUIDE.md (This file)
└── tsvweb-monitor.zip (Zipped plugin for installation)
```

## Changelog

### Version 1.0.0 (Initial Release)
- Basic stats collection
- Daily automatic sync
- Manual sync option
- Admin settings page
- Stats preview
