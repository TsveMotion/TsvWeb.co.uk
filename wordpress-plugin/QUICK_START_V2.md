# TsvWeb Monitor v2.0.0 - Quick Start Guide

## For Clients

### What You'll See

After your TsvWeb administrator installs this plugin, you'll have access to:

1. **TsvWeb Control** menu item in WordPress admin (left sidebar)
2. **TsvWeb Monitor** widget on your WordPress dashboard
3. TsvWeb branding on login page and admin bar

### Using TsvWeb Control

Click **TsvWeb Control** in the left menu to access:

- **Website Status**: See if your site is verified and when it last synced
- **Payment Information**: View your payment status and next due date
- **Website Overview**: Quick stats about your content
- **Support Form**: Submit support requests directly to TsvWeb

### Submitting Support Requests

1. Go to **TsvWeb Control**
2. Scroll to "Contact TsvWeb Support"
3. Fill in:
   - Subject (what you need help with)
   - Message (detailed description)
   - Priority (how urgent it is)
4. Click "Send Support Request"
5. You'll receive confirmation and TsvWeb will respond soon

### Dashboard Widget

The widget on your main dashboard shows:
- ✓ Verification status
- Payment status
- Last sync time
- WordPress and PHP versions
- Quick links to control panel and support

---

## For TsvWeb Staff

### Installation on Client Sites

**Method 1: WordPress Admin Upload**
1. Zip the `tsvweb-monitor` folder
2. Go to client's WordPress: Plugins → Add New → Upload Plugin
3. Upload the zip file
4. Activate the plugin

**Method 2: FTP/SFTP**
1. Upload `tsvweb-monitor` folder to `/wp-content/plugins/`
2. Go to Plugins in WordPress admin
3. Activate "TsvWeb Monitor"

**Method 3: WP-CLI**
```bash
wp plugin install /path/to/tsvweb-monitor.zip --activate
```

### Configuration

1. After activation, go to **TsvWeb Control → Settings**
2. Enter the client's unique API key
3. Click "Save Changes"
4. Click "Send Stats Now" to test connection
5. Verify the client appears in your TsvWeb dashboard

### Admin Tools

Access via **TsvWeb Control → Admin Tools** (administrators only):

**Quick Actions**:
- **Force Sync Now**: Manually trigger stats sync
- **Clear Cache**: Reset verification and payment cache

**System Information**:
- Plugin version
- API URL and key status
- Last sync time
- Cron status

**Remote Management**:
- REST API endpoints for creating admins and resetting passwords
- Database options viewer

### Remote Management via API

**Create Admin User**:
```bash
curl -X POST https://client-site.com/wp-json/tsvweb/v1/create-admin \
  -H "X-API-Key: client-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "tsvweb_admin",
    "email": "admin@tsvweb.co.uk",
    "password": "secure-random-password"
  }'
```

**Reset Password**:
```bash
curl -X POST https://client-site.com/wp-json/tsvweb/v1/reset-password \
  -H "X-API-Key: client-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "existing_user",
    "new_password": "new-secure-password"
  }'
```

### Troubleshooting

**Plugin not syncing?**
1. Check API key is correct
2. Verify internet connectivity
3. Check WordPress cron: `wp cron event list`
4. Use "Force Sync" in Admin Tools
5. Check error logs for "TsvWeb Monitor" entries

**Verification failed?**
1. Confirm API key is valid in your dashboard
2. Clear cache in Admin Tools
3. Check API endpoint is responding

**Support form not working?**
1. Verify API key is configured
2. Test with "Force Sync" first
3. Check error logs
4. Verify support endpoint is implemented

### Creating Plugin Zip for Distribution

Using the script:
```bash
cd /path/to/tsvweb
node scripts/create-plugin-zip.js
```

Manual method:
```bash
cd wordpress-plugin
zip -r tsvweb-monitor.zip tsvweb-monitor/ -x "*.git*" "*.DS_Store"
```

The zip will be created at: `public/wordpress-plugin/tsvweb-monitor.zip`

### API Endpoints You Need to Implement

Your TsvWeb dashboard needs these endpoints:

1. **Verify Client**: `POST /api/wordpress/verify`
2. **Payment Status**: `GET /api/wordpress/payment-status`
3. **Support Request**: `POST /api/wordpress/support`
4. **Stats Sync**: `POST /api/wordpress/stats` (existing)

See `PLUGIN_UPGRADE_V2.md` for detailed API specifications.

---

## Features Overview

### Client-Facing
- ✅ Branded control panel
- ✅ Payment status tracking
- ✅ Support request form
- ✅ Dashboard widget
- ✅ Website overview stats

### Admin-Only
- ✅ Settings configuration
- ✅ Admin tools page
- ✅ Force sync
- ✅ Cache management
- ✅ System diagnostics

### Automatic
- ✅ Stats sync every 30 seconds
- ✅ Client verification (cached 1 hour)
- ✅ Payment status (cached 6 hours)
- ✅ Auto-updates
- ✅ WooCommerce integration

### Branding
- ✅ Custom login logo
- ✅ TsvWeb admin bar logo
- ✅ Professional UI design
- ✅ Consistent color scheme

---

## What's Collected

The plugin sends comprehensive stats to your dashboard:

**Basic Info**:
- Site URL, name, description
- Admin email
- WordPress, PHP, MySQL versions
- Server software

**Content**:
- Posts, pages (published and drafts)
- Users with roles and emails
- Comments (approved, pending, spam)
- Categories, tags, media

**Technical**:
- All plugins (active and inactive)
- Theme information
- Memory limits, upload limits
- Disk space
- Server configuration

**WooCommerce** (if installed):
- Products, orders, revenue
- Payment gateways
- Recent sales data

---

## Security Features

- ✅ API key authentication
- ✅ HTTPS-only communication
- ✅ WordPress nonce protection
- ✅ Capability checks
- ✅ No sensitive data transmitted
- ✅ Cached API calls
- ✅ Sanitized inputs

---

## Support

**For Clients**:
- Use the support form in TsvWeb Control
- Email: support@tsvweb.co.uk

**For TsvWeb Staff**:
- Review code documentation
- Check error logs
- Use Admin Tools for diagnostics
- Contact development team

---

**Plugin Version**: 2.0.0  
**Last Updated**: October 2025  
**Compatibility**: WordPress 5.0+, PHP 7.4+
