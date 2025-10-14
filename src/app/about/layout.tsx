import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About TsvWeb | Professional Web Design Birmingham',
  description: 'Learn about TsvWeb, your trusted web design partner in Birmingham. Expert web developers creating stunning, SEO-optimized websites for local businesses.',
  alternates: {
    canonical: 'https://tsvweb.com/about',
  },
  openGraph: {
    title: 'About TsvWeb - Web Design Birmingham',
    description: 'Learn about TsvWeb, your trusted web design partner in Birmingham.',
    url: 'https://tsvweb.com/about',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
