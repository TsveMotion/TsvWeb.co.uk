import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web Design & Development Services Birmingham | TsvWeb',
  description: 'Professional web design and development services in Birmingham. WordPress websites, custom development, e-commerce, SEO, and more. Affordable monthly plans available.',
  alternates: {
    canonical: 'https://tsvweb.com/services',
  },
  openGraph: {
    title: 'TsvWeb Services - Web Design & Development Birmingham',
    description: 'Professional web design and development services in Birmingham. WordPress websites, custom development, e-commerce, SEO, and more.',
    url: 'https://tsvweb.com/services',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
