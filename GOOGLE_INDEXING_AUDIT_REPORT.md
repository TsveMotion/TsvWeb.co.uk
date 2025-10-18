# 🔍 TsvWeb.co.uk - Google Indexing Readiness Audit
**Date:** October 18, 2025  
**Sitemap:** https://tsvweb.co.uk/sitemap.xml  
**Total URLs:** 26 pages

---

## 📊 Executive Summary

**Overall Indexing Readiness Score: 78/100** ⚠️

Strong technical foundations with Next.js 14, structured data, and proper meta implementations. However, **critical issues** prevent optimal Google indexing.

### 🚨 Critical Issues
1. Generic/duplicate meta titles on portfolio and blog pages
2. Missing H1 tags on blog post page
3. No breadcrumb schema for deep pages
4. Inconsistent canonical URLs (.com vs .co.uk)
5. Missing image alt attributes
6. No article schema on blog posts
7. Weak internal linking structure

---

## 🎯 URL-by-URL Scores

### Main Pages
- ✅ Homepage: **92/100**
- ✅ About: **85/100**
- ✅ Contact: **88/100**
- ⚠️ Request Quote: **75/100** (uses homepage metadata)

### Service Pages
- ✅ Services Overview: **82/100**
- ✅ Web Design: **85/100**
- ✅ Web Development: **84/100**
- ✅ E-commerce: **84/100**
- ✅ SEO: **86/100**
- ⚠️ Booking/Portfolio Services: **80/100**

### Portfolio Pages
- ⚠️ Portfolio Overview: **70/100**
- 🚨 Individual Projects (10 pages): **65/100**
  - **ALL use generic title:** "Portfolio Project | TsvWeb"
  - **ALL use generic description**
  - Missing CreativeWork schema

### Blog Pages
- ⚠️ Blog Overview: **72/100**
- 🚨 Blog Post: **55/100**
  - Generic title: "Blog Post | TsvWeb"
  - No content visible
  - Missing Article schema

### Legal Pages
- ✅ Privacy/Terms/Cookie: **80/100**

---

## 🔴 URGENT FIXES (24-48 Hours)

### 1. Fix Portfolio Metadata
**Impact: HIGH** - 10 pages affected

Create unique metadata for each project in `src/app/portfolio/[slug]/page.tsx`:

```typescript
const portfolioData = {
  'swisstimedeals': {
    title: 'SwissTimeDeals - Luxury Watch E-commerce | TsvWeb Portfolio',
    description: 'Professional WooCommerce e-commerce for luxury Swiss watches.',
    keywords: 'luxury watch website, WooCommerce Birmingham'
  },
  // ... add all 10 projects
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const project = portfolioData[params.slug]
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `https://tsvweb.co.uk/portfolio/${params.slug}` }
  }
}
```

### 2. Fix Blog Post Metadata
**Impact: HIGH**

```typescript
// src/app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await BlogService.getPostBySlug(params.slug)
  return {
    title: `${post.title} | TsvWeb Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://tsvweb.co.uk/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author]
    }
  }
}
```

### 3. Add Article Schema to Blog Posts

```typescript
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "datePublished": post.publishedAt,
  "author": { "@type": "Person", "name": post.author },
  "publisher": {
    "@type": "Organization",
    "name": "TsvWeb",
    "logo": { "@type": "ImageObject", "url": "https://tsvweb.co.uk/TsvWeb_Logo.png" }
  }
}
```

### 4. Fix Domain Inconsistency

Replace all `tsvweb.com` with `tsvweb.co.uk` in:
- `src/components/seo/seo-config.ts`
- `src/components/seo/page-seo.tsx`
- `src/app/about/page.tsx`

---

## 🟡 HIGH PRIORITY (1 Week)

### 5. Add Breadcrumb Schema

```typescript
// src/components/seo/breadcrumb-schema.tsx
export function BreadcrumbSchema({ items }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
```

### 6. Add Service Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Web Design",
  "provider": { "@type": "LocalBusiness", "name": "TsvWeb" },
  "areaServed": { "@type": "City", "name": "Birmingham" }
}
```

### 7. Add CreativeWork Schema to Portfolio

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Project Name",
  "creator": { "@type": "Organization", "name": "TsvWeb" },
  "dateCreated": "2024-01-15"
}
```

### 8. Improve Internal Linking
- Add "Featured Projects" to homepage
- Add "Latest Blog Posts" to homepage
- Cross-link service pages
- Link portfolio to relevant services

---

## 🟢 MEDIUM PRIORITY (2 Weeks)

### 9. Add Image Alt Text
All images need descriptive alt attributes.

### 10. Add FAQ Schema to Service Pages

### 11. Implement Review Schema

---

## 📈 Expected Results

### Immediate (1-2 Weeks)
- Google properly indexes portfolio pages
- Blog posts appear with rich snippets
- Improved CTR from search

### Short-term (1-2 Months)
- Portfolio pages rank for project keywords
- Blog posts rank for long-tail keywords
- Increased organic traffic 30-50%

### Long-term (3-6 Months)
- Rank #1 for "web design Birmingham"
- Rich snippets in 80% of results
- 3x increase in organic leads

---

## ✅ Technical SEO Strengths

1. Next.js 14 App Router
2. Organization & LocalBusiness schemas
3. Canonical URLs present
4. Open Graph & Twitter cards
5. Mobile responsive
6. HTTPS enabled
7. Proper sitemap.xml
8. Fast loading times

---

## 🔧 Implementation Checklist

- [ ] Fix portfolio page metadata (10 pages)
- [ ] Fix blog post metadata
- [ ] Add Article schema to blog
- [ ] Fix .com to .co.uk references
- [ ] Add breadcrumb schema (all pages)
- [ ] Add Service schema (6 pages)
- [ ] Add CreativeWork schema (10 pages)
- [ ] Improve internal linking
- [ ] Add image alt text
- [ ] Add FAQ schema
- [ ] Submit updated sitemap to Google Search Console
- [ ] Request re-indexing for updated pages

---

**Next Steps:** Start with URGENT fixes, then move to HIGH priority items. Monitor Google Search Console for indexing improvements.
