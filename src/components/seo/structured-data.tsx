"use client"

import { useEffect } from 'react'

interface StructuredDataProps {
  type: 'Organization' | 'LocalBusiness' | 'WebSite' | 'BlogPosting' | 'Product' | 'Service' | 'FAQPage'
  data: Record<string, any>
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    // Create the script element for structured data
    const script = document.createElement('script')
    script.setAttribute('type', 'application/ld+json')
    
    // Create the structured data object
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    }
    
    // Set the script content
    script.textContent = JSON.stringify(structuredData)
    
    // Add the script to the document head
    document.head.appendChild(script)
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(script)
    }
  }, [type, data])
  
  // This component doesn't render anything visible
  return null
}
