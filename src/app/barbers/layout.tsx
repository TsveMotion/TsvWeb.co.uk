import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Barber Shop Website Design Birmingham | Online Booking & Gallery',
  description: 'Professional barber shop website design in Birmingham. Online booking, gallery, pricing, mobile-ready. Get more appointments from £30/month.',
  alternates: {
    canonical: 'https://tsvweb.com/barbers',
  },
  openGraph: {
    title: 'Barber Shop Website Design Birmingham | TsvWeb',
    description: 'Professional barber shop website design with online booking.',
    url: 'https://tsvweb.com/barbers',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function BarbersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
