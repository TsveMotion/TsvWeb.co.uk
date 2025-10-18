# TsvWeb Monitor - WordPress Plugin

Complete monitoring and management solution for TsvWeb-managed WordPress sites. Version 2.0.0 includes client verification, branded control panel, payment tracking, support portal, and remote management tools.

## Features

### 🔐 Client Verification
- **API Key Authentication**: Verify sites are official TsvWeb-managed clients
- **Automatic Verification**: Checks client status with TsvWeb API
- **Client Information Display**: Shows client name and service plan

### 📊 TsvWeb Control Panel
- **Branded Admin Page**: Dedicated "TsvWeb Control" menu item for all users
- **Website Status Overview**: Real-time verification and sync status
- **Payment Status Tracking**: Shows payment status, next due date, and amount
- **Website Statistics**: Quick overview of posts, pages, users, and comments
- **Support Request Form**: Built-in support ticket submission to TsvWeb dashboard

### 📈 Dashboard Widget
- **Quick Status View**: Verification, payment, and sync status at a glance
- **Version Information**: WordPress and PHP versions
- **Payment Reminders**: Alerts for overdue payments
- **Quick Actions**: Direct links to TsvWeb Control and support email

### 🛠️ Admin Tools (TsvWeb Staff Only)
- **Force Sync**: Manually trigger stats sync
- **Clear Cache**: Reset verification and payment cache
- **System Information**: Plugin version, API status, cron status
- **Remote Management Endpoints**: REST API for creating admins and resetting passwords
- **Debug Information**: Database options and error log guidance

### 📡 Comprehensive Stats Tracking
- WordPress & PHP versions
- MySQL version & server software
- Posts, pages, users, comments (with drafts and pending)
- Categories, tags, media library
- All plugins (active and inactive)
- Theme information
- WooCommerce data (if installed): products, orders, revenue, payment gateways
- Server resources: memory limit, upload limits, disk space
- Complete user list with roles and emails

## Installation

### Method 1: Upload via WordPress Admin

1. Download the `tsvweb-monitor` folder
2. Zip the folder
3. Go to WordPress Admin → Plugins → Add New → Upload Plugin
4. Upload the zip file
5. Activate the plugin

### Method 2: Manual Installation

1. Upload the `tsvweb-monitor` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to Settings → TsvWeb Monitor to configure

## Configuration

### Initial Setup
1. After activation, go to **TsvWeb Control → Settings**
2. Enter your **API Key** (provided by TsvWeb)
3. Click **Save Changes**
4. The plugin will automatically verify your client status

### Getting Your API Key
Contact TsvWeb support to receive your unique API key:
- Email: support@tsvweb.co.uk
- Website: https://tsvweb.co.uk

## User Guide

### For Clients
1. **TsvWeb Control**: Main dashboard showing website status, payment info, and support form
2. **Dashboard Widget**: Quick status overview on WordPress dashboard
3. **Support Requests**: Submit support tickets directly from WordPress admin

### For TsvWeb Staff (Administrators)
1. **Settings**: Configure API key and view sync status
2. **Admin Tools**: Force sync, clear cache, view system information
3. **Remote Management**: Use REST API endpoints for remote administration

## REST API Endpoints

All endpoints require API key authentication via `X-API-Key` header or `api_key` parameter.

### Create Admin User
```
POST /wp-json/tsvweb/v1/create-admin
Content-Type: application/json
X-API-Key: your-api-key

{
  "username": "newadmin",
  "email": "admin@example.com",
  "password": "secure-password"
}
```

### Reset Password
```
POST /wp-json/tsvweb/v1/reset-password
Content-Type: application/json
X-API-Key: your-api-key

{
  "username": "existinguser",
  "new_password": "new-secure-password"
}
```

## How It Works

### Automatic Monitoring
- Stats sync every 30 seconds via WordPress cron
- Client verification cached for 1 hour
- Payment status cached for 6 hours
- All data sent securely via HTTPS

### Data Collection
The plugin collects comprehensive site statistics including:
- Site configuration and versions
- Content counts (posts, pages, media)
- User information and roles
- Plugin and theme details
- WooCommerce data (if applicable)
- Server resources and limits

### Branding
- Replaces WordPress logo with TsvWeb branding
- Custom login page logo
- Branded admin bar
- Professional client-facing interface

## Privacy & Security

- **Secure Authentication**: API key-based authentication for all requests
- **HTTPS Only**: All API communications use secure HTTPS
- **No Sensitive Data**: Passwords and payment details are never transmitted
- **Cached Verification**: Reduces API calls and improves performance
- **Nonce Protection**: All forms use WordPress nonces for CSRF protection
- **Capability Checks**: Admin tools restricted to administrators only

## Troubleshooting

### Plugin Not Syncing
1. Check API key is configured correctly
2. Verify cron is running: `wp cron event list`
3. Check error logs for "TsvWeb Monitor" entries
4. Use "Force Sync" in Admin Tools

### Verification Failed
1. Confirm API key is valid
2. Clear cache in Admin Tools
3. Contact TsvWeb support

### Support Form Not Working
1. Verify API key is configured
2. Check internet connectivity
3. Try again or email support@tsvweb.co.uk directly

## Support

- **Email**: support@tsvweb.co.uk
- **Website**: https://tsvweb.co.uk
- **In-Plugin Support**: Use the support form in TsvWeb Control panel

## Changelog

### 2.0.0 (Current)
- **NEW**: Client verification system with API authentication
- **NEW**: TsvWeb Control panel with branded interface
- **NEW**: Payment status tracking and reminders
- **NEW**: Support request form integrated into WordPress
- **NEW**: Dashboard widget with quick status overview
- **NEW**: Admin Tools page for TsvWeb staff
- **NEW**: REST API endpoints for remote management
- **IMPROVED**: Updated to tsvweb.co.uk domain
- **IMPROVED**: Enhanced branding throughout WordPress admin
- **IMPROVED**: Comprehensive stats collection including WooCommerce
- **IMPROVED**: Better caching for API calls
- **IMPROVED**: Modern, professional UI design

### 1.3.0
- Added WooCommerce support
- Enhanced stats collection
- 30-second sync interval
- REST API for remote management

### 1.0.0
- Initial release
- Basic stats collection
- Daily automatic sync
- Manual sync option
- Settings page with preview

## License

GPL v2 or later

## Credits

Developed by TsvWeb - Professional WordPress Management
https://tsvweb.co.uk
