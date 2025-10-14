import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Custom Web Development Birmingham | React & Next.js | TsvWeb',
  description: 'Custom web development services in Birmingham. React, Next.js, Node.js experts. Build scalable web applications, APIs, and custom solutions.',
  alternates: {
    canonical: 'https://tsvweb.com/services/web-development',
  },
  openGraph: {
    title: 'Custom Web Development Birmingham | TsvWeb',
    description: 'Custom web development services in Birmingham using React, Next.js, and Node.js.',
    url: 'https://tsvweb.com/services/web-development',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function WebDevelopmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
