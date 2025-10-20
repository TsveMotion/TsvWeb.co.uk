# TsvWeb Product Optimizer - Installation & Usage Guide

## ✅ AUTOMATIC ACCESS GRANTED

The plugin now **automatically grants access** to:
- ✅ All WordPress Administrators
- ✅ Shop Managers
- ✅ TsvWeb Staff (kristiyan@tsvweb.co.uk, support@tsvweb.co.uk, admin@tsvweb.co.uk)

**No manual permission setup needed!**

---

## 📦 Installation Steps

### 1. Upload Plugin to WordPress

```bash
# Option A: Via WordPress Admin
1. Go to WordPress Admin → Plugins → Add New → Upload Plugin
2. Select the tsvweb-product-optimizer.zip file
3. Click "Install Now"
4. Click "Activate"

# Option B: Via FTP/File Manager
1. Upload the entire tsvweb-product-optimizer folder to:
   /wp-content/plugins/
2. Go to WordPress Admin → Plugins
3. Find "TsvWeb Product Optimizer" and click "Activate"
```

### 2. Set OpenAI API Key

Add this to your `wp-config.php` file:

```php
define('OPENAI_API_KEY', 'sk-your-openai-api-key-here');
```

Or set as environment variable in your hosting control panel.

### 3. Verify Installation

Go to: **WooCommerce → Product Optimizer**

You should now see the optimizer page without any permission errors!

---

## 🚀 New Features

### 1. **Automatic Access Control**
- Administrators get instant access
- TsvWeb staff automatically recognized
- No more "Sorry, you are not allowed" errors

### 2. **REST API Endpoints**

Control the optimizer remotely from your Next.js dashboard:

#### Get Status
```bash
GET /wp-json/tsvweb-optimizer/v1/status
Headers: X-API-Key: your-tsvweb-api-key
```

Response:
```json
{
  "success": true,
  "enabled": true,
  "last_run": "2025-10-20 15:30:00",
  "api_key_configured": true,
  "woocommerce_active": true
}
```

#### Toggle Optimizer
```bash
POST /wp-json/tsvweb-optimizer/v1/toggle
Headers: X-API-Key: your-tsvweb-api-key
Body: {"enabled": true}
```

Response:
```json
{
  "success": true,
  "message": "Optimizer enabled successfully",
  "enabled": true,
  "timestamp": "2025-10-20 15:30:00"
}
```

#### Get Statistics
```bash
GET /wp-json/tsvweb-optimizer/v1/stats
Headers: X-API-Key: your-tsvweb-api-key
```

Response:
```json
{
  "success": true,
  "stats": {
    "total_optimizations": 45,
    "total_tokens_used": 125000,
    "last_optimization": "2025-10-20 15:30:00",
    "enabled": true
  }
}
```

### 3. **SEO Optimization Features**

The plugin now automatically optimizes:

#### Meta Titles
- SEO-friendly, max 60 characters
- Includes relevant keywords
- Compelling and click-worthy

#### Meta Descriptions
- Engaging, max 160 characters
- Includes call-to-action
- Optimized for search engines

#### Focus Keywords
- Automatically extracted
- 2-4 word keyphrases
- Based on product content

#### Image Alt Texts
- Descriptive and SEO-friendly
- Max 125 characters
- Applied to main image and gallery

#### Schema.org Markup
- Product schema
- Pricing and availability
- Ratings and reviews
- Brand information

### 4. **Automatic SEO Integration**

Works with popular SEO plugins:
- ✅ **Rank Math SEO** - Full integration
- ✅ **Yoast SEO** - Full integration
- ✅ **Fallback** - Saves to custom meta fields

### 5. **Background Processing**

- SEO optimization runs in background
- Doesn't slow down product saves
- Uses WP-Cron for scheduling

---

## 🎯 How to Use

### Manual Optimization

1. Go to **WooCommerce → Product Optimizer**
2. Select products to optimize
3. Click "Optimize Selected"
4. Wait for completion

### Automatic SEO Optimization

Enable in WordPress Admin:
1. Go to **WooCommerce → Product Optimizer**
2. Enable "Auto-optimize SEO on save"
3. Now every time you save a product, SEO is optimized automatically!

### Remote Control from Next.js Dashboard

Your TsvWeb Admin dashboard can now:
- ✅ Enable/disable optimizer
- ✅ View real-time status
- ✅ Track optimization statistics
- ✅ Monitor token usage

---

## 🔧 Troubleshooting

### Still Getting Permission Error?

1. **Deactivate and Reactivate** the plugin:
   - Go to Plugins → Deactivate "TsvWeb Product Optimizer"
   - Then click Activate again
   - This re-runs the capability granting

2. **Check Your User Role**:
   - Go to Users → Your Profile
   - Verify you're an Administrator

3. **Manual Capability Grant** (if needed):
   ```php
   // Add to functions.php temporarily
   add_action('init', function() {
       $user = wp_get_current_user();
       $user->add_cap('tsvweb_manage_optimizer');
   });
   ```

### API Key Not Working?

1. Verify in `wp-config.php`:
   ```php
   define('OPENAI_API_KEY', 'sk-...');
   ```

2. Check it's loaded:
   ```php
   echo getenv('OPENAI_API_KEY'); // Should show your key
   ```

### REST API Not Responding?

1. Check permalinks:
   - Go to Settings → Permalinks
   - Click "Save Changes" (refreshes rewrite rules)

2. Verify API key in TsvWeb Control plugin:
   - Go to TsvWeb Control → Settings
   - Ensure API key is configured

---

## 📊 What Gets Optimized

### Product Content
- ✅ Title (SEO-optimized)
- ✅ Description (engaging and keyword-rich)
- ✅ Short description (compelling)

### SEO Metadata
- ✅ Meta title (60 chars max)
- ✅ Meta description (160 chars max)
- ✅ Focus keyword (extracted automatically)

### Images
- ✅ Main product image alt text
- ✅ Gallery images alt text
- ✅ SEO-friendly descriptions

### Structured Data
- ✅ Product schema markup
- ✅ Price and availability
- ✅ Ratings and reviews
- ✅ Brand information

---

## 🎨 SEO Best Practices Applied

1. **Keyword Optimization**
   - Natural keyword placement
   - Avoids keyword stuffing
   - Focus on user intent

2. **Content Quality**
   - Engaging and informative
   - Clear value propositions
   - Compelling calls-to-action

3. **Technical SEO**
   - Proper schema markup
   - Optimized meta tags
   - Image optimization

4. **Mobile-Friendly**
   - Concise descriptions
   - Clear formatting
   - Fast loading

---

## 🔐 Security

- ✅ API key authentication required
- ✅ Capability-based access control
- ✅ Nonce verification for AJAX
- ✅ Input sanitization
- ✅ Output escaping

---

## 📈 Performance

- ✅ Background processing (no page slowdown)
- ✅ WP-Cron scheduling
- ✅ Efficient API calls
- ✅ Minimal database queries

---

## 🆘 Support

If you still have issues:

1. Check WordPress error log: `/wp-content/debug.log`
2. Enable debug mode in `wp-config.php`:
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   ```
3. Contact TsvWeb support: support@tsvweb.co.uk

---

## ✨ Summary

**You now have:**
- ✅ Automatic access (no permission errors!)
- ✅ REST API for remote control
- ✅ Advanced SEO optimization
- ✅ Image alt text generation
- ✅ Schema markup generation
- ✅ Integration with Rank Math & Yoast
- ✅ Background processing
- ✅ Full Next.js dashboard integration

**Just upload, activate, and it works!** 🎉
