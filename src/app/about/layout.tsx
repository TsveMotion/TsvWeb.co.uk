import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About TsvWeb Birmingham | Web Design Team | 8+ Years Experience',
  description: 'Meet the TsvWeb Birmingham team. Award-winning web designers & developers. 200+ projects completed. 8+ years experience. Affordable web design from £30/month. Serving Birmingham businesses since 2015.',
  keywords: 'about TsvWeb, Birmingham web design team, web designers Birmingham, web developers Birmingham, Birmingham web agency, TsvWeb team, affordable web design Birmingham, web design company Birmingham',
  alternates: {
    canonical: 'https://tsvweb.com/about',
  },
  openGraph: {
    title: 'About TsvWeb Birmingham | Web Design Team | 200+ Projects',
    description: 'Meet our Birmingham web design team. 8+ years experience, 200+ projects completed. Affordable web design from £30/month. Trusted by Birmingham businesses.',
    url: 'https://tsvweb.com/about',
    siteName: 'TsvWeb',
    type: 'website',
    images: [
      {
        url: 'https://tsvweb.com/TsvWeb_Logo.png',
        width: 1200,
        height: 630,
        alt: 'TsvWeb Birmingham Web Design Team',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About TsvWeb Birmingham | Web Design Team',
    description: 'Meet our Birmingham web design team. 8+ years experience, 200+ projects completed.',
    images: ['https://tsvweb.com/TsvWeb_Logo.png'],
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
