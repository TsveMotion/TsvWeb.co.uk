# TsvWeb Plugin - Installation Guide

## Quick Start

### 1. Download the Plugin

The plugin is available at:
```
https://tsvweb.co.uk/wordpress-plugin/tsvweb.zip
```

### 2. Install on WordPress

**Method 1: WordPress Admin (Recommended)**
1. Log in to WordPress admin
2. Go to **Plugins > Add New**
3. Click **Upload Plugin**
4. Choose `tsvweb.zip`
5. Click **Install Now**
6. Click **Activate Plugin**

**Method 2: FTP/File Manager**
1. Extract `tsvweb.zip`
2. Upload the `tsvweb` folder to `/wp-content/plugins/`
3. Go to **Plugins** in WordPress admin
4. Find **TsvWeb** and click **Activate**

### 3. Configure TsvWeb API Key

1. Go to **TsvWeb Control > Settings**
2. Enter your TsvWeb API key
3. Click **Save Changes**
4. The plugin will start syncing site stats automatically

### 4. Configure OpenAI (Optional - for Product Optimizer)

Only needed if you want to use the AI Product Optimizer feature.

**Add to `wp-config.php`** (before "That's all, stop editing!"):
```php
// TsvWeb Product Optimizer - OpenAI API Key
putenv('OPENAI_API_KEY=sk-your-openai-api-key-here');
```

**Or add to `.htaccess`** (Apache servers):
```apache
SetEnv OPENAI_API_KEY sk-your-openai-api-key-here
```

---

## Initial Setup

### For Site Administrators

1. **Verify Installation**
   - Check **TsvWeb Control** menu appears in WordPress admin
   - Dashboard widget should show "TsvWeb Monitor"

2. **Configure Settings**
   - Go to **TsvWeb Control > Settings**
   - Add TsvWeb API key
   - Click "Send Stats Now" to test connection

3. **Enable Product Optimizer** (if WooCommerce installed)
   - Go to **TsvWeb Control > Product Optimizer**
   - Click **Enable Optimizer** button
   - Verify OpenAI API key is configured

### For TsvWeb Staff

1. **Access Admin Tools**
   - Go to **TsvWeb Control > Admin Tools**
   - Force sync stats
   - View system information

2. **Monitor Client Sites**
   - Stats automatically sync every 30 seconds
   - View client verification status
   - Check payment status

---

## Using the Product Optimizer

### Prerequisites
- WooCommerce must be installed and active
- OpenAI API key must be configured
- Administrator must enable the optimizer

### Optimizing Products

**Single Product:**
1. Go to **TsvWeb Control > Product Optimizer**
2. Find the product you want to optimize
3. Click **Optimize with AI**
4. Wait for AI to generate content (~5-10 seconds)
5. Product is automatically updated

**Bulk Optimization:**
1. Go to **TsvWeb Control > Product Optimizer**
2. Check the boxes for products you want to optimize
3. Click **Optimize Selected Products**
4. Confirm the action
5. Wait for all products to be optimized

### Monitoring Usage

View real-time statistics:
- **Total Optimizations**: How many products have been optimized
- **Tokens Used**: Total OpenAI API tokens consumed
- **Estimated Cost**: Total cost in USD
- **Last Optimization**: When the last optimization occurred

---

## Admin Controls

### Enable/Disable Optimizer

**To Enable:**
1. Go to **TsvWeb Control > Product Optimizer**
2. Click **🔓 Enable Optimizer** button
3. Users can now optimize products

**To Disable:**
1. Go to **TsvWeb Control > Product Optimizer**
2. Click **🔒 Disable Optimizer** button
3. Optimization features are hidden from all users

### Why Disable?

- Control AI usage costs
- Prevent unauthorized optimizations
- Maintenance or testing
- Temporary suspension of service

---

## Troubleshooting

### Plugin Not Appearing

**Check:**
- Plugin is activated in **Plugins** menu
- You're logged in as Administrator
- WordPress version is 5.0 or higher

### Stats Not Syncing

**Check:**
1. TsvWeb API key is configured correctly
2. Go to **TsvWeb Control > Settings**
3. Click **Send Stats Now** to test
4. Check **Admin Tools** for cron status

### Product Optimizer Not Working

**Check:**
1. WooCommerce is installed and active
2. OpenAI API key is configured in `wp-config.php` or `.htaccess`
3. Optimizer is enabled in **Product Optimizer** page
4. You have `manage_woocommerce` capability

**Error: "OpenAI API Key Missing"**
- Add `OPENAI_API_KEY` environment variable
- Restart web server after adding to `.htaccess`

**Error: "Product optimizer is disabled"**
- Administrator needs to enable it in **Product Optimizer** page

### High API Costs

**Solutions:**
1. Disable the optimizer temporarily
2. Monitor usage in the statistics dashboard
3. Optimize only high-priority products
4. Use bulk optimization sparingly

---

## Uninstallation

### To Remove Plugin

1. Go to **Plugins** in WordPress admin
2. Find **TsvWeb**
3. Click **Deactivate**
4. Click **Delete**

**Note:** This will remove:
- All plugin files
- Scheduled cron jobs
- Cached data

**Preserved:**
- Plugin settings (in `wp_options` table)
- Product optimization history
- Usage statistics

To completely remove all data, delete these options from database:
- `tsvweb_settings`
- `tsvweb_optimizer_enabled`
- `tsvweb_optimizer_stats`

---

## Getting Help

### Support Channels

**Email:** support@tsvweb.co.uk  
**Website:** https://tsvweb.co.uk  
**Phone:** Available on website

### Before Contacting Support

Please provide:
1. WordPress version
2. PHP version
3. Plugin version (check **Admin Tools**)
4. Error messages (if any)
5. Steps to reproduce the issue

---

## Security Best Practices

### API Keys

✅ **DO:**
- Store OpenAI key as environment variable
- Keep TsvWeb API key private
- Use strong, unique keys

❌ **DON'T:**
- Hardcode API keys in theme files
- Share API keys publicly
- Commit keys to version control

### Permissions

- Only administrators can access settings
- Only WooCommerce managers can optimize products
- Remote API endpoints require API key authentication

---

## FAQ

**Q: Does this plugin slow down my site?**  
A: No. Stats sync happens in the background every 30 seconds using WordPress cron. Product optimization is on-demand only.

**Q: How much does AI optimization cost?**  
A: Approximately $0.045 per 1,000 tokens. A typical product optimization uses 500-1,000 tokens (~$0.02-$0.05 per product).

**Q: Can I optimize products that were already optimized?**  
A: Yes. You can re-optimize products at any time. The plugin tracks the last optimization date.

**Q: What happens if I disable the optimizer?**  
A: All optimization features are hidden from users. Previously optimized products remain unchanged. Usage statistics are preserved.

**Q: Can I use this without WooCommerce?**  
A: Yes! The monitoring features work on any WordPress site. Product optimizer requires WooCommerce.

**Q: Is my data secure?**  
A: Yes. All API communication uses SSL. API keys are stored securely. No sensitive data is logged.

---

## System Requirements

### Minimum Requirements
- WordPress 5.0+
- PHP 7.4+
- MySQL 5.6+ or MariaDB 10.0+

### Recommended Requirements
- WordPress 6.0+
- PHP 8.0+
- MySQL 8.0+ or MariaDB 10.5+
- SSL certificate
- WooCommerce 7.0+ (for product optimizer)

### Server Requirements
- `allow_url_fopen` enabled
- `curl` extension installed
- Cron jobs enabled
- At least 64MB PHP memory limit

---

## Changelog

### Version 3.0.0 (Current)
- ✅ Merged Monitor and Product Optimizer
- ✅ Added admin enable/disable controls
- ✅ Added usage tracking and cost estimation
- ✅ Added real-time statistics dashboard
- ✅ Improved security and permissions

---

**Need Help?** Contact support@tsvweb.co.uk
