# TsvWeb Product Optimizer

A WordPress plugin that automatically optimizes WooCommerce product titles and descriptions using OpenAI's GPT-4 API.

## Features

- **Admin Interface**: Clean admin page under WooCommerce menu
- **Single Product Optimization**: Optimize individual products with one click
- **Bulk Optimization**: Select and optimize multiple products at once
- **AI-Powered**: Uses OpenAI GPT-4 for intelligent content optimization
- **Secure**: Proper nonce verification, capability checks, and input sanitization
- **WooCommerce Integration**: Seamlessly works with WooCommerce products

## Requirements

- WordPress 5.8 or higher
- WooCommerce 5.0 or higher
- PHP 7.4 or higher
- OpenAI API key

## Installation

1. Upload the `tsvweb-product-optimizer` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Set the `OPENAI_API_KEY` environment variable on your server
4. Navigate to WooCommerce > Product Optimizer

## Configuration

### Setting the OpenAI API Key

The plugin requires the OpenAI API key to be set as an environment variable for security.

**Option 1: wp-config.php**
```php
putenv('OPENAI_API_KEY=your-api-key-here');
```

**Option 2: .htaccess (Apache)**
```apache
SetEnv OPENAI_API_KEY your-api-key-here
```

**Option 3: Server Environment**
Set the environment variable at the server level through your hosting control panel.

## Usage

1. Go to **WooCommerce > Product Optimizer**
2. View all your products in the table
3. **Single Product**: Click "Optimize with AI" button for any product
4. **Bulk Optimization**: 
   - Select multiple products using checkboxes
   - Click "Optimize Selected Products"
   - Confirm the action

## How It Works

1. The plugin fetches product data (title, description, features)
2. Sends the data to OpenAI GPT-4 with optimization instructions
3. Receives optimized content (SEO-friendly title and engaging description)
4. Updates the product automatically
5. Tracks optimization status and timestamp

## File Structure

```
tsvweb-product-optimizer/
├── tsvweb-product-optimizer.php    # Main plugin file
├── admin/
│   ├── class-admin-page.php        # Admin UI and AJAX handlers
│   ├── js/
│   │   └── admin.js                # Frontend JavaScript
│   └── css/
│       └── admin.css               # Admin styles
├── includes/
│   └── class-product-optimizer.php # OpenAI API integration
└── README.md                       # This file
```

## Security

- API key stored as environment variable (never hardcoded)
- WordPress nonce verification for all AJAX requests
- Capability checks (`manage_woocommerce`)
- Input sanitization and output escaping
- Secure API communication with SSL verification

## Support

For issues or questions, contact TsvWeb at https://tsvweb.co.uk

## License

GPL v2 or later

## Changelog

### 1.0.0
- Initial release
- Single product optimization
- Bulk product optimization
- OpenAI GPT-4 integration
- Admin interface under WooCommerce
