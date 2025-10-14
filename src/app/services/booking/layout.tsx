import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Booking System Development Birmingham | Online Appointment Scheduling',
  description: 'Professional booking system development in Birmingham. Custom appointment scheduling, calendar integration, automated reminders for service businesses.',
  alternates: {
    canonical: 'https://tsvweb.com/services/booking',
  },
  openGraph: {
    title: 'Booking System Development Birmingham | TsvWeb',
    description: 'Professional booking system development for Birmingham businesses.',
    url: 'https://tsvweb.com/services/booking',
    siteName: 'TsvWeb',
    type: 'website',
  },
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
