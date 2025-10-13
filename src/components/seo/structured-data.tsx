"use client"

import { useEffect } from 'react'

interface StructuredDataProps {
  type: 'Organization' | 'LocalBusiness' | 'WebSite' | 'BlogPosting' | 'Product' | 'Service' | 'FAQPage' | 'BreadcrumbList' | 'Review' | 'AggregateRating'
  data: Record<string, any>
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    // Generate unique ID for the script to avoid duplicates
    const scriptId = `structured-data-${type.toLowerCase()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Remove any existing script with the same type
    const existingScript = document.querySelector(`script[data-structured-data="${type}"]`)
    if (existingScript) {
      existingScript.remove()
    }
    
    // Create the script element for structured data
    const script = document.createElement('script')
    script.setAttribute('type', 'application/ld+json')
    script.setAttribute('data-structured-data', type)
    script.id = scriptId
    
    // Enhance data with additional SEO properties
    const enhancedData = {
      ...data,
      // Add common SEO enhancements
      ...(type === 'LocalBusiness' && {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'subOrganization': 'WebDesignBusiness',
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': 'WordPress Web Design Services Birmingham',
          'itemListElement': [
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'WordPress Web Design Birmingham',
                'description': 'Affordable WordPress web design services for Birmingham businesses'
              }
            }
          ]
        }
      }),
      ...(type === 'WebSite' && {
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://tsvweb.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      })
    }
    
    // Create the structured data object
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...enhancedData,
    }
    
    // Set the script content
    script.textContent = JSON.stringify(structuredData, null, 0)
    
    // Add the script to the document head
    document.head.appendChild(script)
    
    // Clean up on unmount
    return () => {
      const scriptToRemove = document.getElementById(scriptId)
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [type, data])
  
  // This component doesn't render anything visible
  return null
}
