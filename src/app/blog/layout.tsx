import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WordPress Web Design Birmingham Blog | WordPress Developer Tips & Small Business Web Design',
  description: 'WordPress web design Birmingham blog by our expert WordPress developer. Learn about affordable WordPress websites, custom WordPress development, small business web design, and SEO-friendly WordPress design tips for Birmingham businesses.',
  alternates: {
    canonical: 'https://tsvweb.com/blog',
  },
  openGraph: {
    title: 'TsvWeb Blog - Web Design & Development Insights',
    description: 'Web design tips, WordPress insights, and digital marketing strategies for Birmingham businesses.',
    url: 'https://tsvweb.com/blog',
    siteName: 'TsvWeb',
    type: 'website',
    images: [
      {
        url: 'https://tsvweb.com/TsvWeb_Logo.png',
        width: 1200,
        height: 630,
        alt: 'TsvWeb Blog',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TsvWeb Blog - Web Design & Development Insights',
    description: 'Web design tips, WordPress insights, and digital marketing strategies for Birmingham businesses.',
    images: ['https://tsvweb.com/TsvWeb_Logo.png'],
  },
  keywords: 'WordPress web design Birmingham, WordPress developer, small business web design, custom WordPress development, SEO Birmingham, web design tips, digital marketing',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
