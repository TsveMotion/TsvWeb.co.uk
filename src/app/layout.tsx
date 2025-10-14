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
  title: 'TsvWeb - Professional Web Design Services',
  description: 'TsvWeb offers professional web design and development services for businesses of all sizes. Contact us for a custom website that drives results.',
  keywords: 'web design, web development, website creation, professional websites, TsvWeb, responsive design',
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
    title: 'TsvWeb - Professional Web Design Services',
    description: 'TsvWeb offers professional web design and development services for businesses of all sizes. Contact us for a custom website that drives results.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TsvWeb - Professional Web Design & Development Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tsvweb',
    creator: '@tsvweb',
    title: 'TsvWeb - Professional Web Design Services',
    description: 'TsvWeb offers professional web design and development services for businesses of all sizes. Contact us for a custom website that drives results.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
