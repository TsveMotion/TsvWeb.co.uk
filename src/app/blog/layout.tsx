import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WordPress Web Design Birmingham Blog | WordPress Developer Tips & Small Business Web Design',
  description: 'WordPress web design Birmingham blog by our expert WordPress developer. Learn about affordable WordPress websites, custom WordPress development, small business web design, and SEO-friendly WordPress design tips for Birmingham businesses.',
  alternates: {
    canonical: 'https://tsvweb.com/blog',
  },
  openGraph: {
    title: 'TsvWeb Blog - Web Design & Development Insights',
    description: 'Web design tips, WordPress insights, and digital marketing strategies for Birmingham businesses.',
    url: 'https://tsvweb.com/blog',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
