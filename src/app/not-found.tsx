import { Metadata } from 'next'
import NotFoundClient from './not-found-client'

export const metadata: Metadata = {
  title: '404 - Page Not Found | TsvWeb',
  description: "The page you're looking for doesn't exist. Return to TsvWeb for professional web design services.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return <NotFoundClient />
}
