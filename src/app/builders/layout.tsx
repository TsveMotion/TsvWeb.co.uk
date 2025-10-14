import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Builder Website Design Birmingham | Project Portfolio & Quotes',
  description: 'Professional builder website design in Birmingham. Project galleries, instant quotes, testimonials. Showcase your work from £30/month.',
  alternates: {
    canonical: 'https://tsvweb.com/builders',
  },
  openGraph: {
    title: 'Builder Website Design Birmingham | TsvWeb',
    description: 'Professional builder website design with project galleries.',
    url: 'https://tsvweb.com/builders',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function BuildersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
