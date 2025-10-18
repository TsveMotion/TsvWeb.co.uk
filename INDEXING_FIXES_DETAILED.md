# 🛠️ Detailed Implementation Guide - Google Indexing Fixes

## 🔴 URGENT FIX #1: Portfolio Page Metadata

### Problem
All 10 portfolio pages use the same generic metadata:
- Title: "Portfolio Project | TsvWeb"
- Description: "View our portfolio of professional web design..."

### Solution
Create dynamic metadata for each portfolio project.

### File to Create/Update
`src/app/portfolio/[slug]/page.tsx`

```typescript
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Portfolio project data
const portfolioProjects = {
  'swisstimedeals': {
    title: 'SwissTimeDeals - Luxury Watch E-commerce Website',
    description: 'Professional WooCommerce e-commerce website for SwissTimeDeals, a luxury Swiss watch retailer. Custom design, secure payments, inventory management, and SEO optimization.',
    keywords: 'luxury watch website, WooCommerce development Birmingham, e-commerce website design, Swiss watches online store',
    category: 'E-commerce',
    technologies: ['WordPress', 'WooCommerce', 'PHP', 'MySQL'],
    liveUrl: 'https://SwissTimeDeals.com',
    completedDate: '2024-01-15',
    client: 'SwissTimeDeals',
    image: '/portfolio/swisstimedeals-og.jpg'
  },
  'statmandavies': {
    title: 'StatManDavies - Educational Platform for Statistics',
    description: 'Next.js educational platform for statistics study materials. Features student accounts, instant downloads, payment integration, and community feedback system.',
    keywords: 'educational website Birmingham, Next.js development, student platform, online learning',
    category: 'Education',
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'MongoDB'],
    liveUrl: 'https://statmandavies.tsvweb.com/',
    completedDate: '2024-02-20',
    client: 'StatManDavies',
    image: '/portfolio/statmandavies-og.jpg'
  },
  'tsvteach': {
    title: 'TsvTeach - Online Learning Management System',
    description: 'Custom learning management system built with modern web technologies. Course management, student tracking, and interactive lessons.',
    keywords: 'LMS Birmingham, learning management system, online education platform',
    category: 'Education',
    technologies: ['Next.js', 'React', 'Node.js'],
    liveUrl: 'https://tsvteach.com',
    completedDate: '2024-03-10',
    client: 'TsvTeach',
    image: '/portfolio/tsvteach-og.jpg'
  },
  'crevre': {
    title: 'Crevre - Creative Agency Portfolio Website',
    description: 'Modern portfolio website for creative agency showcasing projects and services with stunning visual design.',
    keywords: 'portfolio website Birmingham, creative agency website, modern web design',
    category: 'Portfolio',
    technologies: ['Next.js', 'React', 'Framer Motion'],
    liveUrl: 'https://crevre.com',
    completedDate: '2024-04-05',
    client: 'Crevre',
    image: '/portfolio/crevre-og.jpg'
  },
  'musclematrix': {
    title: 'MuscleMatrix - Fitness & Nutrition Platform',
    description: 'Comprehensive fitness platform with workout tracking, nutrition plans, and progress monitoring.',
    keywords: 'fitness website Birmingham, workout tracking app, nutrition platform',
    category: 'Health & Fitness',
    technologies: ['React', 'Node.js', 'MongoDB'],
    liveUrl: 'https://musclematrix.com',
    completedDate: '2024-05-12',
    client: 'MuscleMatrix',
    image: '/portfolio/musclematrix-og.jpg'
  },
  'tsvstock': {
    title: 'TsvStock - Stock Photography Platform',
    description: 'Stock photography marketplace with advanced search, licensing, and download management.',
    keywords: 'stock photo website, photography platform Birmingham, image marketplace',
    category: 'Media',
    technologies: ['Next.js', 'React', 'AWS S3'],
    liveUrl: 'https://tsvstock.com',
    completedDate: '2024-06-18',
    client: 'TsvStock',
    image: '/portfolio/tsvstock-og.jpg'
  },
  'trimslots': {
    title: 'TrimSlots - Booking System for Barbers',
    description: 'Online booking system for barber shops with calendar management, SMS reminders, and payment processing.',
    keywords: 'barber booking system Birmingham, appointment scheduling, salon software',
    category: 'Booking',
    technologies: ['React', 'Node.js', 'Stripe'],
    liveUrl: 'https://trimslots.com',
    completedDate: '2024-07-22',
    client: 'TrimSlots',
    image: '/portfolio/trimslots-og.jpg'
  },
  'ktsvmedia': {
    title: 'KtsvMedia - Digital Marketing Agency Website',
    description: 'Professional website for digital marketing agency showcasing services, case studies, and client testimonials.',
    keywords: 'marketing agency website Birmingham, digital marketing site, agency portfolio',
    category: 'Marketing',
    technologies: ['Next.js', 'React', 'Tailwind CSS'],
    liveUrl: 'https://ktsvmedia.com',
    completedDate: '2024-08-15',
    client: 'KtsvMedia',
    image: '/portfolio/ktsvmedia-og.jpg'
  },
  'quizzqquizzq': {
    title: 'QuizzQ - Interactive Quiz Platform',
    description: 'Engaging quiz platform with real-time scoring, leaderboards, and custom quiz creation tools.',
    keywords: 'quiz platform Birmingham, interactive quiz website, online quiz maker',
    category: 'Entertainment',
    technologies: ['React', 'Node.js', 'Socket.io'],
    liveUrl: 'https://quizzq.com',
    completedDate: '2024-09-10',
    client: 'QuizzQ',
    image: '/portfolio/quizzq-og.jpg'
  },
  'tsvweb': {
    title: 'TsvWeb - Our Own Portfolio Website',
    description: 'Our own portfolio and business website built with Next.js 14, showcasing our web design and development services.',
    keywords: 'web design Birmingham, TsvWeb portfolio, Next.js website',
    category: 'Portfolio',
    technologies: ['Next.js 14', 'React', 'Tailwind CSS', 'MongoDB'],
    liveUrl: 'https://tsvweb.co.uk',
    completedDate: '2024-10-01',
    client: 'TsvWeb',
    image: '/portfolio/tsvweb-og.jpg'
  }
}

// Generate metadata for each portfolio page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = portfolioProjects[params.slug as keyof typeof portfolioProjects]
  
  if (!project) {
    return {
      title: 'Project Not Found | TsvWeb Portfolio',
      description: 'This portfolio project could not be found.',
      robots: { index: false, follow: true }
    }
  }
  
  return {
    title: `${project.title} | TsvWeb Portfolio`,
    description: project.description,
    keywords: project.keywords,
    alternates: {
      canonical: `https://tsvweb.co.uk/portfolio/${params.slug}`,
    },
    openGraph: {
      title: `${project.title} | TsvWeb Portfolio`,
      description: project.description,
      url: `https://tsvweb.co.uk/portfolio/${params.slug}`,
      type: 'website',
      images: [{
        url: `https://tsvweb.co.uk${project.image}`,
        width: 1200,
        height: 630,
        alt: `${project.title} - Screenshot`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | TsvWeb Portfolio`,
      description: project.description,
      images: [`https://tsvweb.co.uk${project.image}`]
    }
  }
}

// Add structured data
export default function PortfolioProjectPage({ params }: { params: { slug: string } }) {
  const project = portfolioProjects[params.slug as keyof typeof portfolioProjects]
  
  if (!project) {
    notFound()
  }
  
  // CreativeWork Schema
  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `https://tsvweb.co.uk/portfolio/${params.slug}`,
    "name": project.title,
    "description": project.description,
    "creator": {
      "@type": "Organization",
      "name": "TsvWeb",
      "@id": "https://tsvweb.co.uk/#organization"
    },
    "dateCreated": project.completedDate,
    "image": {
      "@type": "ImageObject",
      "url": `https://tsvweb.co.uk${project.image}`,
      "width": 1200,
      "height": 630,
      "caption": project.title
    },
    "url": project.liveUrl,
    "keywords": project.keywords,
    "genre": project.category,
    "about": {
      "@type": "Thing",
      "name": project.category
    }
  }
  
  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://tsvweb.co.uk/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Portfolio",
        "item": "https://tsvweb.co.uk/portfolio"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": project.client,
        "item": `https://tsvweb.co.uk/portfolio/${params.slug}`
      }
    ]
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Rest of your component */}
    </>
  )
}
```

---

## 🔴 URGENT FIX #2: Blog Post Metadata

### Problem
Blog post uses generic "Blog Post | TsvWeb" title and has no content visible.

### Solution
Create dynamic metadata generation for blog posts.

### File to Create/Update
`src/app/blog/[slug]/page.tsx`

```typescript
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogService } from '@/services/blog-service'

// Generate metadata for blog posts
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const post = await BlogService.getPostBySlug(params.slug)
    
    if (!post || post.status !== 'Published') {
      return {
        title: 'Post Not Found | TsvWeb Blog',
        description: 'This blog post could not be found or is no longer available.',
        robots: { index: false, follow: true }
      }
    }
    
    return {
      title: `${post.title} | TsvWeb Blog`,
      description: post.excerpt || post.metaDescription || post.title,
      keywords: post.tags?.join(', '),
      alternates: {
        canonical: `https://tsvweb.co.uk/blog/${post.slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt || post.metaDescription,
        url: `https://tsvweb.co.uk/blog/${post.slug}`,
        type: 'article',
        publishedTime: post.publishedAt || post.createdAt,
        modifiedTime: post.updatedAt || post.publishedAt,
        authors: [post.author || 'TsvWeb Team'],
        tags: post.tags,
        images: [{
          url: post.featuredImage || 'https://tsvweb.co.uk/blog-default-og.jpg',
          width: 1200,
          height: 630,
          alt: post.title
        }]
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.metaDescription,
        images: [post.featuredImage || 'https://tsvweb.co.uk/blog-default-og.jpg']
      }
    }
  } catch (error) {
    console.error('Error generating blog metadata:', error)
    return {
      title: 'Blog Post | TsvWeb',
      description: 'Read our latest web design and SEO insights.',
      robots: { index: false, follow: true }
    }
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await BlogService.getPostBySlug(params.slug)
  
  if (!post || post.status !== 'Published') {
    notFound()
  }
  
  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://tsvweb.co.uk/blog/${post.slug}`,
    "headline": post.title,
    "description": post.excerpt || post.metaDescription,
    "image": {
      "@type": "ImageObject",
      "url": post.featuredImage || 'https://tsvweb.co.uk/blog-default.jpg',
      "width": 1200,
      "height": 630
    },
    "datePublished": post.publishedAt || post.createdAt,
    "dateModified": post.updatedAt || post.publishedAt || post.createdAt,
    "author": {
      "@type": "Person",
      "name": post.author || 'TsvWeb Team',
      "url": "https://tsvweb.co.uk/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TsvWeb",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tsvweb.co.uk/TsvWeb_Logo.png",
        "width": 1200,
        "height": 630
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://tsvweb.co.uk/blog/${post.slug}`
    },
    "keywords": post.tags?.join(', '),
    "articleSection": post.category,
    "wordCount": post.content?.split(' ').length || 0,
    "inLanguage": "en-GB"
  }
  
  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://tsvweb.co.uk/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://tsvweb.co.uk/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://tsvweb.co.uk/blog/${post.slug}`
      }
    ]
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Rest of your blog post component */}
    </>
  )
}
```

---

## 🔴 URGENT FIX #3: Fix Domain Inconsistency

### Files to Update

#### 1. `src/components/seo/seo-config.ts`
```typescript
// Line 7: Change from
canonical: 'https://tsvweb.com',

// To:
canonical: 'https://tsvweb.co.uk',

// Line 11: Change from
url: 'https://tsvweb.com',

// To:
url: 'https://tsvweb.co.uk',

// Line 17: Change from
url: 'https://tsvweb.com/images/og-image.jpg',

// To:
url: 'https://tsvweb.co.uk/images/og-image.jpg',
```

#### 2. `src/components/seo/page-seo.tsx`
```typescript
// Line 9: Change from
canonical: 'https://tsvweb.com',

// To:
canonical: 'https://tsvweb.co.uk',
```

#### 3. `src/app/about/page.tsx`
```typescript
// Line 83: Change from
canonical: 'https://tsvweb.com/about',

// To:
canonical: 'https://tsvweb.co.uk/about',

// Line 88: Change from
url: 'https://tsvweb.com/about',

// To:
url: 'https://tsvweb.co.uk/about',

// Line 92: Change from
url: 'https://tsvweb.com/images/og-about-wordpress-birmingham.jpg',

// To:
url: 'https://tsvweb.co.uk/images/og-about-wordpress-birmingham.jpg',

// Line 110: Change from
url: "https://tsvweb.com/about",

// To:
url: "https://tsvweb.co.uk/about",

// Line 114: Change from
url: "https://tsvweb.com",

// To:
url: "https://tsvweb.co.uk",

// Line 115: Change from
logo: "https://tsvweb.com/TsvWeb_Logo.png",

// To:
logo: "https://tsvweb.co.uk/TsvWeb_Logo.png",
```

---

## 🟡 HIGH PRIORITY: Add Breadcrumb Schema Component

### File to Create
`src/components/seo/breadcrumb-schema.tsx`

```typescript
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
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
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

### Usage Examples

```typescript
// Homepage
<BreadcrumbSchema items={[
  { name: 'Home', url: 'https://tsvweb.co.uk/' }
]} />

// Service page
<BreadcrumbSchema items={[
  { name: 'Home', url: 'https://tsvweb.co.uk/' },
  { name: 'Services', url: 'https://tsvweb.co.uk/services' },
  { name: 'Web Design', url: 'https://tsvweb.co.uk/services/web-design' }
]} />

// Portfolio project
<BreadcrumbSchema items={[
  { name: 'Home', url: 'https://tsvweb.co.uk/' },
  { name: 'Portfolio', url: 'https://tsvweb.co.uk/portfolio' },
  { name: 'SwissTimeDeals', url: 'https://tsvweb.co.uk/portfolio/swisstimedeals' }
]} />
```

---

## 🟡 HIGH PRIORITY: Add Service Schema to Service Pages

### File to Create
`src/components/seo/service-schema.tsx`

```typescript
interface ServiceSchemaProps {
  name: string
  description: string
  serviceType: string
  url: string
  priceRange?: string
  offers?: Array<{
    name: string
    price: string
    priceCurrency: string
    unitText?: string
  }>
}

export function ServiceSchema({ name, description, serviceType, url, priceRange, offers }: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": url,
    "serviceType": serviceType,
    "name": name,
    "description": description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "TsvWeb",
      "@id": "https://tsvweb.co.uk/#organization"
    },
    "areaServed": {
      "@type": "City",
      "name": "Birmingham",
      "containedIn": {
        "@type": "Country",
        "name": "United Kingdom"
      }
    },
    ...(priceRange && { "priceRange": priceRange }),
    ...(offers && {
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": `${name} Packages`,
        "itemListElement": offers.map(offer => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": offer.name
          },
          "price": offer.price,
          "priceCurrency": offer.priceCurrency,
          ...(offer.unitText && {
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": offer.price,
              "priceCurrency": offer.priceCurrency,
              "unitText": offer.unitText
            }
          })
        }))
      }
    })
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

### Usage in Service Pages

```typescript
// In services/web-design/page.tsx
<ServiceSchema
  name="Web Design Birmingham"
  description="Professional web design services for Birmingham businesses"
  serviceType="Web Design"
  url="https://tsvweb.co.uk/services/web-design"
  priceRange="£30-£500"
  offers={[
    { name: "Starter Design Package", price: "30", priceCurrency: "GBP", unitText: "per month" },
    { name: "Premium Design Package", price: "500", priceCurrency: "GBP", unitText: "one-time" }
  ]}
/>
```

---

## 📋 Testing Checklist

After implementing fixes:

- [ ] Test all portfolio pages have unique titles in browser tab
- [ ] Test blog posts have unique titles
- [ ] Validate structured data with Google Rich Results Test
- [ ] Check canonical URLs point to .co.uk
- [ ] Verify breadcrumbs appear in search results (after indexing)
- [ ] Test Open Graph tags with Facebook Debugger
- [ ] Validate sitemap.xml still works
- [ ] Submit updated sitemap to Google Search Console
- [ ] Request re-indexing for updated pages

---

## 🔍 Validation Tools

1. **Google Rich Results Test:** https://search.google.com/test/rich-results
2. **Schema Markup Validator:** https://validator.schema.org/
3. **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/
4. **Twitter Card Validator:** https://cards-dev.twitter.com/validator
5. **Google Search Console:** https://search.google.com/search-console

---

**Implementation Time Estimate:**
- Portfolio fixes: 2-3 hours
- Blog fixes: 1-2 hours
- Domain fixes: 30 minutes
- Breadcrumb schema: 1 hour
- Service schema: 1-2 hours
- **Total: 6-9 hours**
