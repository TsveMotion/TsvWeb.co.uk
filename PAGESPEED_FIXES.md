# 🚀 PageSpeed Optimization Fixes - Get to 90+

## Current Score: 85/100 Mobile
**Target: 90+ Mobile**

---

## 🔴 Critical Issues (Fix These First)

### 1. **Render-Blocking CSS** (Est. savings: 460ms)
**Problem:** CSS files are blocking initial render
- `d93a03526f173932.css` - 14.2 KiB - 480ms
- `7cca8e2c5137bd71.css` - 1.2 KiB - 180ms

**Fix: Inline Critical CSS**

Create `src/app/critical.css`:
```css
/* Critical above-fold styles only */
body {
  font-family: var(--font-inter);
  margin: 0;
  padding: 0;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

/* Add only styles needed for above-fold content */
```

Then in `src/app/layout.tsx`:
```tsx
import criticalStyles from './critical.css?inline'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Inline critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: criticalStyles }} />
        
        {/* Preload fonts */}
        <link
          rel="preload"
          href="/fonts/inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Alternative Quick Fix:**
Add to `next.config.js`:
```js
module.exports = {
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },
}
```

---

### 2. **Largest Contentful Paint: 4.3s** (Needs < 2.5s)
**Problem:** LCP element is the H1 heading with 2,120ms render delay

**Element:**
```html
<h1 class="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight text-gray-9…">
  Get More Customers Online in Birmingham
</h1>
```

**Fix A: Optimize Font Loading**

In `src/app/layout.tsx`:
```tsx
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // ✅ Already have this
  preload: true,
  variable: '--font-inter',
  // Add these:
  adjustFontFallback: true, // Reduce layout shift
  fallback: ['system-ui', 'arial'], // Faster fallback
})
```

**Fix B: Preload LCP Image (if hero has background)**

If you have a hero image, add to `<head>`:
```tsx
<link
  rel="preload"
  as="image"
  href="/images/hero.jpg"
  fetchpriority="high"
/>
```

**Fix C: Remove Render-Blocking Scripts**

Move Google Tag Manager to load after page interactive:
```tsx
// In layout.tsx
import Script from 'next/script'

<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-8EWS5EDT81"
  strategy="afterInteractive" // Changed from default
/>
```

---

### 3. **Legacy JavaScript** (12 KiB wasted)
**Problem:** Transpiling code for old browsers unnecessarily

**Fix: Update Browserslist**

Create `.browserslistrc`:
```
> 0.5%
last 2 versions
not dead
not IE 11
```

Or add to `package.json`:
```json
{
  "browserslist": [
    "> 0.5%",
    "last 2 versions",
    "not dead",
    "not IE 11"
  ]
}
```

**Update `next.config.js`:**
```js
module.exports = {
  swcMinify: true, // Use SWC instead of Babel
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Target modern browsers
  experimental: {
    browsersListForSwc: true,
  },
}
```

---

### 4. **Unused JavaScript** (77 KiB wasted)
**Problem:**
- Google Tag Manager: 54.5 KiB unused
- `1851-51a1bc6137694f1d.js`: 22.2 KiB unused

**Fix A: Lazy Load Google Tag Manager**

Replace current GTM implementation with:
```tsx
// src/components/analytics/GTM.tsx
'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function GTM() {
  useEffect(() => {
    // Only load after user interaction
    const loadGTM = () => {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      })
    }

    // Load on first interaction
    const events = ['mousedown', 'touchstart', 'scroll']
    const handler = () => {
      loadGTM()
      events.forEach(e => window.removeEventListener(e, handler))
    }
    
    events.forEach(e => window.addEventListener(e, handler, { passive: true }))

    // Or load after 3 seconds
    const timeout = setTimeout(loadGTM, 3000)
    
    return () => {
      clearTimeout(timeout)
      events.forEach(e => window.removeEventListener(e, handler))
    }
  }, [])

  return (
    <Script
      src="https://www.googletagmanager.com/gtag/js?id=G-8EWS5EDT81"
      strategy="lazyOnload"
    />
  )
}
```

**Fix B: Dynamic Import Heavy Components**

Find large components and lazy load them:
```tsx
// Instead of:
import HeavyComponent from './HeavyComponent'

// Use:
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Don't render on server if not needed
})
```

---

### 5. **Unused CSS** (12 KiB wasted)
**Problem:** Tailwind CSS includes unused classes

**Fix: Purge Unused CSS**

Update `tailwind.config.js`:
```js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Add safelist for dynamic classes
  safelist: [
    'text-blue-600',
    'bg-blue-500',
    // Add any dynamically generated classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## 🟡 Secondary Optimizations

### 6. **Optimize Images**
Even though not flagged, always optimize:

```tsx
// Use Next.js Image component everywhere
import Image from 'next/image'

<Image
  src="/images/hero.jpg"
  alt="Web design Birmingham"
  width={1200}
  height={600}
  priority // For above-fold images
  quality={85} // Reduce from default 100
  placeholder="blur" // Add blur placeholder
/>

// For below-fold images:
<Image
  src="/images/feature.jpg"
  alt="Feature"
  width={800}
  height={600}
  loading="lazy"
  quality={80}
/>
```

### 7. **Enable Compression**

Add to `next.config.js`:
```js
module.exports = {
  compress: true, // Enable gzip compression
  
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|woff2)',
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

### 8. **Preconnect to Required Origins**

Add to `<head>` in `layout.tsx`:
```tsx
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="dns-prefetch" href="https://www.google-analytics.com" />
```

---

## 🔧 Complete next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification
  swcMinify: true,
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable compression
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true,
    browsersListForSwc: true,
  },
  
  // Headers for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|gif|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(js|css)',
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

module.exports = nextConfig
```

---

## 📊 Expected Results After Fixes

### Before:
- **Performance:** 85
- **LCP:** 4.3s
- **FCP:** 0.9s
- **TBT:** 10ms
- **CLS:** 0

### After (Target):
- **Performance:** 90-95
- **LCP:** < 2.5s (target: 2.0s)
- **FCP:** < 0.9s (already good)
- **TBT:** < 10ms (already good)
- **CLS:** 0 (perfect!)

---

## ✅ Implementation Checklist

### **Do These First (30 minutes):**

1. **Fix Render-Blocking CSS**
   - [ ] Add `optimizeCss: true` to next.config.js
   - [ ] Preload critical fonts in `<head>`

2. **Optimize Font Loading**
   - [ ] Add `adjustFontFallback: true` to Inter font config
   - [ ] Add fallback fonts

3. **Lazy Load Google Tag Manager**
   - [ ] Change GTM script to `strategy="lazyOnload"`
   - [ ] Or implement lazy loading on interaction

4. **Update Browserslist**
   - [ ] Create `.browserslistrc` file
   - [ ] Remove IE 11 support

5. **Enable Compression**
   - [ ] Add `compress: true` to next.config.js
   - [ ] Add caching headers

### **Do These Next (1 hour):**

6. **Optimize All Images**
   - [ ] Replace any `<img>` with `<Image>`
   - [ ] Add `priority` to hero images
   - [ ] Add `loading="lazy"` to below-fold images
   - [ ] Reduce quality to 85 for hero, 80 for others

7. **Dynamic Import Heavy Components**
   - [ ] Find components > 50KB
   - [ ] Convert to dynamic imports

8. **Purge Unused CSS**
   - [ ] Update Tailwind config content paths
   - [ ] Remove unused custom CSS

### **Test After Each Change:**

```bash
# Build production version
npm run build

# Test locally
npm start

# Then test on PageSpeed Insights
# https://pagespeed.web.dev/?url=https://tsvweb.com
```

---

## 🎯 Priority Order

1. **Render-blocking CSS** → +5-10 points
2. **Lazy load GTM** → +3-5 points
3. **Optimize fonts** → +2-3 points
4. **Update browserslist** → +1-2 points
5. **Enable compression** → +1-2 points

**Total Expected Improvement: +12-22 points**
**New Score: 97-107 → Capped at 100** ✅

---

## 🚨 Common Mistakes to Avoid

1. ❌ Don't remove GTM completely (you need analytics)
2. ❌ Don't inline ALL CSS (only critical above-fold)
3. ❌ Don't lazy load everything (hero needs priority)
4. ❌ Don't over-optimize images (balance quality vs size)
5. ❌ Don't forget to test after each change

---

## 📞 Quick Commands

```bash
# Build and analyze bundle
npm run build
npm run analyze # If you have bundle analyzer

# Test production locally
npm run build && npm start

# Check bundle sizes
du -sh .next/static/chunks/*

# Clear Next.js cache
rm -rf .next
```

---

## 🎉 Success Criteria

You'll know you're done when:
- ✅ PageSpeed mobile score: 90+
- ✅ LCP: < 2.5s
- ✅ FCP: < 1.0s
- ✅ TBT: < 50ms
- ✅ CLS: < 0.1
- ✅ All Core Web Vitals in green

---

**Start with the checklist above. Each fix is independent, so you can implement them one at a time and test.**

**After implementing all fixes, re-run PageSpeed Insights and you should see 90-95 score!** 🚀
