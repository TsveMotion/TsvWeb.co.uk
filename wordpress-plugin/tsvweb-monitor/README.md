# TsvWeb Monitor - WordPress Plugin

A lightweight WordPress plugin that sends basic website statistics to your TsvWeb dashboard for centralized monitoring.

## Features

- **Automatic Daily Sync**: Sends stats to your dashboard once per day
- **Manual Sync**: Send stats on-demand with a button click
- **Basic Metrics Tracked**:
  - WordPress version
  - PHP version
  - MySQL version
  - Total posts & pages
  - Total users
  - Active plugins count
  - Active theme info
  - Site health status
  - Memory limit
  - Max upload size

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

1. After activation, go to **Settings → TsvWeb Monitor**
2. Enter your **API Key** (get this from your TsvWeb dashboard)
3. Click **Save Changes**
4. Use **Send Stats Now** button to test the connection

## API Key

To get your API key:
1. Log in to your TsvWeb dashboard
2. Go to Settings or API section
3. Generate a new API key for WordPress monitoring
4. Copy and paste it into the plugin settings

## How It Works

1. The plugin collects basic, non-sensitive statistics from your WordPress site
2. Stats are sent to your TsvWeb dashboard via secure API
3. Data is sent automatically once per day
4. You can also manually trigger a sync anytime

## Privacy & Security

- Only basic, non-sensitive statistics are collected
- No user data, passwords, or content is transmitted
- All data is sent over HTTPS (in production)
- API key authentication ensures only authorized access

## Support

For support, visit: https://tsvweb.com/support

## Changelog

### 1.0.0
- Initial release
- Basic stats collection
- Daily automatic sync
- Manual sync option
- Settings page with preview
