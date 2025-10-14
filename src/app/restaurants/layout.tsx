import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Restaurant Website Design Birmingham | Online Menus & Reservations',
  description: 'Professional restaurant website design in Birmingham. Online menus, table reservations, food galleries, delivery integration. Get more diners from £30/month.',
  alternates: {
    canonical: 'https://tsvweb.com/restaurants',
  },
  openGraph: {
    title: 'Restaurant Website Design Birmingham | TsvWeb',
    description: 'Professional restaurant website design with online menus and reservations.',
    url: 'https://tsvweb.com/restaurants',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function RestaurantsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
