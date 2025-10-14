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
  },
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
