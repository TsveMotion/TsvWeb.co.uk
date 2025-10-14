import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cleaning Company Website Design Birmingham | Get More Bookings',
  description: 'Professional cleaning company website design in Birmingham. Online booking, service packages, before/after galleries. Get more bookings from £30/month.',
  alternates: {
    canonical: 'https://tsvweb.com/cleaning',
  },
  openGraph: {
    title: 'Cleaning Company Website Design Birmingham | TsvWeb',
    description: 'Professional cleaning company website design with online booking.',
    url: 'https://tsvweb.com/cleaning',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function CleaningLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
