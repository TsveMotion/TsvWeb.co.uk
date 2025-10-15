import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SEO Services Birmingham | Rank #1 on Google | Local SEO Experts | TsvWeb',
  description: 'Expert SEO services Birmingham. Rank #1 on Google in 90 days. Local SEO, technical SEO, content optimization, link building. 3x more traffic guaranteed. Trusted by 500+ Birmingham businesses. Free SEO audit!',
  keywords: 'SEO Birmingham, SEO services Birmingham, local SEO Birmingham, Birmingham SEO company, SEO agency Birmingham, search engine optimization Birmingham, Google ranking Birmingham, SEO expert Birmingham, affordable SEO Birmingham',
  alternates: {
    canonical: 'https://tsvweb.com/services/seo',
  },
  openGraph: {
    title: 'SEO Services Birmingham | Rank #1 on Google | TsvWeb',
    description: 'Expert SEO services Birmingham. Rank #1 on Google in 90 days. 3x more traffic guaranteed. Free SEO audit!',
    url: 'https://tsvweb.com/services/seo',
    siteName: 'TsvWeb',
    type: 'website',
    images: [{
      url: 'https://tsvweb.com/TsvWeb_Logo.png',
      width: 1200,
      height: 630,
      alt: 'TsvWeb SEO Services Birmingham'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Services Birmingham | Rank #1 on Google | TsvWeb',
    description: 'Expert SEO services Birmingham. Rank #1 on Google in 90 days.',
    images: ['https://tsvweb.com/TsvWeb_Logo.png'],
  },
}

export default function SEOLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
