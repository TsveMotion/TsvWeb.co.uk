import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact TsvWeb | Web Design Birmingham | Get Your Free Quote',
  description: 'Contact TsvWeb for professional web design services in Birmingham. Call 07444 358808 or email hello@tsvweb.com for a free quote. Fast response guaranteed.',
  alternates: {
    canonical: 'https://tsvweb.com/contact',
  },
  openGraph: {
    title: 'Contact TsvWeb - Web Design Birmingham',
    description: 'Get in touch with TsvWeb for professional web design services in Birmingham.',
    url: 'https://tsvweb.com/contact',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
