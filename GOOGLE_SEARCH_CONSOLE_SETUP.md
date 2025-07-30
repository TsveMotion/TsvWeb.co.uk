# Google Search Console Setup Guide for TsvWeb

## 🔍 Complete Setup Instructions

### Step 1: Access Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Sign in with your Google account
3. Click **"Add Property"**

### Step 2: Add Your Website Property
1. Choose **"URL prefix"** method
2. Enter your domain: `https://tsvweb.com`
3. Click **"Continue"**

### Step 3: Verify Website Ownership

#### Method 1: HTML Meta Tag (Recommended - Already Implemented)
1. Google will show you a meta tag like: `<meta name="google-site-verification" content="ABC123...XYZ" />`
2. Copy the content value (the part after `content="` and before `"`)
3. Update your `.env.local` file:
   ```env
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=ABC123...XYZ
   ```
4. Restart your development server
5. Go back to Google Search Console and click **"Verify"**

#### Method 2: HTML File Upload (Alternative)
1. Download the HTML verification file from Google
2. Upload it to your website's root directory
3. Make sure it's accessible at `https://tsvweb.com/google[...].html`
4. Click **"Verify"** in Google Search Console

### Step 4: Submit Your Sitemap
1. After verification, go to **"Sitemaps"** in the left sidebar
2. Add your sitemap URL: `https://tsvweb.com/sitemap.xml`
3. Click **"Submit"**

### Step 5: Monitor Your SEO Performance
- **Performance**: Track clicks, impressions, CTR, and position for "Website Development Birmingham"
- **Coverage**: Monitor indexing status of your pages
- **Enhancements**: Check for mobile usability and Core Web Vitals
- **Links**: See which sites link to your Birmingham web development pages

## 🎯 Key Metrics to Monitor for Birmingham SEO

### Target Keywords to Track:
- Website Development Birmingham
- Web Design Birmingham
- Birmingham Web Developer
- Website Developer Birmingham
- SEO Services Birmingham
- Mobile Web Design Birmingham

### Important Pages to Monitor:
- Homepage (/)
- Services page (/services)
- Portfolio page (/portfolio)
- Contact page (/contact)
- Blog posts about Birmingham web development

## 📊 Expected Timeline for Results

- **Week 1-2**: Property verification and initial crawling
- **Week 3-4**: Pages start appearing in search results
- **Month 2-3**: Ranking improvements for Birmingham keywords
- **Month 3-6**: Significant traffic growth from local searches

## 🚀 Next Steps After Setup

1. **Submit URL for Indexing**: Use the URL Inspection tool to request indexing for key pages
2. **Monitor Mobile Usability**: Ensure all pages pass mobile-friendly tests
3. **Track Core Web Vitals**: Monitor page speed and user experience metrics
4. **Set Up Alerts**: Configure email notifications for critical issues
5. **Regular Reporting**: Check weekly for new keywords and ranking changes

## 🔧 Troubleshooting

### Verification Issues:
- Ensure the meta tag is in the `<head>` section
- Clear browser cache and try again
- Wait 24-48 hours for DNS propagation if using a new domain

### Sitemap Issues:
- Check that sitemap.xml is accessible at the root domain
- Ensure all URLs in sitemap are valid and return 200 status codes
- Resubmit sitemap if pages aren't being indexed

## 📞 Support
If you need help with Google Search Console setup, contact the TsvWeb development team.

---
*This guide was created as part of the Birmingham SEO optimization project.*
