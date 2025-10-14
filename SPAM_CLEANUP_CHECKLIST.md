# 🎯 Spam URL Cleanup Checklist

## ✅ Implementation Complete

- [x] **404 Page with noindex** - `src/app/not-found.tsx`
- [x] **PageSEO noindex support** - `src/components/seo/page-seo.tsx`
- [x] **Spam URL redirects** - `next.config.js`
- [x] **Clean robots.txt** - `public/robots.txt`
- [x] **Clean sitemap** - `public/sitemap.xml`

---

## 📋 Google Search Console Actions

### **Do These NOW:**

- [ ] **1. Deploy to Production**
  ```bash
  git add .
  git commit -m "Add spam URL protection and 404 noindex"
  git push
  ```

- [ ] **2. Request Homepage Indexing**
  - Go to: https://search.google.com/search-console
  - URL Inspection → Enter: `https://tsvweb.com`
  - Click: "Request Indexing"

- [ ] **3. Request Sitemap Indexing**
  - URL Inspection → Enter: `https://tsvweb.com/sitemap.xml`
  - Click: "Request Indexing"

- [ ] **4. Resubmit Sitemap**
  - Sitemaps → Remove old sitemap (if present)
  - Add: `https://tsvweb.com/sitemap.xml`
  - Click: "Submit"

### **Optional (Speeds Up Cleanup):**

- [ ] **5. Add Temporary Removals**
  - Removals → "New Request"
  - Add patterns:
    - `https://tsvweb.com/Mixer*`
    - `https://tsvweb.com/Chevrolet*`
    - `https://tsvweb.com/Brake*`
    - `https://tsvweb.com/reviews/*`
    - Any other spam patterns you see

---

## 🧪 Testing (Do Before Deploying)

- [ ] **Test 404 Page**
  ```bash
  # Visit in browser
  https://tsvweb.com/fake-url-12345
  
  # Should show: 404 page
  # Should have: <meta name="robots" content="noindex, nofollow" />
  ```

- [ ] **Test Spam Redirects**
  ```bash
  # Visit in browser
  https://tsvweb.com/Mixer-test
  
  # Should redirect to: https://tsvweb.com/
  ```

- [ ] **Verify Sitemap**
  ```bash
  # Visit in browser
  https://tsvweb.com/sitemap.xml
  
  # Should contain: Only legitimate pages
  # Should have: <lastmod> timestamps
  ```

---

## 📅 Weekly Monitoring (Next 6 Weeks)

### **Week 1:**
- [ ] Check Search Console → Pages → Coverage
- [ ] Note current "Not indexed" count: _______
- [ ] Note current "Indexed" count: _______

### **Week 2:**
- [ ] Check coverage again
- [ ] Look for 404 errors (should be increasing - this is good!)
- [ ] Verify spam URLs are being marked as 404

### **Week 3:**
- [ ] Check "Not indexed" count (should be decreasing)
- [ ] Check "Indexed" count (should be stable or increasing)

### **Week 4:**
- [ ] Review coverage report
- [ ] Check if spam URLs moved to "Excluded" section

### **Week 6:**
- [ ] Final check - "Not indexed" should be minimal
- [ ] Celebrate clean index! 🎉

---

## 🚨 If You See More Spam URLs

1. **Identify the pattern:**
   - Example: `/product-name-123456`
   - Example: `/category/spam-item`

2. **Add to next.config.js:**
   ```javascript
   {
     source: '/pattern/:path*',
     destination: '/',
     permanent: true,
   }
   ```

3. **Redeploy and add to Removals**

---

## 📊 Success Indicators

✅ **Good signs:**
- 404 errors increasing (spam URLs being caught)
- "Not indexed" count decreasing
- "Indexed" pages are all legitimate
- Coverage issues decreasing

❌ **Bad signs:**
- "Not indexed" staying high after 4 weeks
- Legitimate pages showing as 404
- Sitemap not being crawled

**If you see bad signs:** Check `GOOGLE_SPAM_CLEANUP.md` troubleshooting section

---

## 🎯 Target Metrics (6 Weeks)

| Metric | Current | Target |
|--------|---------|--------|
| Indexed Pages | _____ | 50-100 (clean) |
| Not Indexed | _____ | 0-50 |
| 404 Errors | _____ | High (spam) |
| Coverage Issues | _____ | Low |

---

## 📞 Need Help?

See detailed guide: `GOOGLE_SPAM_CLEANUP.md`

**Key files:**
- Implementation: `src/app/not-found.tsx`
- Redirects: `next.config.js`
- Sitemap: `public/sitemap.xml`
- Robots: `public/robots.txt`
