import Head from 'next/head'
import StructuredData from './structured-data'

// Default SEO config in case the import fails
const DEFAULT_SEO_CONFIG = {
  titleTemplate: '%s | TsvWeb - Professional Web Design Services',
  defaultTitle: 'TsvWeb - Professional Web Design & Development Services',
  description: 'TsvWeb offers professional web design and development services for businesses of all sizes. Contact us for a custom website that drives results.',
  canonical: 'https://tsvweb.co.uk',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tsvweb.co.uk',
    siteName: 'TsvWeb',
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
  }
}

interface PageSEOProps {
  title?: string
  description?: string
  canonical?: string
  keywords?: string
  googleSiteVerification?: string
  noindex?: boolean  // Add noindex support for 404 pages
  openGraph?: {
    title?: string
    description?: string
    url?: string
    type?: string
    images?: Array<{
      url: string
      width?: number
      height?: number
      alt?: string
    }>
  }
  structuredData?: {
    type: 'Organization' | 'LocalBusiness' | 'WebSite' | 'BlogPosting' | 'Product' | 'Service' | 'FAQPage'
    data: Record<string, any>
  }
  schema?: Record<string, any>
}

export default function PageSEO({
  title,
  description,
  canonical,
  keywords,
  googleSiteVerification,
  noindex = false,
  openGraph,
  structuredData,
  schema
}: PageSEOProps) {
  const pageTitle = title ? `${title} | TsvWeb` : DEFAULT_SEO_CONFIG.defaultTitle;
  const pageDescription = description || DEFAULT_SEO_CONFIG.description;
  const pageCanonical = canonical || DEFAULT_SEO_CONFIG.canonical;
  const ogTitle = openGraph?.title || title || DEFAULT_SEO_CONFIG.defaultTitle;
  const ogDescription = openGraph?.description || description || DEFAULT_SEO_CONFIG.description;
  const ogUrl = openGraph?.url || canonical || DEFAULT_SEO_CONFIG.canonical;
  const ogImage = openGraph?.images?.[0]?.url || DEFAULT_SEO_CONFIG.openGraph.images[0].url;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {keywords && <meta name="keywords" content={keywords} />}
        <link rel="canonical" href={pageCanonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:type" content={openGraph?.type || 'website'} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="TsvWeb" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@tsvweb" />
        <meta name="twitter:creator" content="@tsvweb" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Google Search Console Verification */}
        {googleSiteVerification && (
          <meta name="google-site-verification" content={googleSiteVerification} />
        )}
        
        {/* Additional meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        {noindex ? (
          <>
            <meta name="robots" content="noindex, nofollow" />
            <meta name="googlebot" content="noindex, nofollow" />
          </>
        ) : (
          <>
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
          </>
        )}
      </Head>
      {structuredData && (
        <StructuredData
          type={structuredData.type}
          data={structuredData.data}
        />
      )}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  )
}
