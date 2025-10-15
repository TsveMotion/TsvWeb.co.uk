import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'E-commerce Website Birmingham | Online Store Development | WooCommerce & Shopify | TsvWeb',
  description: 'Professional e-commerce development Birmingham. WooCommerce, Shopify, custom online stores. Secure payments, inventory management, SEO-optimized. Start selling online in 7 days. Free consultation!',
  keywords: 'e-commerce Birmingham, online store Birmingham, e-commerce website Birmingham, WooCommerce Birmingham, Shopify Birmingham, online shop development, Birmingham e-commerce developer, sell online Birmingham',
  alternates: {
    canonical: 'https://tsvweb.com/services/ecommerce',
  },
  openGraph: {
    title: 'E-commerce Website Birmingham | Online Store Development | TsvWeb',
    description: 'Professional e-commerce development Birmingham. WooCommerce, Shopify, custom online stores. Start selling online in 7 days.',
    url: 'https://tsvweb.com/services/ecommerce',
    siteName: 'TsvWeb',
    type: 'website',
    images: [{
      url: 'https://tsvweb.com/TsvWeb_Logo.png',
      width: 1200,
      height: 630,
      alt: 'TsvWeb E-commerce Development Birmingham'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-commerce Website Birmingham | Online Store Development | TsvWeb',
    description: 'Professional e-commerce development Birmingham. Start selling online in 7 days.',
    images: ['https://tsvweb.com/TsvWeb_Logo.png'],
  },
}

export default function EcommerceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
