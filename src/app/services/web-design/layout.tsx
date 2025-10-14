import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WordPress Web Design Birmingham | £30/month | TsvWeb',
  description: 'Professional WordPress web design in Birmingham from £30/month. Custom designs, mobile-responsive, SEO-optimized. No upfront costs. Ready in 3-5 days.',
  alternates: {
    canonical: 'https://tsvweb.com/services/web-design',
  },
  openGraph: {
    title: 'WordPress Web Design Birmingham | TsvWeb',
    description: 'Professional WordPress web design in Birmingham from £30/month.',
    url: 'https://tsvweb.com/services/web-design',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function WebDesignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
