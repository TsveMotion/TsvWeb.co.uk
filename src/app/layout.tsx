import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TsvWeb - Professional Web Design Services',
  description: 'TsvWeb offers professional web design and development services for businesses of all sizes. Contact us for a custom website that drives results.',
  keywords: 'web design, web development, website creation, professional websites, TsvWeb, responsive design',
  icons: {
    icon: '/TsvWeb_Favicon.png',
    apple: '/TsvWeb_Favicon.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
