# Fresh Start Deployment: tsvweb.co.uk

## 🎯 Strategy: CLEAN SLATE

**IMPORTANT:** We are NOT migrating from tsvweb.com. The .com domain is heavily spammed with 43K+ fake pages. We want a **completely fresh start** with tsvweb.co.uk.

---

## ✅ What's Already Done

1. ✅ All code references updated to tsvweb.co.uk
2. ✅ Sitemap.xml uses tsvweb.co.uk URLs
3. ✅ Robots.txt configured for tsvweb.co.uk
4. ✅ Metadata and schema updated
5. ✅ NO 301 redirects (we want separate domains)

---

## 🚀 Deployment Steps

### Step 1: Create New GitHub Repository

**Option A: New Repository (Recommended)**
```bash
# Navigate to your project
cd c:\Users\tsvet\Documents\tsvweb\tsvweb

# Remove existing git remote (if any)
git remote remove origin

# Create new repo on GitHub: tsvweb-co-uk
# Then connect to new repo:
git remote add origin https://github.com/YOUR_USERNAME/tsvweb-co-uk.git
git branch -M main
git add .
git commit -m "Fresh start deployment for tsvweb.co.uk"
git push -u origin main
```

**Option B: New Branch in Existing Repo**
```bash
git checkout -b production-co-uk
git add .
git commit -m "Production deployment for tsvweb.co.uk"
git push -u origin production-co-uk
```

---

### Step 2: Create New Vercel Project

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Repository**
   - Select your new GitHub repo: `tsvweb-co-uk`
   - OR select existing repo and choose `production-co-uk` branch

3. **Configure Project**
   - **Project Name:** `tsvweb-co-uk`
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

4. **Environment Variables** (CRITICAL!)
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   NEXTAUTH_URL=https://tsvweb.co.uk
   NEXTAUTH_SECRET=your_secret_key_min_32_chars
   AUTH_SECRET=your_auth_secret
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Admin Credentials
   ADMIN_EMAIL=kristiyan@tsvweb.com
   ADMIN_PASSWORD=your_secure_password
   ADMIN_NAME=Kristiyan
   
   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=hello@mail.tsvweb.com
   
   # Uptime Kuma (Optional)
   UPTIME_KUMA_URL=your_uptime_kuma_url
   UPTIME_KUMA_API_KEY=your_api_key
   
   # Google Analytics (Optional)
   GOOGLE_ANALYTICS_PROPERTY_ID=your_property_id
   GOOGLE_ANALYTICS_CLIENT_EMAIL=your_service_account_email
   GOOGLE_ANALYTICS_PRIVATE_KEY=your_private_key
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - You'll get a URL like: `tsvweb-co-uk.vercel.app`

---

### Step 3: Configure Custom Domain

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add domain: `tsvweb.co.uk`
   - Add domain: `www.tsvweb.co.uk`

2. **DNS Configuration**
   
   **For tsvweb.co.uk (Root Domain):**
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21` (Vercel IP)
   
   **For www.tsvweb.co.uk:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

3. **Wait for DNS Propagation**
   - Usually takes 5-30 minutes
   - Check: https://dnschecker.org

4. **Verify SSL Certificate**
   - Vercel automatically provisions SSL
   - Wait for "Valid Configuration" status

---

## 🔒 What to Do with tsvweb.com

### Option 1: Let It Die (Recommended)
- **Action:** Do nothing, let domain expire
- **Pros:** Clean break, no association with spam
- **Cons:** Lose any legitimate traffic
- **Timeline:** Domain expires, spam disappears from Google

### Option 2: Redirect to Homepage Only
- **Action:** Simple redirect to tsvweb.co.uk homepage
- **Implementation:** In .com hosting, add redirect
- **Pros:** Captures some legitimate traffic
- **Cons:** Might transfer some spam signals

### Option 3: Show "We've Moved" Page
- **Action:** Static HTML page on .com
- **Content:**
  ```html
  <!DOCTYPE html>
  <html>
  <head>
    <title>We've Moved - TsvWeb</title>
    <meta name="robots" content="noindex, nofollow">
  </head>
  <body>
    <h1>We've Moved!</h1>
    <p>TsvWeb is now at <a href="https://tsvweb.co.uk">tsvweb.co.uk</a></p>
    <p>Please update your bookmarks.</p>
  </body>
  </html>
  ```
- **Pros:** Informs legitimate visitors
- **Cons:** Keeps .com domain active

**Recommendation:** Option 1 or 3 (NOT Option 2 - no SEO redirect)

---

## 📊 SEO Strategy for Fresh Start

### 1. Google Search Console - NEW Property Only

**DO:**
- ✅ Create NEW property for tsvweb.co.uk
- ✅ Submit sitemap: `https://tsvweb.co.uk/sitemap.xml`
- ✅ Request indexing for key pages
- ✅ Monitor crawl stats

**DON'T:**
- ❌ Use "Change of Address" tool
- ❌ Link .com and .co.uk properties
- ❌ Submit .com sitemap anymore
- ❌ Request indexing for .com pages

### 2. Disavow Spam Backlinks (Optional)

If you want to be extra safe:
1. Download backlinks from .com in Search Console
2. Create disavow file for .co.uk property
3. Upload to prevent spam link association

### 3. Google Analytics - NEW Property

**Create Fresh GA4 Property:**
1. Go to Google Analytics
2. Create NEW property: "TsvWeb UK"
3. Add data stream: `https://tsvweb.co.uk`
4. Install new tracking code
5. **DO NOT** import data from .com property

### 4. Google Business Profile

**Update (Don't Create New):**
- Keep existing Google Business Profile
- Update website URL to `https://tsvweb.co.uk`
- This preserves your reviews and local rankings

---

## 🎯 SEO Advantages of Fresh Start

### 1. **Clean Slate**
- No spam association
- No negative SEO baggage
- Fresh crawl budget

### 2. **UK-Specific Domain**
- `.co.uk` signals UK business to Google
- Better local rankings in Birmingham
- Increased trust from UK customers

### 3. **No Spam Transfer**
- 43K fake pages stay on .com
- .co.uk starts with 0 spam
- Clean index from day 1

### 4. **Better Control**
- Fresh sitemap (only real pages)
- Clean robots.txt
- No inherited penalties

---

## 📋 Post-Deployment Checklist

### Day 1: Launch
- [ ] Vercel deployment successful
- [ ] Custom domain configured (tsvweb.co.uk)
- [ ] SSL certificate active (HTTPS working)
- [ ] Environment variables set correctly
- [ ] Test all critical pages load
- [ ] Test admin login works
- [ ] Test customer login works

### Week 1: SEO Setup
- [ ] Add tsvweb.co.uk to Google Search Console
- [ ] Submit sitemap to GSC
- [ ] Request indexing for homepage
- [ ] Request indexing for key service pages
- [ ] Create new Google Analytics property
- [ ] Update Google Business Profile
- [ ] Update social media links

### Week 2: Content & Marketing
- [ ] Publish 2-3 new blog posts
- [ ] Update email signatures
- [ ] Update business cards (if needed)
- [ ] Notify existing clients of new domain
- [ ] Update LinkedIn company page
- [ ] Update Twitter/X profile

### Month 1: Growth
- [ ] Monitor GSC for indexing progress
- [ ] Check for crawl errors
- [ ] Build 5-10 quality backlinks
- [ ] Get 5+ Google reviews
- [ ] Publish weekly blog content
- [ ] Monitor keyword rankings

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T:
1. **Don't redirect .com to .co.uk** (transfers spam)
2. **Don't use Change of Address tool** (links properties)
3. **Don't import .com analytics** (pollutes data)
4. **Don't keep .com sitemap active** (confuses Google)
5. **Don't link properties in GSC** (associates spam)

### ✅ DO:
1. **Treat .co.uk as brand new site**
2. **Build fresh backlinks**
3. **Create new content**
4. **Focus on quality over quantity**
5. **Monitor .co.uk separately**

---

## 📈 Expected Timeline

### Week 1-2: Indexing Begins
- Homepage indexed
- Key pages discovered
- Sitemap processed

### Month 1: Initial Rankings
- Brand name searches rank
- Long-tail keywords start appearing
- 10-20 pages indexed

### Month 2-3: Growth Phase
- Main keywords start ranking
- 50+ pages indexed
- Organic traffic increases

### Month 4-6: Established
- Competitive keywords ranking
- 100+ pages indexed
- Consistent organic traffic
- Better rankings than .com ever had

---

## 🎉 Success Metrics

### Short-term (1-2 months)
- ✅ 50+ pages indexed
- ✅ Homepage ranks for "TsvWeb"
- ✅ 5+ service pages ranking
- ✅ 100+ organic visitors/month

### Medium-term (3-6 months)
- ✅ 100+ pages indexed
- ✅ Ranking for "web design Birmingham"
- ✅ 500+ organic visitors/month
- ✅ 10+ quality backlinks

### Long-term (6-12 months)
- ✅ Top 10 for main keywords
- ✅ 1,000+ organic visitors/month
- ✅ 50+ quality backlinks
- ✅ Better rankings than .com ever achieved

---

## 🔧 Vercel Deployment Commands

### Initial Deploy
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Update Deployment
```bash
# Make changes to code
git add .
git commit -m "Update description"
git push

# Vercel auto-deploys on push to main branch
# Or manually deploy:
vercel --prod
```

---

## 📞 Support Resources

### Vercel
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Custom Domains Guide](https://vercel.com/docs/concepts/projects/domains)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

### Google
- [Search Console](https://search.google.com/search-console)
- [Analytics](https://analytics.google.com)
- [Business Profile](https://business.google.com)

---

## ✅ Final Checklist

Before going live:
- [x] Code updated for tsvweb.co.uk
- [x] NO 301 redirects from .com
- [ ] New GitHub repo created
- [ ] New Vercel project created
- [ ] Environment variables configured
- [ ] Custom domain added in Vercel
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] New Google Search Console property
- [ ] New Google Analytics property
- [ ] Google Business Profile updated
- [ ] Social media links updated

---

**Deployment Date:** October 18, 2025
**Strategy:** Fresh start - NO migration from .com
**Goal:** Clean, spam-free UK domain with better rankings

---

*This is a FRESH START, not a migration. Treat tsvweb.co.uk as a brand new website with zero connection to the spammed .com domain.*
