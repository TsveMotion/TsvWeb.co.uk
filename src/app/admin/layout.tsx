"use client"

import { usePathname } from 'next/navigation'
import AdminLayout from '@/components/admin/admin-layout'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Don't show admin layout on login page
  if (pathname === '/admin/login' || pathname === '/admin/forgot-password' || pathname === '/admin/reset-password') {
    return <>{children}</>
  }
  
  return <AdminLayout>{children}</AdminLayout>
}
