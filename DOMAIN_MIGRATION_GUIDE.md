# Domain Migration Guide: tsvweb.com → tsvweb.co.uk

## ⚠️ CRITICAL WARNING - DO NOT USE THIS GUIDE!

**This guide is OBSOLETE and should NOT be followed.**

**Reason:** tsvweb.com is heavily spammed with 43K+ fake pages. Using 301 redirects would transfer this spam to tsvweb.co.uk.

**✅ USE THIS INSTEAD:** See `FRESH_START_DEPLOYMENT.md` for the correct approach.

---

## 🎯 Overview (OBSOLETE - DO NOT FOLLOW)
~~Complete guide for migrating TsvWeb from **tsvweb.com** to **tsvweb.co.uk** while preserving SEO rankings and maximizing search visibility.~~

**This approach would preserve spam rankings - NOT recommended!**

---

## ✅ Completed Technical Changes

### 1. **Sitemap Updated** ✓
- **File:** `public/sitemap.xml`
- **Change:** All URLs updated from `https://tsvweb.com/` to `https://tsvweb.co.uk/`
- **Impact:** Search engines will discover new domain URLs

### 2. **Robots.txt Updated** ✓
- **File:** `public/robots.txt`
- **Changes:**
  - Host: `https://tsvweb.co.uk`
  - Sitemap: `https://tsvweb.co.uk/sitemap.xml`
- **Impact:** Proper crawling instructions for new domain

### 3. **Metadata & Schema Updated** ✓
- **File:** `src/app/layout.tsx`
- **Changes:**
  - `metadataBase`: `https://tsvweb.co.uk`
  - Canonical URLs: `https://tsvweb.co.uk`
  - Open Graph URLs: `https://tsvweb.co.uk`
  - Organization Schema: All URLs updated
  - LocalBusiness Schema: All URLs updated
  - WebSite Schema: All URLs updated
- **Impact:** Proper metadata for social sharing and search engines

### 4. **301 Redirects Implemented** ✓
- **File:** `src/middleware.ts`
- **Implementation:** Automatic 301 redirects from tsvweb.com to tsvweb.co.uk
- **Code:**
```typescript
const hostname = request.headers.get('host') || ''
if (hostname.includes('tsvweb.com')) {
  const newUrl = new URL(request.url)
  newUrl.hostname = newUrl.hostname.replace('tsvweb.com', 'tsvweb.co.uk')
  return NextResponse.redirect(newUrl, { status: 301 })
}
```
- **Impact:** SEO-friendly permanent redirects preserve link equity

---

## 🚀 Deployment Checklist

### Before Deployment
- [ ] **DNS Setup**: Point tsvweb.co.uk to your hosting server
- [ ] **SSL Certificate**: Obtain SSL certificate for tsvweb.co.uk
- [ ] **Environment Variables**: Update `NEXTAUTH_URL` to `https://tsvweb.co.uk`
- [ ] **Test Build**: Run `npm run build` to ensure no errors

### During Deployment
1. **Deploy to Production**
   ```bash
   npm run build
   npm start
   ```

2. **Verify Both Domains Work**
   - Visit `https://tsvweb.com` → Should redirect to `https://tsvweb.co.uk`
   - Visit `https://tsvweb.co.uk` → Should load normally

3. **Test Critical Pages**
   - Homepage: `https://tsvweb.co.uk/`
   - Services: `https://tsvweb.co.uk/services/web-design`
   - Portfolio: `https://tsvweb.co.uk/portfolio`
   - Blog: `https://tsvweb.co.uk/blog`
   - Contact: `https://tsvweb.co.uk/contact`

---

## 📊 SEO Migration Steps (CRITICAL!)

### 1. Google Search Console (Day 1)
**Add New Property:**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property"
3. Enter `https://tsvweb.co.uk`
4. Verify ownership (DNS TXT record or HTML file)

**Submit Sitemap:**
1. In new property, go to "Sitemaps"
2. Submit: `https://tsvweb.co.uk/sitemap.xml`
3. Wait for indexing (1-7 days)

**Change of Address Tool:**
1. In OLD property (tsvweb.com), go to Settings
2. Click "Change of Address"
3. Select new property: tsvweb.co.uk
4. Verify 301 redirects are working
5. Submit change of address

**Expected Timeline:**
- Week 1: New domain appears in search results
- Week 2-4: Rankings transfer to new domain
- Month 2-3: Old domain fully replaced

### 2. Google Analytics (Day 1)
**Update Property:**
1. Go to [Google Analytics](https://analytics.google.com)
2. Admin → Property Settings
3. Update "Website URL" to `https://tsvweb.co.uk`

**Add New Stream (Optional):**
1. Create new GA4 data stream for tsvweb.co.uk
2. Update tracking code if needed

### 3. Google Business Profile (Day 1)
1. Go to [Google Business Profile](https://business.google.com)
2. Update website URL to `https://tsvweb.co.uk`
3. Update all citations with new domain

### 4. Bing Webmaster Tools (Day 2)
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add new site: `https://tsvweb.co.uk`
3. Submit sitemap: `https://tsvweb.co.uk/sitemap.xml`
4. Use "Site Move" tool to migrate from tsvweb.com

---

## 🔗 Update External References

### Social Media Profiles (Week 1)
- [ ] **Twitter/X**: Update website URL in bio
- [ ] **LinkedIn**: Update company website
- [ ] **Facebook**: Update page website
- [ ] **Instagram**: Update bio link

### Business Listings (Week 1-2)
- [ ] **Yell.com**: Update business listing
- [ ] **Yelp**: Update website URL
- [ ] **Trustpilot**: Update company profile
- [ ] **Local directories**: Update all Birmingham business listings

### Email Signatures (Day 1)
- [ ] Update all team email signatures with new domain
- [ ] Update automated email templates

### Marketing Materials
- [ ] **Business cards**: Order new cards with .co.uk domain
- [ ] **Brochures**: Update any printed materials
- [ ] **Invoices**: Update invoice templates

---

## 📧 Email Configuration

### Update Email Links
If using email addresses like `hello@tsvweb.com`:
- **Option 1**: Keep .com emails (recommended for continuity)
- **Option 2**: Migrate to `hello@tsvweb.co.uk`
  - Set up email forwarding from .com to .co.uk
  - Update all email signatures
  - Notify clients of new email addresses

### Environment Variables
Update these if using .co.uk emails:
```env
EMAIL_FROM=hello@tsvweb.co.uk
RESEND_FROM_EMAIL=hello@tsvweb.co.uk
```

---

## 🎯 SEO Best Practices

### 1. **Keep Old Domain Active**
- **Duration**: Minimum 6-12 months
- **Purpose**: Ensure all 301 redirects work
- **Action**: Keep tsvweb.com DNS and hosting active

### 2. **Monitor Rankings**
Track these keywords weekly:
- web design Birmingham
- Birmingham web design
- website design Birmingham
- SEO Birmingham
- Birmingham web developer

**Tools:**
- Google Search Console (Performance report)
- SEMrush / Ahrefs (if available)
- Manual Google searches

### 3. **Update Backlinks** (Ongoing)
**High-Priority Links:**
1. Client websites linking to you
2. Partner websites
3. Industry directories
4. Guest blog posts
5. Press releases

**How to Find Backlinks:**
- Google Search Console → Links
- Ahrefs / SEMrush backlink checker
- Manual search: `link:tsvweb.com`

**Outreach Template:**
```
Subject: Website URL Update - TsvWeb

Hi [Name],

We've recently migrated to a new domain: tsvweb.co.uk

Could you please update our link from:
OLD: https://tsvweb.com
NEW: https://tsvweb.co.uk

Thank you!
```

---

## 📈 Expected SEO Impact

### Best Case Scenario (With Proper Setup)
- **Week 1-2**: Minimal ranking fluctuation
- **Week 3-4**: Rankings stabilize on new domain
- **Month 2**: Full ranking recovery
- **Month 3+**: Potential ranking improvements (UK-focused domain)

### Potential Benefits of .co.uk Domain
1. **Better UK Geo-Targeting**: Google recognizes .co.uk as UK-specific
2. **Local Trust**: UK customers trust .co.uk domains more
3. **Competitive Advantage**: Stands out in Birmingham searches
4. **Brand Authority**: Professional UK business presence

### Monitoring Metrics
Track these weekly:
- [ ] Organic traffic (Google Analytics)
- [ ] Keyword rankings (Search Console)
- [ ] Indexed pages (Search Console)
- [ ] Crawl errors (Search Console)
- [ ] Backlink count (Search Console)

---

## ⚠️ Common Pitfalls to Avoid

### 1. **Don't Delete Old Domain**
- Keep tsvweb.com active for 6-12 months
- Maintain 301 redirects
- Monitor for any broken redirects

### 2. **Don't Change Content**
- Keep all URLs identical (e.g., `/services/web-design`)
- Don't redesign during migration
- Avoid major content changes for 2-3 months

### 3. **Don't Forget HTTPS**
- Ensure SSL certificate on new domain
- Force HTTPS redirects
- Update all internal links to HTTPS

### 4. **Don't Rush Backlink Updates**
- 301 redirects preserve link equity
- Update high-value links first
- Low-priority links can be updated over time

---

## 🛠️ Technical Verification

### Test 301 Redirects
```bash
# Test homepage redirect
curl -I https://tsvweb.com

# Should return:
# HTTP/1.1 301 Moved Permanently
# Location: https://tsvweb.co.uk/

# Test specific page
curl -I https://tsvweb.com/services/web-design

# Should return:
# HTTP/1.1 301 Moved Permanently
# Location: https://tsvweb.co.uk/services/web-design
```

### Verify Sitemap
1. Visit: `https://tsvweb.co.uk/sitemap.xml`
2. Verify all URLs use `https://tsvweb.co.uk/`
3. Check for XML errors

### Verify Robots.txt
1. Visit: `https://tsvweb.co.uk/robots.txt`
2. Verify sitemap URL: `https://tsvweb.co.uk/sitemap.xml`
3. Verify host: `https://tsvweb.co.uk`

### Test Schema Markup
1. Use [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Test URL: `https://tsvweb.co.uk`
3. Verify Organization and LocalBusiness schemas

---

## 📋 Week-by-Week Action Plan

### Week 1: Launch
- [x] Deploy code changes
- [ ] Verify 301 redirects working
- [ ] Add tsvweb.co.uk to Google Search Console
- [ ] Submit sitemap to GSC
- [ ] Update Google Analytics
- [ ] Update Google Business Profile
- [ ] Update social media profiles
- [ ] Send email to clients about new domain

### Week 2: Monitor & Optimize
- [ ] Check Search Console for crawl errors
- [ ] Monitor keyword rankings
- [ ] Verify indexed pages increasing
- [ ] Update Bing Webmaster Tools
- [ ] Update high-priority backlinks

### Week 3-4: Stabilization
- [ ] Continue monitoring rankings
- [ ] Update more backlinks
- [ ] Check for any redirect issues
- [ ] Update business listings

### Month 2-3: Optimization
- [ ] Analyze traffic patterns
- [ ] Update remaining backlinks
- [ ] Create content targeting UK keywords
- [ ] Build new UK-focused links

### Month 6: Review
- [ ] Compare rankings pre/post migration
- [ ] Analyze traffic changes
- [ ] Review backlink profile
- [ ] Consider retiring old domain (if stable)

---

## 🎉 Success Metrics

### Short-term (1-2 months)
- ✅ All pages indexed on new domain
- ✅ No significant ranking drops
- ✅ 301 redirects working perfectly
- ✅ Traffic maintained or increased

### Long-term (3-6 months)
- ✅ Rankings improved for UK searches
- ✅ Increased organic traffic
- ✅ Better conversion rates
- ✅ Stronger brand presence in Birmingham

---

## 📞 Support & Resources

### Google Resources
- [Google Search Console](https://search.google.com/search-console)
- [Change of Address Tool](https://support.google.com/webmasters/answer/9370220)
- [Site Move Guide](https://developers.google.com/search/docs/advanced/crawling/site-move-with-url-changes)

### Testing Tools
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### Monitoring Tools
- Google Search Console
- Google Analytics
- Bing Webmaster Tools

---

## 🚨 Emergency Rollback Plan

If major issues occur:

1. **Immediate Actions:**
   - Check server logs for errors
   - Verify DNS settings
   - Test 301 redirects manually

2. **Temporary Fix:**
   - Keep both domains active
   - Monitor Search Console for errors
   - Fix issues incrementally

3. **Communication:**
   - Notify team of issues
   - Update clients if necessary
   - Document all problems

---

## ✅ Final Checklist

Before going live:
- [x] All code changes deployed
- [x] 301 redirects implemented
- [x] Sitemap updated
- [x] Robots.txt updated
- [x] Schema markup updated
- [ ] DNS configured for new domain
- [ ] SSL certificate installed
- [ ] Environment variables updated
- [ ] Google Search Console setup
- [ ] Google Analytics updated
- [ ] Social media profiles updated
- [ ] Team notified
- [ ] Clients notified (if needed)

---

## 🎯 Expected Results

**Timeline for Full Migration:**
- **Week 1**: New domain indexed
- **Week 2-4**: Rankings transfer
- **Month 2**: Full recovery
- **Month 3+**: Improved UK rankings

**SEO Benefits:**
- Better UK geo-targeting
- Increased local trust
- Improved Birmingham rankings
- Professional UK brand image

---

**Migration Date:** October 18, 2025
**Status:** ✅ Technical changes complete, ready for deployment
**Next Steps:** Deploy to production and follow SEO migration checklist

---

*For questions or issues, refer to Google's official [Site Move Guide](https://developers.google.com/search/docs/advanced/crawling/site-move-with-url-changes)*
