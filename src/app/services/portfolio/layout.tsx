import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio Website Design Birmingham | Showcase Your Work',
  description: 'Professional portfolio website design in Birmingham. Stunning galleries, project showcases, perfect for creatives, photographers, and designers.',
  alternates: {
    canonical: 'https://tsvweb.com/services/portfolio',
  },
  openGraph: {
    title: 'Portfolio Website Design Birmingham | TsvWeb',
    description: 'Professional portfolio website design for creatives in Birmingham.',
    url: 'https://tsvweb.com/services/portfolio',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function PortfolioServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
