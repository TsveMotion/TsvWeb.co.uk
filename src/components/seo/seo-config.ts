import { DefaultSeoProps } from 'next-seo'

const SEO_CONFIG: DefaultSeoProps = {
  titleTemplate: '%s | TsvWeb - Professional Web Design Services',
  defaultTitle: 'TsvWeb - Professional Web Design & Development Services',
  description: 'TsvWeb offers professional web design and development services for businesses of all sizes. Contact us for a custom website that drives results.',
  canonical: 'https://tsvweb.co.uk',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tsvweb.co.uk',
    siteName: 'TsvWeb',
    title: 'TsvWeb - Professional Web Design & Development Services',
    description: 'TsvWeb offers professional web design and development services for businesses of all sizes. Contact us for a custom website that drives results.',
    images: [
      {
        url: 'https://tsvweb.co.uk/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TsvWeb - Professional Web Design & Development Services',
      },
    ],
  },
  twitter: {
    handle: '@tsvweb',
    site: '@tsvweb',
    cardType: 'summary_large_image',
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'web design, web development, website creation, professional websites, TsvWeb, responsive design, SEO optimization, mobile-friendly websites',
    },
    {
      name: 'author',
      content: 'TsvWeb',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
  ],
}

export default SEO_CONFIG
