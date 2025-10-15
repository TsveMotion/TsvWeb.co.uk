# ⚡ TsvWeb Performance Optimization Checklist

## 🎯 Goal: 90+ Mobile, 95+ Desktop on PageSpeed Insights

---

## 1️⃣ Image Optimization (Highest Impact)

### Current Status Check
- [ ] Run audit: Find all `<img>` tags in codebase
- [ ] Check image sizes (should be < 200KB each)
- [ ] Verify Next.js `<Image>` component usage

### Action Items

**Replace all `<img>` with Next.js `<Image>`:**
```tsx
// ❌ BEFORE (Bad)
<img src="/images/hero.jpg" alt="Web design Birmingham" />

// ✅ AFTER (Good)
import Image from 'next/image'
<Image 
  src="/images/hero.jpg" 
  alt="Web design Birmingham"
  width={1200} 
  height={600}
  priority // Only for above-fold images
  quality={85}
/>
```

**For below-fold images, add lazy loading:**
```tsx
<Image 
  src="/images/portfolio-item.jpg"
  alt="Portfolio example"
  width={800}
  height={600}
  loading="lazy" // Lazy load below-fold
  quality={80}
/>
```

**Optimize image files:**
- [ ] Compress all images with TinyPNG or ImageOptim
- [ ] Convert to WebP format where possible
- [ ] Resize images to exact display dimensions
- [ ] Target: < 100KB for hero images, < 50KB for thumbnails

---

## 2️⃣ Font Optimization

### Current Status
- [x] Using `next/font` for Google Fonts (Inter) ✅

### Additional Optimizations
```tsx
// In app/layout.tsx - already implemented
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Prevent invisible text
  preload: true,
  variable: '--font-inter'
})
```

**Add font preloading for critical fonts:**
```tsx
// In app/layout.tsx <head>
<link
  rel="preload"
  href="/fonts/custom-font.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

---

## 3️⃣ JavaScript Optimization

### Code Splitting
- [x] Using Next.js app router (automatic code splitting) ✅

### Dynamic Imports for Heavy Components
```tsx
// For components not needed immediately
import dynamic from 'next/dynamic'

const TsvAIWrapper = dynamic(() => import('@/components/TsvAIWrapper'), {
  ssr: false, // Don't render on server
  loading: () => <div>Loading...</div>
})
```

### Action Items
- [ ] Identify heavy components (charts, maps, chat widgets)
- [ ] Convert to dynamic imports
- [ ] Add loading states

---

## 4️⃣ CSS Optimization

### Current Status
- [x] Using Tailwind CSS (optimized by default) ✅

### Additional Optimizations
```js
// In tailwind.config.js - ensure purge is enabled
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // This removes unused CSS in production
}
```

**Remove unused CSS:**
- [ ] Audit for unused Tailwind classes
- [ ] Remove any custom CSS not being used
- [ ] Minimize inline styles

---

## 5️⃣ Third-Party Scripts

### Current Scripts Audit
- [x] Google Analytics (optimized) ✅
- [ ] Check for other third-party scripts

### Optimization Strategy
```tsx
// Load third-party scripts with Next.js Script component
import Script from 'next/script'

// In layout or page
<Script
  src="https://example.com/script.js"
  strategy="lazyOnload" // Load after page is interactive
/>
```

**Script Loading Strategies:**
- `beforeInteractive` - Critical scripts only
- `afterInteractive` - Most third-party scripts
- `lazyOnload` - Non-critical scripts (analytics, chat)

### Action Items
- [ ] Move Google Analytics to `lazyOnload`
- [ ] Defer non-critical scripts
- [ ] Remove unused scripts

---

## 6️⃣ Core Web Vitals Fixes

### Largest Contentful Paint (LCP) - Target: < 2.5s

**Common Issues & Fixes:**
1. **Large images above fold**
   - [ ] Use `priority` prop on hero images
   - [ ] Compress hero images to < 100KB
   - [ ] Use WebP format

2. **Slow server response**
   - [ ] Enable caching headers
   - [ ] Use CDN (Vercel Edge or Cloudflare)
   - [ ] Optimize API responses

3. **Render-blocking resources**
   - [ ] Inline critical CSS
   - [ ] Defer non-critical CSS
   - [ ] Use font-display: swap

### Cumulative Layout Shift (CLS) - Target: < 0.1

**Common Issues & Fixes:**
1. **Images without dimensions**
   - [ ] Add width/height to all images
   - [ ] Use aspect-ratio CSS

2. **Dynamic content**
   - [ ] Reserve space for ads/banners
   - [ ] Use skeleton loaders
   - [ ] Avoid inserting content above existing content

3. **Web fonts causing layout shift**
   - [x] Using font-display: swap ✅
   - [ ] Preload critical fonts

### First Input Delay (FID) / INP - Target: < 100ms

**Common Issues & Fixes:**
1. **Heavy JavaScript execution**
   - [ ] Break up long tasks
   - [ ] Use web workers for heavy computation
   - [ ] Defer non-critical JS

2. **Large bundles**
   - [ ] Code split with dynamic imports
   - [ ] Remove unused dependencies
   - [ ] Tree-shake libraries

---

## 7️⃣ Caching Strategy

### Browser Caching
```js
// In next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

### Static Asset Caching
- [ ] Set long cache times for images (1 year)
- [ ] Set long cache times for fonts (1 year)
- [ ] Set short cache times for HTML (1 hour)

---

## 8️⃣ Server-Side Optimizations

### Static Generation (Already Implemented)
- [x] Using app router with static generation ✅

### Add Revalidation for Dynamic Content
```tsx
// In page.tsx for pages that change occasionally
export const revalidate = 3600 // Revalidate every hour
```

### API Route Optimization
```tsx
// In API routes, add caching headers
export async function GET(request: Request) {
  const data = await fetchData()
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  })
}
```

---

## 9️⃣ Mobile Optimization

### Responsive Images
```tsx
<Image
  src="/images/hero.jpg"
  alt="Web design Birmingham"
  width={1200}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority
/>
```

### Touch Targets
- [ ] Ensure all buttons are at least 48x48px
- [ ] Add adequate spacing between clickable elements
- [ ] Test on real mobile devices

### Mobile-Specific Optimizations
- [ ] Reduce animations on mobile
- [ ] Simplify navigation for mobile
- [ ] Optimize form inputs for mobile

---

## 🔟 Monitoring & Testing

### Tools to Use

**1. PageSpeed Insights**
```
URL: https://pagespeed.web.dev
Test: https://tsvweb.com
Frequency: Weekly
Target: 90+ mobile, 95+ desktop
```

**2. Lighthouse (Chrome DevTools)**
```
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Run audit
4. Fix issues in order of impact
```

**3. WebPageTest**
```
URL: https://www.webpagetest.org
Test from: London, UK
Connection: 4G
```

**4. Real User Monitoring**
```
Use Google Analytics 4 to track:
- Page load times
- Core Web Vitals
- Bounce rate by page speed
```

---

## 📊 Performance Budget

### Set Limits
- **Total page size:** < 1MB
- **JavaScript:** < 300KB
- **CSS:** < 50KB
- **Images:** < 500KB total
- **Fonts:** < 100KB
- **LCP:** < 2.5s
- **FID/INP:** < 100ms
- **CLS:** < 0.1

### Monitor Weekly
- [ ] Check total page size
- [ ] Check bundle sizes
- [ ] Check Core Web Vitals
- [ ] Fix any regressions immediately

---

## ✅ Quick Wins (Do Today)

### 1. Hero Image Optimization (15 min)
- [ ] Compress homepage hero image
- [ ] Add `priority` prop to hero Image component
- [ ] Verify width/height are set

### 2. Lazy Load Below-Fold Images (30 min)
- [ ] Find all images below fold
- [ ] Add `loading="lazy"` prop
- [ ] Remove `priority` from non-hero images

### 3. Defer Third-Party Scripts (10 min)
- [ ] Move Google Analytics to `lazyOnload`
- [ ] Check for other third-party scripts
- [ ] Defer non-critical scripts

### 4. Add Missing Image Dimensions (20 min)
- [ ] Audit all images for width/height
- [ ] Add dimensions to prevent CLS
- [ ] Test on mobile

### 5. Enable Compression (5 min)
```js
// In next.config.js
module.exports = {
  compress: true, // Enable gzip compression
}
```

---

## 🎯 Week-by-Week Plan

### Week 1: Images
- [ ] Replace all `<img>` with `<Image>`
- [ ] Compress all images
- [ ] Add lazy loading
- [ ] Test: Should see 10-20 point improvement

### Week 2: JavaScript
- [ ] Dynamic import heavy components
- [ ] Remove unused dependencies
- [ ] Code split large bundles
- [ ] Test: Should see 5-10 point improvement

### Week 3: Fonts & CSS
- [ ] Optimize font loading
- [ ] Remove unused CSS
- [ ] Inline critical CSS
- [ ] Test: Should see 5 point improvement

### Week 4: Caching & CDN
- [ ] Set up caching headers
- [ ] Enable CDN (Vercel Edge)
- [ ] Add service worker
- [ ] Test: Should see 5-10 point improvement

---

## 🚨 Common Performance Killers

1. ❌ **Large unoptimized images** (biggest issue)
2. ❌ **Too many third-party scripts**
3. ❌ **Render-blocking CSS/JS**
4. ❌ **No caching headers**
5. ❌ **Large JavaScript bundles**
6. ❌ **Slow server response times**
7. ❌ **Layout shifts from dynamic content**
8. ❌ **Not using CDN**
9. ❌ **Unoptimized fonts**
10. ❌ **Too many HTTP requests**

---

## 📈 Expected Results

### Before Optimization (Typical)
- Mobile: 60-70
- Desktop: 80-85
- LCP: 3-4s
- CLS: 0.15-0.25

### After Optimization (Target)
- Mobile: 90-95
- Desktop: 95-100
- LCP: < 2.5s
- CLS: < 0.1
- FID/INP: < 100ms

### Timeline
- Week 1: 70-80 mobile
- Week 2: 80-85 mobile
- Week 3: 85-90 mobile
- Week 4: 90+ mobile ✅

---

## 🔧 Next.js Config Optimizations

```js
// next.config.js - Recommended settings
module.exports = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Enable SWC minification (faster)
  swcMinify: true,
  
  // Strict mode for better performance
  reactStrictMode: true,
  
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}
```

---

## ✅ Checklist Summary

### Critical (Do First)
- [ ] Replace all `<img>` with Next.js `<Image>`
- [ ] Compress all images to < 100KB
- [ ] Add `priority` to hero images
- [ ] Add lazy loading to below-fold images
- [ ] Defer third-party scripts

### Important (Do This Week)
- [ ] Dynamic import heavy components
- [ ] Remove unused dependencies
- [ ] Set up caching headers
- [ ] Optimize fonts
- [ ] Fix layout shifts

### Nice to Have (Do This Month)
- [ ] Add service worker
- [ ] Implement advanced caching
- [ ] Set up CDN
- [ ] Add performance monitoring
- [ ] Create performance budget alerts

---

**Remember:** Performance is SEO. Google ranks faster sites higher. Target 90+ on mobile!

**Last Updated:** 2025-10-15
**Next Audit:** Run PageSpeed test weekly
