import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'E-commerce Website Development Birmingham | WooCommerce & Shopify',
  description: 'Professional e-commerce website development in Birmingham. WooCommerce, Shopify, custom online stores. Secure payments, inventory management, SEO-optimized.',
  alternates: {
    canonical: 'https://tsvweb.com/services/ecommerce',
  },
  openGraph: {
    title: 'E-commerce Development Birmingham | TsvWeb',
    description: 'Professional e-commerce website development in Birmingham.',
    url: 'https://tsvweb.com/services/ecommerce',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function EcommerceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
