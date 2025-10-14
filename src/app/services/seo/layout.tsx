import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SEO Services Birmingham | Rank #1 on Google | Local SEO',
  description: 'Professional SEO services in Birmingham. Get more traffic, rank #1 on Google, dominate local search. Technical SEO, content optimization, link building.',
  alternates: {
    canonical: 'https://tsvweb.com/services/seo',
  },
  openGraph: {
    title: 'SEO Services Birmingham | TsvWeb',
    description: 'Professional SEO services in Birmingham to help you rank #1 on Google.',
    url: 'https://tsvweb.com/services/seo',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function SEOLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
