import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Electrician Website Design Birmingham | Showcase Certifications',
  description: 'Professional electrician website design in Birmingham. Display certifications, emergency services, service areas. Get more jobs from £30/month.',
  alternates: {
    canonical: 'https://tsvweb.com/electricians',
  },
  openGraph: {
    title: 'Electrician Website Design Birmingham | TsvWeb',
    description: 'Professional electrician website design with certification showcase.',
    url: 'https://tsvweb.com/electricians',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function ElectriciansLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
