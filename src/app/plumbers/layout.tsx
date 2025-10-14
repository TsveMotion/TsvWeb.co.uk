import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plumber Website Design Birmingham | 24/7 Emergency Callout Pages',
  description: 'Professional plumber website design in Birmingham. Emergency callout pages, service areas, instant quotes, mobile-ready. Get more calls from £30/month.',
  alternates: {
    canonical: 'https://tsvweb.com/plumbers',
  },
  openGraph: {
    title: 'Plumber Website Design Birmingham | TsvWeb',
    description: 'Professional plumber website design with emergency callout features.',
    url: 'https://tsvweb.com/plumbers',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function PlumbersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
