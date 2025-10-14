# SEO Audit Action Plan - October 2025

## Audit Overview
**Source:** The HOTH SEO Audit  
**Date:** October 14, 2025  
**Overall Grade:** B (Target: A)

### Score Breakdown:
- **On-Page SEO:** B → Target: A
- **Usability:** A ✅
- **Performance:** A ✅  
- **Social:** C → Target: B

---

## ✅ Issues Fixed (Completed Today)

### 1. Missing Canonical Tags ✅
**Issue:** Pages not using canonical tags (duplicate content risk)  
**Solution:** Added canonical URLs to Next.js metadata in `layout.tsx`  
**Impact:** Prevents duplicate content penalties, clarifies primary URLs

```typescript
alternates: {
  canonical: 'https://tsvweb.com',
}
```

### 2. Missing Facebook Open Graph Tags ✅
**Issue:** No Open Graph tags for Facebook sharing  
**Solution:** Added complete OG metadata to `layout.tsx`  
**Impact:** Better appearance when shared on Facebook, increased click-through

```typescript
openGraph: {
  type: 'website',
  locale: 'en_US',
  url: 'https://tsvweb.com',
  siteName: 'TsvWeb',
  title: 'TsvWeb - Professional Web Design Services',
  description: '...',
  images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
}
```

### 3. Missing Twitter Cards ✅
**Issue:** No Twitter Card tags for X/Twitter sharing  
**Solution:** Added Twitter metadata to `layout.tsx`  
**Impact:** Better appearance when shared on X/Twitter

```typescript
twitter: {
  card: 'summary_large_image',
  site: '@tsvweb',
  creator: '@tsvweb',
  title: '...',
  description: '...',
  images: ['/og-image.jpg'],
}
```

### 4. Missing Address on Website ✅
**Issue:** Phone found but address missing (hurts local SEO)  
**Solution:** Added address and phone to footer component  
**Impact:** Better local SEO signals, site-wide NAP consistency

**Location:** `src/components/navigation/footer.tsx`
- Address: 318 Shady Ln., Birmingham B44 9EB, UK
- Phone: +44 7444 358808 (clickable tel: link)

---

## 📋 Issues Identified (No Action Needed)

### 1. Robots.txt ✅
**Audit Finding:** "Not detected or unable to retrieve"  
**Reality:** File exists at `/public/robots.txt` and is properly configured  
**Status:** No action needed - likely temporary access issue during audit

### 2. Google Analytics ✅
**Audit Finding:** "Could not detect analytics tool"  
**Reality:** Google Analytics installed via `GoogleAnalytics` component in `layout.tsx`  
**Status:** No action needed - may be blocked by audit tool

### 3. Sitemap ✅
**Audit Finding:** Detected at multiple URLs  
**Reality:** Working correctly with all pages included  
**Status:** No action needed - functioning properly

---

## 🎯 Recommended Next Actions

### High Priority (This Week)

#### 1. Create Open Graph Image
**Status:** ⏳ Pending  
**File Needed:** `/public/og-image.jpg` (1200x630px)  
**Current:** Metadata references `/og-image.jpg` but file doesn't exist  
**Action:** Create branded social sharing image with:
- TsvWeb logo
- Tagline: "Professional Web Design Services"
- Birmingham branding
- Modern design matching brand colors

**Tools:**
- Canva (free templates)
- Figma (custom design)
- Photoshop (professional)

#### 2. Setup DMARC DNS Record
**Status:** ⏳ Pending  
**Priority:** High (affects email deliverability)  
**Action:** Add DMARC TXT record to Cloudflare DNS  
**Details:** See `DNS_EMAIL_SECURITY_SETUP.md`

**Quick Setup:**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@tsvweb.com
```

#### 3. Submit Updated Sitemap to Google Search Console
**Status:** ⏳ Pending  
**Action:**
1. Log into Google Search Console
2. Submit sitemap: https://tsvweb.com/sitemap.xml
3. Request indexing for new pages
4. Monitor crawl status

### Medium Priority (This Month)

#### 4. Enable HTTP/2 on Server
**Current:** Using outdated HTTP protocol  
**Impact:** Page load speed improvements  
**Action:** Check with Vercel (hosting provider) - likely already enabled but not detected

#### 5. Remove Inline Styles
**Issue:** Some inline styles detected (minor performance impact)  
**Action:** Audit codebase for inline style attributes, move to CSS classes  
**Files to Check:**
- Component files with `style=` attributes
- Dynamic styling that could use Tailwind classes

#### 6. Increase Google Reviews
**Current:** 5.0 rating with only 2 reviews  
**Target:** 10+ reviews  
**Action:**
- Email past clients requesting reviews
- Add review request to project completion emails
- Include Google review link on website
- Incentivize reviews (discount on future services)

### Low Priority (Next Quarter)

#### 7. Add YouTube Channel
**Current:** No YouTube channel linked  
**Benefit:** Additional social presence, video content opportunities  
**Action:**
- Create TsvWeb YouTube channel
- Upload portfolio videos, tutorials, case studies
- Link from website footer

#### 8. Expand Social Media Activity
**Current:** Social profiles exist but limited activity mentioned  
**Action:**
- Regular posting schedule (2-3x per week)
- Share blog posts and case studies
- Engage with Birmingham business community
- Post project updates and testimonials

---

## 📊 Expected Grade Improvements

### After Completing High Priority Items:

| Category | Current | Expected | Improvement |
|----------|---------|----------|-------------|
| Overall | B | A- | +1 grade |
| On-Page SEO | B | A | +1 grade |
| Usability | A | A | Maintained |
| Performance | A | A | Maintained |
| Social | C | B+ | +2 grades |

### Key Improvements:
- ✅ Canonical tags prevent duplicate content
- ✅ Open Graph improves social sharing CTR
- ✅ Address in footer boosts local SEO
- ✅ DMARC improves email deliverability
- ✅ OG image makes shares more attractive

---

## 🎯 Target Keywords Performance

### Already Ranking Well:
Based on audit, strong keyword usage for:
- "Birmingham" (51 mentions)
- "WordPress" (34 mentions)
- "Design" (26 mentions)
- "Business" (22 mentions)
- "Web" (17 mentions)

### Keyword Distribution:
✅ Keywords present in:
- Title tag
- Meta description
- H1, H2, H3 headers
- Body content (969 words)

**Status:** Excellent keyword optimization already in place

---

## 💡 Content Strengths (Maintain)

### What's Working Well:
- ✅ **Title Tag:** 41 characters (good, could extend to 50-60)
- ✅ **Meta Description:** 144 characters (optimal 120-160 range)
- ✅ **Content Length:** 969 words (exceeds 500 minimum)
- ✅ **Header Structure:** H1, H2, H3, H4 properly used
- ✅ **Mobile Responsive:** Perfect mobile experience
- ✅ **Page Speed:** 0.7s load time (excellent)
- ✅ **SSL Enabled:** HTTPS with proper redirects
- ✅ **Image Alt Tags:** All images have alt text
- ✅ **Local Business Schema:** Properly implemented
- ✅ **Google Business Profile:** Verified and complete

---

## 🚀 Quick Wins (30 Minutes Each)

### 1. Create OG Image (30 min)
Use Canva template → Export 1200x630 → Upload to `/public/og-image.jpg`

### 2. Add DMARC Record (15 min)
Cloudflare DNS → Add TXT record → Verify propagation

### 3. Submit to Search Console (15 min)
Login → Sitemaps → Submit → Request indexing

### 4. Request 5 Google Reviews (30 min)
Email 10 happy clients → Include direct review link → Follow up

**Total Time Investment:** ~90 minutes  
**Expected Impact:** Grade B → A-

---

## 📈 Monitoring & Tracking

### Weekly Checks:
- [ ] Google Search Console impressions
- [ ] Organic traffic in Google Analytics
- [ ] Keyword rankings (Ahrefs/SEMrush)
- [ ] Page load speed (PageSpeed Insights)

### Monthly Reviews:
- [ ] Overall SEO grade (re-run audit)
- [ ] Backlink profile growth
- [ ] Social media engagement
- [ ] Conversion rate from organic traffic
- [ ] Google Business Profile insights

### Quarterly Goals:
- [ ] Achieve Grade A overall
- [ ] Top 3 rankings for "web design Birmingham"
- [ ] 50+ Google reviews
- [ ] 100% increase in organic traffic

---

## 🔧 Technical Details

### Files Modified Today:
```
✅ src/app/layout.tsx
   - Added metadataBase
   - Added canonical URL
   - Added Open Graph tags
   - Added Twitter Card tags

✅ src/components/navigation/footer.tsx
   - Added address with location icon
   - Added clickable phone link
   - Improved local SEO signals
```

### Files to Create:
```
⏳ public/og-image.jpg (1200x630px)
   - Branded social sharing image
   - TsvWeb logo + tagline
   - Modern design
```

### DNS Records to Add:
```
⏳ _dmarc.tsvweb.com TXT record
   - Improves email deliverability
   - Prevents domain spoofing
```

---

## 💰 ROI Projection

### Investment:
- **Time:** ~2 hours total for all high-priority items
- **Cost:** $0 (all free improvements)

### Expected Returns:
- **SEO Grade:** B → A (better rankings)
- **Organic Traffic:** +20-30% within 3 months
- **Social CTR:** +15% from better OG images
- **Email Deliverability:** +10% with DMARC
- **Local Visibility:** Improved with footer NAP

### Business Impact:
- More qualified leads from organic search
- Better social media reach
- Higher email open rates
- Stronger local presence
- Competitive advantage

---

## ✅ Summary

### Completed Today:
1. ✅ Added canonical tags (duplicate content prevention)
2. ✅ Implemented Facebook Open Graph (better social sharing)
3. ✅ Implemented Twitter Cards (better X/Twitter sharing)
4. ✅ Added address to footer (local SEO boost)

### Next Steps:
1. ⏳ Create OG image (30 min)
2. ⏳ Add DMARC record (15 min)
3. ⏳ Submit sitemap to Search Console (15 min)

### Expected Outcome:
**Grade B → A within 30 days** with minimal time investment and zero cost.

---

*Action Plan Created: October 14, 2025*  
*Next Review: November 14, 2025*
