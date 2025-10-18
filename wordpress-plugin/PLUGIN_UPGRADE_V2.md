# TsvWeb Monitor Plugin v2.0.0 - Upgrade Summary

## Overview
The TsvWeb Monitor plugin has been completely upgraded from v1.3.0 to v2.0.0 with comprehensive new features for client management, support, and monitoring.

## What's New

### 1. Domain Migration ✅
- All URLs updated from `tsvweb.com` to `tsvweb.co.uk`
- API endpoints, branding, and links updated throughout

### 2. Client Verification System ✅
**New API Endpoint**: `https://tsvweb.co.uk/api/wordpress/verify`

**Features**:
- Verifies sites are official TsvWeb-managed clients
- Displays client name and service plan
- Cached for 1 hour to reduce API calls
- Shows verification badge on control panel

**Implementation**:
```php
public function verify_client()
```

### 3. TsvWeb Control Panel ✅
**New Menu Item**: "TsvWeb Control" (accessible to all users)

**Sections**:
- **Website Status**: Verification status, service plan, last sync, WP/PHP versions
- **Payment Status**: Payment status badge, next payment due, amount
- **Website Overview**: Grid display of posts, pages, users, comments
- **Support Request Form**: Submit tickets directly to TsvWeb dashboard

**Access**: `admin.php?page=tsvweb-control`

### 4. Dashboard Widget ✅
**Widget Name**: "TsvWeb Monitor"

**Displays**:
- Verification status (✓ Verified / ✗ Not Verified)
- Payment status with color coding
- Next payment date
- Last sync time (human-readable)
- WordPress and PHP versions
- Payment overdue warning (if applicable)
- Quick action buttons (Open Control Panel, Contact Support)

### 5. Payment Tracking System ✅
**New API Endpoint**: `https://tsvweb.co.uk/api/wordpress/payment-status`

**Features**:
- Fetches payment status from TsvWeb API
- Shows: status, message, next payment date, amount
- Cached for 6 hours
- Visual badges for different statuses (paid, overdue, unknown)

**Implementation**:
```php
public function get_payment_status()
```

### 6. Support Request System ✅
**New API Endpoint**: `https://tsvweb.co.uk/api/wordpress/support`

**Features**:
- Built-in support form in TsvWeb Control panel
- Fields: Subject, Message, Priority (low/normal/high/urgent)
- Automatically includes: site URL, user info, WP/PHP versions
- Success/error notifications

**Implementation**:
```php
private function handle_support_request()
```

### 7. Admin Tools Page ✅
**New Menu Item**: "Admin Tools" (administrators only)

**Features**:
- **Force Sync**: Manually trigger stats sync
- **Clear Cache**: Reset verification and payment cache
- **System Information**: Plugin version, API status, cron status
- **Remote Endpoints**: Documentation for REST API
- **Database Options**: View stored settings

**Access**: `admin.php?page=tsvweb-admin-tools`

### 8. Enhanced Branding ✅
- Custom login page logo and URL
- TsvWeb-branded admin bar
- Professional UI throughout
- Consistent color scheme (#007cba)

## API Endpoints

### Existing (Preserved)
1. **Stats Sync**: `POST /api/wordpress/stats`
2. **Create Admin**: `POST /wp-json/tsvweb/v1/create-admin`
3. **Reset Password**: `POST /wp-json/tsvweb/v1/reset-password`
4. **Plugin Update**: `GET /api/wordpress/plugin-update`

### New (Required)
1. **Verify Client**: `POST /api/wordpress/verify`
   - Request: `{ "site_url": "...", "site_name": "..." }`
   - Response: `{ "verified": true, "client_name": "...", "plan": "..." }`

2. **Payment Status**: `GET /api/wordpress/payment-status`
   - Response: `{ "status": "paid", "message": "...", "next_payment": "...", "amount": "..." }`

3. **Support Request**: `POST /api/wordpress/support`
   - Request: `{ "site_url": "...", "subject": "...", "message": "...", "priority": "..." }`
   - Response: `{ "success": true }`

## Backend Requirements

You'll need to implement these API endpoints on your TsvWeb dashboard:

### 1. Verification Endpoint
```javascript
// POST https://tsvweb.co.uk/api/wordpress/verify
// Headers: Authorization: Bearer {api_key}
// Body: { site_url, site_name }

// Response:
{
  "verified": true,
  "message": "Client verified",
  "client_name": "Example Company Ltd",
  "plan": "Premium"
}
```

### 2. Payment Status Endpoint
```javascript
// GET https://tsvweb.co.uk/api/wordpress/payment-status
// Headers: Authorization: Bearer {api_key}

// Response:
{
  "status": "paid", // or "overdue", "pending", "unknown"
  "message": "Paid for October 2025",
  "next_payment": "28 Nov 2025",
  "amount": "49.99"
}
```

### 3. Support Request Endpoint
```javascript
// POST https://tsvweb.co.uk/api/wordpress/support
// Headers: Authorization: Bearer {api_key}
// Body: { site_url, site_name, subject, message, priority, user_email, user_name, wp_version, php_version }

// Response:
{
  "success": true,
  "ticket_id": "12345"
}
```

## Installation Instructions

### For New Sites
1. Upload `tsvweb-monitor` folder to `/wp-content/plugins/`
2. Activate the plugin
3. Go to **TsvWeb Control → Settings**
4. Enter API key
5. Plugin will auto-verify and start syncing

### For Existing Sites (Upgrade)
1. Replace the old plugin folder with the new one
2. Plugin will automatically upgrade
3. Existing API key and settings are preserved
4. New features activate immediately

### Creating Plugin Zip
```bash
cd wordpress-plugin
zip -r tsvweb-monitor.zip tsvweb-monitor/ -x "*.git*" "*.DS_Store"
```

Or use the existing script:
```bash
node scripts/create-plugin-zip.js
```

## Testing Checklist

### Client Features
- [ ] TsvWeb Control panel displays correctly
- [ ] Verification status shows (may show "Not Verified" until API is ready)
- [ ] Payment status displays
- [ ] Website overview stats are accurate
- [ ] Support form submits successfully
- [ ] Dashboard widget appears on main dashboard
- [ ] Widget shows correct information

### Admin Features
- [ ] Settings page accessible
- [ ] API key can be saved
- [ ] Manual sync works
- [ ] Admin Tools page accessible (admin only)
- [ ] Force sync button works
- [ ] Clear cache button works
- [ ] System information displays correctly

### Branding
- [ ] TsvWeb logo in admin bar
- [ ] Custom login page logo
- [ ] Login logo links to tsvweb.co.uk
- [ ] All tsvweb.com references updated to tsvweb.co.uk

### API & Sync
- [ ] Stats sync every 30 seconds
- [ ] REST API endpoints work
- [ ] Create admin endpoint functional
- [ ] Reset password endpoint functional

## File Changes

### Modified Files
- `tsvweb-monitor.php` - Complete rewrite with new features (728 → 1340 lines)
- `README.md` - Updated documentation

### New Features in Code
- `verify_client()` - Client verification
- `get_payment_status()` - Payment tracking
- `control_page()` - Main control panel
- `handle_support_request()` - Support form handler
- `admin_tools_page()` - Admin tools interface
- `add_dashboard_widget()` - Dashboard widget registration
- `dashboard_widget_content()` - Widget content
- `custom_login_url()` - Login branding
- `custom_login_title()` - Login branding

## Next Steps

1. **Deploy Plugin**: Upload to client sites or make available for download
2. **Implement API Endpoints**: Create the 3 new endpoints on tsvweb.co.uk backend
3. **Test Integration**: Verify all features work with live API
4. **Update Documentation**: Share with clients
5. **Monitor**: Check error logs for any issues

## Notes

- All existing telemetry features are preserved
- 30-second sync interval maintained
- Auto-update functionality intact
- WooCommerce support continues to work
- Remote management endpoints unchanged
- Backward compatible with existing API keys

## Support

For questions or issues:
- Email: support@tsvweb.co.uk
- Review code in: `wordpress-plugin/tsvweb-monitor/`
- Check README: `wordpress-plugin/tsvweb-monitor/README.md`

---

**Version**: 2.0.0  
**Date**: October 2025  
**Status**: Ready for deployment
