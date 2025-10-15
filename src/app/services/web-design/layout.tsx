import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web Design Birmingham | Custom Website Design from £30/month | TsvWeb',
  description: 'Award-winning web design Birmingham. Custom, mobile-responsive websites from £30/month. 100% unique designs, unlimited revisions, 3-5 day delivery. Trusted by 500+ Birmingham businesses. Free mockup today!',
  keywords: 'web design Birmingham, website design Birmingham, custom web design, Birmingham web designer, professional web design, mobile responsive design, affordable web design Birmingham, web design agency Birmingham, website designer near me',
  alternates: {
    canonical: 'https://tsvweb.com/services/web-design',
  },
  openGraph: {
    title: 'Web Design Birmingham | Custom Website Design | TsvWeb',
    description: 'Award-winning web design Birmingham. Custom, mobile-responsive websites from £30/month. 100% unique designs, unlimited revisions. Free mockup today!',
    url: 'https://tsvweb.com/services/web-design',
    siteName: 'TsvWeb',
    type: 'website',
    images: [{
      url: 'https://tsvweb.com/TsvWeb_Logo.png',
      width: 1200,
      height: 630,
      alt: 'TsvWeb Web Design Birmingham'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Birmingham | Custom Website Design | TsvWeb',
    description: 'Award-winning web design Birmingham from £30/month. Free mockup today!',
    images: ['https://tsvweb.com/TsvWeb_Logo.png'],
  },
}

export default function WebDesignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
