# TsvWeb Plugin - Unified Solution

## Overview

Successfully merged **TsvWeb Monitor** and **TsvWeb Product Optimizer** into a single, unified WordPress plugin called **TsvWeb**.

## Version 3.0.0

### What's New

✅ **Unified Plugin**: Combined monitoring and AI optimization into one plugin  
✅ **Admin Controls**: Enable/disable AI optimizer from WordPress admin  
✅ **Usage Tracking**: Track AI optimizations, tokens used, and costs  
✅ **Cost Monitoring**: Real-time cost estimation for OpenAI API usage  
✅ **Automatic Zip Creation**: Script creates downloadable plugin zip  

---

## Features

### 1. **Monitoring & Management** (from TsvWeb Monitor)
- Real-time WordPress site monitoring
- Automatic stats sync every 30 seconds
- Client verification and payment tracking
- Support ticket system
- Dashboard widget with site health
- Remote admin user creation
- Remote password reset
- Custom branding (login page, admin bar)
- Auto-updates from TsvWeb server
- Shortcodes for contact forms, services, portfolio

### 2. **AI Product Optimizer** (New Integration)
- AI-powered product title and description optimization
- Uses OpenAI GPT-4 for intelligent content generation
- **Admin control panel** to enable/disable optimizer
- **Usage tracking dashboard**:
  - Total optimizations performed
  - Total AI tokens consumed
  - Estimated cost in USD
  - Last optimization timestamp
  - Daily usage breakdown (90-day history)
- Single product optimization
- Bulk product optimization
- Optimization history tracking

---

## Admin Controls

### Enable/Disable Optimizer

Administrators can control whether users can access the AI optimizer:

1. Go to **TsvWeb Control > Product Optimizer**
2. Click the **Enable/Disable** toggle button
3. When disabled, all optimization features are hidden from users

### Usage Statistics Dashboard

Track AI consumption in real-time:

- **Total Optimizations**: Number of products optimized
- **Tokens Used**: Total OpenAI API tokens consumed
- **Estimated Cost**: Total cost in USD (based on GPT-4 pricing)
- **Last Optimization**: Timestamp of most recent optimization
- **Daily Breakdown**: Usage by date for last 90 days

---

## Installation

### 1. Download Plugin

The plugin zip is automatically created and available at:
```
https://tsvweb.co.uk/wordpress-plugin/tsvweb.zip
```

### 2. Install on WordPress

1. Upload `tsvweb.zip` to WordPress via **Plugins > Add New > Upload Plugin**
2. Activate the plugin
3. Configure TsvWeb API key in **TsvWeb Control > Settings**

### 3. Configure OpenAI (for Product Optimizer)

Set the `OPENAI_API_KEY` environment variable:

**Option 1: wp-config.php**
```php
putenv('OPENAI_API_KEY=sk-your-api-key-here');
```

**Option 2: .htaccess (Apache)**
```apache
SetEnv OPENAI_API_KEY sk-your-api-key-here
```

**Option 3: Server Environment**
Set via hosting control panel or server configuration.

---

## Usage

### For Administrators

#### Enable/Disable Optimizer
1. Navigate to **TsvWeb Control > Product Optimizer**
2. View current status (Enabled/Disabled)
3. Click toggle button to change status
4. When disabled, users cannot access optimization features

#### Monitor Usage
View real-time statistics:
- Total optimizations
- Tokens consumed
- Cost estimation
- Usage trends

### For Users (when enabled)

#### Optimize Single Product
1. Go to **TsvWeb Control > Product Optimizer**
2. Find the product in the table
3. Click **"Optimize with AI"** button
4. Wait for AI to generate optimized content
5. Product is automatically updated

#### Bulk Optimize
1. Select multiple products using checkboxes
2. Click **"Optimize Selected Products"**
3. Confirm the action
4. All selected products are optimized sequentially

---

## File Structure

```
wordpress-plugin/tsvweb/
├── tsvweb.php                          # Main plugin file
├── includes/
│   └── class-product-optimizer.php     # AI optimizer core with usage tracking
├── admin/
│   ├── class-optimizer-admin.php       # Optimizer admin UI with controls
│   ├── settings-page.php               # Settings page template
│   ├── control-page.php                # Control panel template
│   ├── admin-tools-page.php            # Admin tools template
│   ├── dashboard-widget.php            # Dashboard widget template
│   ├── js/
│   │   └── optimizer-admin.js          # Admin JavaScript
│   └── css/
│       └── optimizer-admin.css         # Admin styles
└── README.md                           # Documentation
```

---

## Creating the Plugin Zip

### Automatic Creation

Run the script to create the downloadable zip:

```bash
node scripts/create-plugin-zip.js
```

**Output:**
```
📦 Creating TsvWeb plugin zip...
📁 Including: Monitor + AI Product Optimizer
✅ TsvWeb Plugin zip created successfully!
📦 Size: 21.98 KB
📍 Location: C:\Users\tsvet\Documents\tsvweb\tsvweb\public\wordpress-plugin\tsvweb.zip
🌐 Download URL: https://tsvweb.co.uk/wordpress-plugin/tsvweb.zip
```

The zip file is created in:
```
public/wordpress-plugin/tsvweb.zip
```

This can be downloaded from your TsvWeb website at:
```
https://tsvweb.co.uk/wordpress-plugin/tsvweb.zip
```

---

## Menu Structure

### TsvWeb Control (Main Menu)
- **TsvWeb Control** - Client dashboard with site stats
- **Settings** - Configure API keys and settings (Admin only)
- **Product Optimizer** - AI optimization controls and usage stats (Admin/WooCommerce Manager)
- **Admin Tools** - Advanced tools for TsvWeb staff (Admin only)

---

## Security Features

✅ **API Key Security**: OpenAI key stored as environment variable (never hardcoded)  
✅ **Nonce Verification**: All AJAX requests verified with WordPress nonces  
✅ **Capability Checks**: Proper permission checks (`manage_options`, `manage_woocommerce`)  
✅ **Input Sanitization**: All inputs sanitized and validated  
✅ **Output Escaping**: All outputs properly escaped  
✅ **SSL Verification**: Secure API communication  

---

## Cost Management

### Pricing Calculation

The plugin tracks OpenAI API costs based on GPT-4 pricing:
- **Prompt tokens**: $0.03 per 1K tokens
- **Completion tokens**: $0.06 per 1K tokens
- **Average**: ~$0.045 per 1K tokens (simplified calculation)

### Cost Control

Administrators can:
1. **Monitor costs** in real-time via the dashboard
2. **Disable optimizer** to prevent further usage
3. **View historical usage** for the last 90 days
4. **Track per-optimization costs**

---

## API Endpoints

### Create Admin User
```
POST /wp-json/tsvweb/v1/create-admin
Headers: X-API-Key: your-tsvweb-api-key
Body: {
  "username": "newadmin",
  "email": "admin@example.com",
  "password": "secure-password"
}
```

### Reset Password
```
POST /wp-json/tsvweb/v1/reset-password
Headers: X-API-Key: your-tsvweb-api-key
Body: {
  "username": "existinguser",
  "new_password": "new-secure-password"
}
```

---

## Requirements

- WordPress 5.0+
- PHP 7.4+
- WooCommerce 5.0+ (for product optimizer)
- OpenAI API key (for product optimizer)
- TsvWeb API key (for monitoring)

---

## Support

**Email**: support@tsvweb.co.uk  
**Website**: https://tsvweb.co.uk  

---

## Changelog

### Version 3.0.0 (Current)
- ✅ Merged TsvWeb Monitor and Product Optimizer
- ✅ Added admin controls for AI optimizer (enable/disable)
- ✅ Added usage tracking and cost estimation
- ✅ Added real-time statistics dashboard
- ✅ Improved security and permissions
- ✅ Updated zip creation script
- ✅ Unified menu structure

### Version 2.0.0
- Enhanced monitoring features
- Added client verification
- Added payment tracking
- Added support ticket system

### Version 1.0.0
- Initial TsvWeb Monitor release

---

## Next Steps

1. ✅ **Plugin Created**: Unified TsvWeb plugin is ready
2. ✅ **Zip Script Updated**: Creates `tsvweb.zip` automatically
3. ✅ **Admin Controls**: Enable/disable and usage tracking implemented
4. 📤 **Deploy**: Upload `public/wordpress-plugin/tsvweb.zip` to your server
5. 🌐 **Download**: Plugin available at `https://tsvweb.co.uk/wordpress-plugin/tsvweb.zip`

---

## License

GPL v2 or later

---

**Made with ❤️ by TsvWeb**  
Professional Web Design & Development in Birmingham
