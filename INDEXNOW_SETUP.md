# IndexNow Integration Guide

## What is IndexNow?

IndexNow is a protocol that allows websites to instantly notify search engines (Bing, Yandex, etc.) when content is added, updated, or deleted. This helps search engines discover your content faster without waiting for crawlers.

**Supported Search Engines:**
- Microsoft Bing
- Yandex
- Naver
- Seznam.cz
- And more...

## Features Implemented

✅ **Automatic Notifications**: Blog posts are automatically submitted to search engines when:
- Created (if published)
- Updated (if published)
- Deleted (to notify removal)

✅ **Key Management**: Automatic generation and hosting of IndexNow verification key

✅ **Batch Submissions**: Support for submitting multiple URLs at once (up to 10,000)

✅ **Error Handling**: Graceful failure handling - IndexNow errors won't break your application

✅ **Manual Submissions**: API endpoint for manually submitting URLs

## Setup Instructions

### 1. Generate IndexNow Key

Generate a random hexadecimal key (8-128 characters). You can use one of these methods:

**Option A: Online Generator**
```bash
# Visit: https://www.random.org/strings/
# Settings: 64 characters, hexadecimal
```

**Option B: Command Line (Node.js)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option C: PowerShell**
```powershell
-join ((48..57) + (97..102) | Get-Random -Count 64 | % {[char]$_})
```

### 2. Add to Environment Variables

Add the generated key to your `.env.local` file:

```env
# IndexNow Configuration
INDEXNOW_KEY=c866b7e58f154ef3bfa2136aa348547c
SITE_URL=https://tsvweb.com
```

**Important:** Replace `c866b7e58f154ef3bfa2136aa348547c` with your actual generated key.

### 3. Deploy Your Application

When you deploy or restart your application:

1. The IndexNow service will automatically create a key file in the `public` directory
2. The file will be named `{your-key}.txt` (e.g., `c866b7e58f154ef3bfa2136aa348547c.txt`)
3. This file will be accessible at `https://tsvweb.com/{your-key}.txt`

### 4. Verify Setup

**Check Key File:**
```bash
# Visit in browser:
https://tsvweb.com/{your-key}.txt

# Should display your key
```

**Test API Endpoint:**
```bash
# Visit in browser:
https://tsvweb.com/api/indexnow

# Should display your key
```

## How It Works

### Automatic Submissions

The system automatically submits URLs to IndexNow when:

1. **Blog Post Created** (if status = published)
   - Submits: `/blog/{slug}`

2. **Blog Post Updated** (if status = published)
   - Submits: `/blog/{slug}`

3. **Blog Post Deleted** (if was published)
   - Submits: `/blog/{slug}` (to notify removal)

### Manual Submissions

You can manually submit URLs using the API:

**Submit Single URL:**
```bash
POST /api/indexnow
Content-Type: application/json

{
  "url": "https://tsvweb.com/blog/my-post"
}
```

**Submit Multiple URLs:**
```bash
POST /api/indexnow
Content-Type: application/json

{
  "urls": [
    "https://tsvweb.com/blog/post-1",
    "https://tsvweb.com/blog/post-2",
    "https://tsvweb.com/portfolio/project-1"
  ]
}
```

**Using the Service Directly (in code):**
```typescript
import { indexNowService } from '@/services/indexnow-service';

// Submit single URL
await indexNowService.submitUrl('/blog/my-post');

// Submit blog post by slug
await indexNowService.submitBlogPost('my-post-slug');

// Submit multiple URLs
await indexNowService.submitUrls([
  '/blog/post-1',
  '/blog/post-2',
  '/portfolio/project-1'
]);

// Submit portfolio item
await indexNowService.submitPortfolioItem('project-slug');

// Submit any page
await indexNowService.submitPage('/services/web-design');
```

## Response Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | URL submitted successfully |
| 202 | Accepted | URL received, key validation pending |
| 400 | Bad Request | Invalid format |
| 403 | Forbidden | Key not valid |
| 422 | Unprocessable Entity | URLs don't belong to host or key mismatch |
| 429 | Too Many Requests | Potential spam detected |

## Verification Process

Search engines will verify your ownership by:

1. Receiving your URL submission with the key
2. Fetching `https://tsvweb.com/{your-key}.txt`
3. Verifying the key in the file matches the submitted key
4. Processing your URL for indexing

## Best Practices

### ✅ DO:
- Submit URLs immediately when content changes
- Use the same key consistently
- Keep your key secure (don't share publicly)
- Submit only URLs that belong to your domain
- Batch multiple URLs when possible

### ❌ DON'T:
- Submit too frequently (avoid spam detection)
- Submit URLs from other domains
- Change your key frequently
- Submit non-existent URLs
- Submit private/admin URLs

## Troubleshooting

### Key File Not Found (403 Error)

**Problem:** Search engines can't find your key file

**Solutions:**
1. Check that the file exists in `public/{your-key}.txt`
2. Verify the file contains only your key (no extra whitespace)
3. Ensure your web server serves files from the `public` directory
4. Check file permissions

### URLs Not Being Indexed

**Problem:** URLs submitted but not appearing in search results

**Possible Reasons:**
1. IndexNow only notifies - it doesn't guarantee indexing
2. Search engines may still evaluate content quality
3. New sites may take longer to index
4. Content may not meet search engine guidelines

**What to Do:**
- Wait 24-48 hours for processing
- Check search engine webmaster tools
- Ensure content is high quality and unique
- Verify sitemap is also submitted

### Key Validation Pending (202 Response)

**Problem:** Receiving 202 instead of 200

**This is Normal:** 
- 202 means the URL was received
- Key validation is in progress
- Search engines will verify your key file
- No action needed - wait for verification

### Too Many Requests (429 Error)

**Problem:** Rate limiting triggered

**Solutions:**
1. Reduce submission frequency
2. Batch multiple URLs into single request
3. Wait before retrying
4. Review submission patterns

## Monitoring

### Check Submission Logs

The service logs all submissions to the console:

```
📤 Submitting 1 URL(s) to IndexNow...
✅ Successfully submitted to 1 search engine(s)
```

### Error Logs

Failed submissions are logged but don't break the application:

```
❌ IndexNow submission failed: [error details]
```

## Advanced Usage

### Custom Search Engine Endpoints

Edit `src/services/indexnow-service.ts` to add custom endpoints:

```typescript
private searchEngines = [
  'https://api.indexnow.org/indexnow', // Default (shared)
  'https://www.bing.com/indexnow',     // Direct Bing
  'https://yandex.com/indexnow',       // Direct Yandex
];
```

### Integrate with Other Content Types

Add IndexNow to portfolio, services, or other content:

```typescript
// In your API route
import { indexNowService } from '@/services/indexnow-service';

// After creating/updating portfolio item
if (item.published) {
  await indexNowService.submitPortfolioItem(item.slug);
}
```

### Batch Submit All Published Content

```typescript
// Get all published blog posts
const posts = await BlogPost.find({ status: 'published' });
const slugs = posts.map(post => post.slug);

// Submit all at once
await indexNowService.submitBlogPosts(slugs);
```

## Resources

- **Official Documentation:** https://www.indexnow.org/documentation
- **FAQ:** https://www.indexnow.org/faq
- **Bing Webmaster Tools:** https://www.bing.com/webmasters
- **Yandex Webmaster:** https://webmaster.yandex.com/

## Support

For issues or questions:
1. Check this documentation
2. Review console logs for errors
3. Verify environment variables are set
4. Test with manual API submission
5. Check search engine webmaster tools

---

**Last Updated:** October 2025
**Version:** 1.0.0
