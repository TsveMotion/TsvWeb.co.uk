# IndexNow Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Generate Key
```bash
# Run this command to generate a random key:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Add to Environment
Create/edit `.env.local`:
```env
INDEXNOW_KEY=your_generated_key_here
SITE_URL=https://tsvweb.com
```

### Step 3: Deploy
```bash
npm run build
npm start
```

### Step 4: Verify
Visit: `https://tsvweb.com/{your-key}.txt`

Should display your key ✅

---

## 📝 What Happens Automatically

When you create, update, or delete a **published** blog post:
- ✅ URL is automatically submitted to Bing, Yandex, and other search engines
- ✅ Search engines are notified within seconds
- ✅ Faster indexing compared to waiting for crawlers

---

## 🔧 Manual Submission (Optional)

### Via API:
```bash
curl -X POST https://tsvweb.com/api/indexnow \
  -H "Content-Type: application/json" \
  -d '{"url": "https://tsvweb.com/blog/my-post"}'
```

### Via Code:
```typescript
import { indexNowService } from '@/services/indexnow-service';

await indexNowService.submitBlogPost('my-post-slug');
```

---

## ✅ Verification Checklist

- [ ] `INDEXNOW_KEY` set in `.env.local`
- [ ] `SITE_URL` set in `.env.local`
- [ ] Key file accessible at `https://tsvweb.com/{key}.txt`
- [ ] Blog post creation triggers submission (check logs)
- [ ] No 403/422 errors in console

---

## 📊 Check Logs

Look for these messages in your console:

**Success:**
```
📤 Submitting 1 URL(s) to IndexNow...
✅ Successfully submitted to 1 search engine(s)
```

**Error (non-breaking):**
```
❌ IndexNow submission failed: [details]
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| 403 Forbidden | Check key file exists in `public/` directory |
| 422 Unprocessable | Verify URL belongs to your domain |
| 429 Too Many Requests | Reduce submission frequency |
| Key not found | Restart application to generate key file |

---

## 📚 Full Documentation

See [INDEXNOW_SETUP.md](./INDEXNOW_SETUP.md) for complete guide.

---

**Need Help?** Check console logs and verify environment variables.
