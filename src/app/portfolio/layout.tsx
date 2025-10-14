import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web Design Portfolio Birmingham | TsvWeb Projects',
  description: 'View our portfolio of professional web design and development projects in Birmingham. See our WordPress websites, custom applications, and e-commerce solutions.',
  alternates: {
    canonical: 'https://tsvweb.com/portfolio',
  },
  openGraph: {
    title: 'TsvWeb Portfolio - Our Web Design Projects',
    description: 'View our portfolio of professional web design and development projects in Birmingham.',
    url: 'https://tsvweb.com/portfolio',
    siteName: 'TsvWeb',
    type: 'website',
    images: [
      {
        url: 'https://tsvweb.com/TsvWeb_Logo.png',
        width: 1200,
        height: 630,
        alt: 'TsvWeb Portfolio',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TsvWeb Portfolio - Our Web Design Projects',
    description: 'View our portfolio of professional web design and development projects in Birmingham.',
    images: ['https://tsvweb.com/TsvWeb_Logo.png'],
  },
  keywords: 'web design portfolio Birmingham, WordPress websites, custom web development, e-commerce solutions, web design projects, Birmingham web developer',
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

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
