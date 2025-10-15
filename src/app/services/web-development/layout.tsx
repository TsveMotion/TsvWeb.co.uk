import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web Development Birmingham | Custom Web Apps | React & Next.js | TsvWeb',
  description: 'Professional web development Birmingham. Custom web applications, APIs, SaaS platforms. React, Next.js, Node.js experts. Scalable, secure, fast. From £500. Trusted by 500+ businesses. Free consultation!',
  keywords: 'web development Birmingham, custom web development, Birmingham web developer, React development Birmingham, Next.js Birmingham, web application development, API development Birmingham, full stack developer Birmingham',
  alternates: {
    canonical: 'https://tsvweb.com/services/web-development',
  },
  openGraph: {
    title: 'Web Development Birmingham | Custom Web Apps | TsvWeb',
    description: 'Professional web development Birmingham. Custom web applications, APIs, SaaS platforms. React, Next.js, Node.js experts.',
    url: 'https://tsvweb.com/services/web-development',
    siteName: 'TsvWeb',
    type: 'website',
    images: [{
      url: 'https://tsvweb.com/TsvWeb_Logo.png',
      width: 1200,
      height: 630,
      alt: 'TsvWeb Web Development Birmingham'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Development Birmingham | Custom Web Apps | TsvWeb',
    description: 'Professional web development Birmingham. Custom web applications, APIs, SaaS platforms.',
    images: ['https://tsvweb.com/TsvWeb_Logo.png'],
  },
}

export default function WebDevelopmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
