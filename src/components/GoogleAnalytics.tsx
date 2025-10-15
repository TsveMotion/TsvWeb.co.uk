'use client'

import { GoogleAnalytics as GA } from 'nextjs-google-analytics'
import Script from 'next/script'

export default function GoogleAnalytics() {
  return (
    <>
      {/* Load Google Analytics with lazyOnload strategy to reduce blocking */}
      <GA trackPageViews strategy="lazyOnload" />
    </>
  )
}
