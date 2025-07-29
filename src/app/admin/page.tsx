"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function AdminIndexPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const authCookie = Cookies.get('tsvweb-admin-auth')
    
    if (authCookie) {
      // If authenticated, redirect to dashboard
      router.push('/admin/dashboard')
    } else {
      // If not authenticated, redirect to login
      router.push('/admin/login')
    }
  }, [router])

  // Show a loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center"><p className="text-gray-600 dark:text-gray-300">Redirecting...</p>
      </div>
    </div>
  )
}
