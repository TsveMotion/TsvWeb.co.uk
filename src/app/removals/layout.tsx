import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Removals Company Website Design Birmingham | Quote Calculators',
  description: 'Professional removals company website design in Birmingham. Instant quote calculators, service areas, booking system. Get more moves from £30/month.',
  alternates: {
    canonical: 'https://tsvweb.com/removals',
  },
  openGraph: {
    title: 'Removals Company Website Design Birmingham | TsvWeb',
    description: 'Professional removals company website design with quote calculators.',
    url: 'https://tsvweb.com/removals',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function RemovalsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
