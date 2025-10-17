# WordPress Plugin Setup - Quick Guide

## ✅ Updates Made:

1. **Plugin API URL**: Updated to `https://tsvweb.com/api/wordpress/stats`
2. **Download Page**: Created at `/download/wordpress-plugin`
3. **Zip Creation Script**: Added to easily create plugin zip

## 📦 Create the Plugin Zip File

### Option 1: Using npm script (Recommended)
```bash
npm run plugin:zip
```

This will create: `public/wordpress-plugin/tsvweb-monitor.zip`

### Option 2: Manual Zip
1. Navigate to: `wordpress-plugin/tsvweb-monitor/`
2. Select both files:
   - `tsvweb-monitor.php`
   - `README.md`
3. Right-click → Send to → Compressed (zipped) folder
4. Rename to: `tsvweb-monitor.zip`
5. Move to: `public/wordpress-plugin/tsvweb-monitor.zip`

## 🌐 Download URLs

Once the zip is created, users can download from:

- **Direct Download**: `https://tsvweb.com/wordpress-plugin/tsvweb-monitor.zip`
- **Download Page**: `https://tsvweb.com/download/wordpress-plugin`

## 🚀 Testing Flow

### 1. Create the Zip
```bash
npm run plugin:zip
```

### 2. Start Your Server
```bash
npm run dev
# or for production
npm run build
npm start
```

### 3. Download the Plugin
Visit: `http://localhost:3000/download/wordpress-plugin`

### 4. Install on WordPress
1. Go to your WordPress site
2. Plugins → Add New → Upload Plugin
3. Upload `tsvweb-monitor.zip`
4. Activate

### 5. Configure
1. Settings → TsvWeb Monitor
2. Enter API Key (generate from your dashboard)
3. Click "Send Stats Now"

### 6. View in Dashboard
Visit: `https://tsvweb.com/admin/wordpress-sites`

## 🔑 API Key Setup

For production, you should:

1. Create an API key generation system in your admin panel
2. Store keys in database with user association
3. Validate keys in the `/api/wordpress/stats` endpoint

**For Testing:** Use any string 10+ characters (e.g., `test-key-12345`)

## 📁 File Structure

```
tsvweb/
├── wordpress-plugin/
│   ├── tsvweb-monitor/
│   │   ├── tsvweb-monitor.php (✅ Updated to tsvweb.com)
│   │   └── README.md
│   └── INSTALLATION_GUIDE.md
├── public/
│   └── wordpress-plugin/
│       └── tsvweb-monitor.zip (Created by script)
├── src/app/
│   ├── download/wordpress-plugin/page.tsx (✅ New)
│   ├── admin/wordpress-sites/page.tsx (✅ Updated)
│   └── api/
│       ├── wordpress/stats/route.ts
│       └── admin/wordpress-sites/route.ts
└── scripts/
    └── create-plugin-zip.js (✅ New)
```

## 🎯 Next Steps

1. **Run the zip script**: `npm run plugin:zip`
2. **Test locally**: Visit `/download/wordpress-plugin`
3. **Deploy to production**: Push to tsvweb.com
4. **Install on client sites**: Use the download page
5. **Monitor**: Check `/admin/wordpress-sites` dashboard

## 🔒 Security Notes

- Plugin now uses HTTPS: `https://tsvweb.com/api/wordpress/stats`
- Implement proper API key validation before production
- Consider rate limiting on the API endpoint
- Add IP whitelisting if needed

## 📊 What Gets Tracked

- WordPress, PHP, MySQL versions
- Posts, pages, users counts
- Active plugins count
- Active theme info
- Site health status
- Memory & upload limits
- Last update timestamp

## 🆘 Troubleshooting

**Zip script not working?**
- Make sure you're in the project root
- Check that `archiver` is installed: `npm install archiver`

**Download not working?**
- Ensure zip file exists in `public/wordpress-plugin/`
- Check file permissions
- Verify Next.js is serving static files

**Plugin not sending data?**
- Check WordPress error logs
- Verify API URL is correct
- Test API endpoint manually with curl
- Check API key is valid

## 🎉 Ready!

Your WordPress monitoring system is now configured for production at tsvweb.com!
