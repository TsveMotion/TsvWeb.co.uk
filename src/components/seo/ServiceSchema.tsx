'use client'

interface ServiceSchemaProps {
  name: string
  description: string
  url: string
  price?: string
  priceRange?: string
  areaServed?: string[]
  provider?: {
    name: string
    url: string
  }
}

export default function ServiceSchema({
  name,
  description,
  url,
  price,
  priceRange,
  areaServed = ['Birmingham', 'West Midlands', 'UK'],
  provider = {
    name: 'TsvWeb',
    url: 'https://tsvweb.com'
  }
}: ServiceSchemaProps) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": name,
    "name": name,
    "description": description,
    "url": url,
    "provider": {
      "@type": "LocalBusiness",
      "name": provider.name,
      "url": provider.url,
      "telephone": "+447444358808",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Birmingham",
        "addressRegion": "West Midlands",
        "addressCountry": "GB"
      }
    },
    "areaServed": areaServed.map(area => ({
      "@type": "City",
      "name": area
    })),
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceSpecification": priceRange ? {
        "@type": "PriceSpecification",
        "priceCurrency": "GBP",
        "price": priceRange
      } : undefined,
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "url": url
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  )
}
