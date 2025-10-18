import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import NextAuthSessionProvider from '@/components/session-provider'
import React from 'react'
import TsvAIWrapper from '@/components/TsvAIWrapper'
import GoogleAnalytics from '@/components/GoogleAnalytics'

// Optimize font loading for better LCP
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Prevent invisible text during font load
  preload: true,
  variable: '--font-inter',
  adjustFontFallback: true, // Reduce layout shift
  fallback: ['system-ui', 'arial'], // Faster fallback fonts
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://tsvweb.co.uk'),
  title: 'Web Design Birmingham | Get 3x More Leads in 30 Days | TsvWeb',
  description: 'Professional web design Birmingham from £30/month. Get 3x more leads, rank #1 on Google, mobile-ready in 48 hours. Trusted by 500+ Birmingham businesses. Free quote + SEO checklist today!',
  keywords: 'web design Birmingham, Birmingham web design, website design Birmingham, affordable web design Birmingham, SEO Birmingham, Birmingham web developer, local SEO Birmingham, mobile website design Birmingham, e-commerce Birmingham, restaurant website Birmingham',
  icons: {
    icon: '/TsvWeb_Favicon.png',
    apple: '/TsvWeb_Favicon.png',
  },
  alternates: {
    canonical: 'https://tsvweb.co.uk',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tsvweb.co.uk',
    siteName: 'TsvWeb',
    title: 'Web Design Birmingham | Get 3x More Leads in 30 Days | TsvWeb',
    description: 'Professional web design Birmingham from £30/month. Get 3x more leads, rank #1 on Google. Trusted by 500+ Birmingham businesses. Free quote today!',
    images: [
      {
        url: '/TsvWeb_Logo.png',
        width: 1200,
        height: 630,
        alt: 'TsvWeb - Professional Web Design Birmingham',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tsvweb',
    creator: '@tsvweb',
    title: 'Web Design Birmingham | Get 3x More Leads in 30 Days | TsvWeb',
    description: 'Professional web design Birmingham from £30/month. Get 3x more leads, rank #1 on Google. Trusted by 500+ Birmingham businesses.',
    images: ['/TsvWeb_Logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://tsvweb.co.uk/#organization",
    "name": "TsvWeb",
    "alternateName": "TsvWeb Birmingham Web Design",
    "url": "https://tsvweb.co.uk",
    "logo": {
      "@type": "ImageObject",
      "url": "https://tsvweb.co.uk/TsvWeb_Logo.png",
      "width": 1200,
      "height": 630
    },
    "description": "Professional web design and development agency in Birmingham specializing in SEO-optimized, mobile-responsive websites for local businesses.",
    "email": "hello@tsvweb.com",
    "telephone": "+447444358808",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Birmingham",
      "addressRegion": "West Midlands",
      "postalCode": "B44 9EB",
      "addressCountry": "GB"
    },
    "sameAs": [
      "https://twitter.com/tsvweb",
      "https://linkedin.com/company/tsvweb",
      "https://facebook.com/tsvweb",
      "https://instagram.com/tsvweb"
    ]
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://tsvweb.co.uk/#localbusiness",
    "name": "TsvWeb - Web Design Birmingham",
    "alternateName": "TsvWeb Birmingham Web Developer",
    "description": "Professional web design services in Birmingham from £30/month. Expert web developer creating SEO-optimised, mobile-ready websites for Birmingham businesses. Specializing in local SEO, e-commerce, and custom web development.",
    "url": "https://tsvweb.co.uk",
    "telephone": "+447444358808",
    "email": "hello@tsvweb.com",
    "image": "https://tsvweb.co.uk/TsvWeb_Logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "318 Shady Ln",
      "addressLocality": "Birmingham",
      "addressRegion": "West Midlands",
      "postalCode": "B44 9EB",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 52.4862,
      "longitude": -1.8904
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "£30-£500",
    "currenciesAccepted": "GBP",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Bank Transfer"],
    "areaServed": [
      {"@type": "City", "name": "Birmingham", "@id": "https://en.wikipedia.org/wiki/Birmingham"},
      {"@type": "City", "name": "Solihull"},
      {"@type": "City", "name": "Sutton Coldfield"},
      {"@type": "City", "name": "Edgbaston"},
      {"@type": "City", "name": "Erdington"},
      {"@type": "City", "name": "Kings Heath"},
      {"@type": "City", "name": "Moseley"},
      {"@type": "Region", "name": "West Midlands"}
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Web Design Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Web Design Birmingham",
            "description": "Custom web design services for Birmingham businesses"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "SEO Services Birmingham",
            "description": "Local SEO optimization for Birmingham businesses"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "E-commerce Development",
            "description": "Online store development and e-commerce solutions"
          }
        }
      ]
    },
    "knowsAbout": ["Web Design", "Web Development", "SEO", "Local SEO", "E-commerce", "WordPress", "React", "Next.js"],
    "slogan": "Get More Customers Online in Birmingham",
    "sameAs": [
      "https://twitter.com/tsvweb",
      "https://linkedin.com/company/tsvweb",
      "https://facebook.com/tsvweb",
      "https://instagram.com/tsvweb"
    ]
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://tsvweb.co.uk/#website",
    "url": "https://tsvweb.co.uk",
    "name": "TsvWeb - Web Design Birmingham",
    "description": "Professional web design Birmingham from £30/month. Get 3x more leads, rank #1 on Google. Trusted by 500+ Birmingham businesses.",
    "publisher": {
      "@id": "https://tsvweb.co.uk/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://tsvweb.co.uk/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-GB"
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://region1.google-analytics.com" />
      </head>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [organizationSchema, localBusinessSchema, websiteSchema]
          }) }}
        />
        <GoogleAnalytics />
        <NextAuthSessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <TsvAIWrapper />
          </ThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
