# TsvWeb Plugin

Complete monitoring, management, and AI-powered product optimization solution for TsvWeb-managed WordPress sites.

## Version 3.0.0

### Features

#### Monitoring & Management
- Real-time WordPress site monitoring
- Automatic stats sync every 30 seconds
- Client verification and payment tracking
- Support ticket system
- Dashboard widget with site health
- Remote admin user creation
- Remote password reset
- Custom branding (login page, admin bar)
- Auto-updates from TsvWeb server

#### AI Product Optimizer (WooCommerce)
- AI-powered product title and description optimization
- Uses OpenAI GPT-4 for intelligent content generation
- **Admin control panel** to enable/disable optimizer
- **Usage tracking**: Total optimizations, tokens used, cost estimation
- Single product optimization
- Bulk product optimization
- Optimization history tracking
- Real-time usage statistics dashboard

### Requirements

- WordPress 5.0+
- PHP 7.4+
- WooCommerce 5.0+ (for product optimizer)
- OpenAI API key (for product optimizer)

### Installation

1. Upload the `tsvweb` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Configure TsvWeb API key in Settings
4. Set `OPENAI_API_KEY` environment variable for product optimizer

### Configuration

#### TsvWeb API Key
Set your TsvWeb API key in **TsvWeb Control > Settings**

#### OpenAI API Key (for Product Optimizer)
Set the environment variable:

**wp-config.php:**
```php
putenv('OPENAI_API_KEY=your-api-key-here');
```

**. htaccess (Apache):**
```apache
SetEnv OPENAI_API_KEY your-api-key-here
```

### Usage

#### Product Optimizer Control

1. Go to **TsvWeb Control > Product Optimizer**
2. **Enable/Disable** the optimizer using the toggle button
3. View **usage statistics**:
   - Total optimizations performed
   - Total AI tokens consumed
   - Estimated cost in USD
   - Last optimization timestamp
4. When enabled, users can optimize products individually or in bulk

#### Optimizing Products

**Single Product:**
- Click "Optimize with AI" button next to any product

**Bulk Optimization:**
- Select multiple products using checkboxes
- Click "Optimize Selected Products"
- Confirm the action

### Admin Controls

Administrators can:
- **Enable/Disable** the AI optimizer for all users
- **Monitor usage** in real-time
- **Track costs** associated with AI API usage
- View optimization history by date
- Control access to optimization features

### File Structure

```
tsvweb/
├── tsvweb.php                          # Main plugin file
├── includes/
│   └── class-product-optimizer.php     # AI optimizer core
├── admin/
│   ├── class-optimizer-admin.php       # Optimizer admin UI
│   ├── js/
│   │   └── optimizer-admin.js          # Admin JavaScript
│   ├── css/
│   │   └── optimizer-admin.css         # Admin styles
│   ├── settings-page.php               # Settings page template
│   ├── control-page.php                # Control panel template
│   ├── admin-tools-page.php            # Admin tools template
│   └── dashboard-widget.php            # Dashboard widget template
└── README.md                           # This file
```

### API Endpoints

**Create Admin User:**
```
POST /wp-json/tsvweb/v1/create-admin
Headers: X-API-Key: your-api-key
Body: { "username": "...", "email": "...", "password": "..." }
```

**Reset Password:**
```
POST /wp-json/tsvweb/v1/reset-password
Headers: X-API-Key: your-api-key
Body: { "username": "...", "new_password": "..." }
```

### Shortcodes

- `[tsvweb_contact_form]` - Contact form
- `[tsvweb_services]` - Services grid
- `[tsvweb_portfolio]` - Portfolio grid
- `[tsvweb_made_by]` - TsvWeb badge

### Support

For issues or questions:
- Email: support@tsvweb.co.uk
- Website: https://tsvweb.co.uk

### License

GPL v2 or later

### Changelog

#### 3.0.0
- Merged TsvWeb Monitor and Product Optimizer
- Added admin controls for AI optimizer
- Added usage tracking and cost estimation
- Added enable/disable toggle for optimizer
- Improved statistics dashboard
- Enhanced security and permissions

#### 2.0.0
- Enhanced monitoring features
- Added client verification
- Added payment tracking
- Added support ticket system

#### 1.0.0
- Initial release
