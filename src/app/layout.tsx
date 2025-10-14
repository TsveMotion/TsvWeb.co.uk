import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import NextAuthSessionProvider from '@/components/session-provider'
import React from 'react'
import TsvAIWrapper from '@/components/TsvAIWrapper'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://tsvweb.com'),
  title: 'Web Design Birmingham | Get 3x More Leads in 30 Days | TsvWeb',
  description: 'Professional web design Birmingham from £30/month. Get 3x more leads, rank #1 on Google, mobile-ready in 48 hours. Trusted by 500+ Birmingham businesses. Free quote + SEO checklist today!',
  keywords: 'web design Birmingham, Birmingham web design, website design Birmingham, affordable web design Birmingham, SEO Birmingham, Birmingham web developer, local SEO Birmingham, mobile website design Birmingham, e-commerce Birmingham, restaurant website Birmingham',
  icons: {
    icon: '/TsvWeb_Favicon.png',
    apple: '/TsvWeb_Favicon.png',
  },
  alternates: {
    canonical: 'https://tsvweb.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tsvweb.com',
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
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TsvWeb - Web Design Birmingham",
    "alternateName": "TsvWeb Birmingham Web Developer",
    "description": "Professional web design services in Birmingham from £30/month. Expert web developer creating SEO-optimised, mobile-ready websites for Birmingham businesses.",
    "url": "https://tsvweb.com",
    "telephone": "+44-7444-358808",
    "email": "hello@tsvweb.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Birmingham",
      "addressRegion": "West Midlands",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 52.4862,
      "longitude": -1.8904
    },
    "openingHours": "Mo-Fr 09:00-18:00",
    "priceRange": "£30-£500",
    "currenciesAccepted": "GBP",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
    "areaServed": [
      {"@type": "City", "name": "Birmingham"},
      {"@type": "City", "name": "Solihull"},
      {"@type": "City", "name": "Sutton Coldfield"},
      {"@type": "City", "name": "Edgbaston"},
      {"@type": "Region", "name": "West Midlands"}
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "GBP",
      "lowPrice": "30",
      "highPrice": "500",
      "offerCount": "8"
    },
    "sameAs": [
      "https://twitter.com/tsvweb",
      "https://linkedin.com/company/tsvweb",
      "https://facebook.com/tsvweb",
      "https://instagram.com/tsvweb"
    ]
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <NextAuthSessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <TsvAIWrapper />
          </ThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
