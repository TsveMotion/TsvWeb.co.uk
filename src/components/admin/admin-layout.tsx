"use client"

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { ADMIN_AUTH_COOKIE } from '@/lib/auth-client'
import LogoutButton from './logout-button'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      try {
        const authData = Cookies.get(ADMIN_AUTH_COOKIE)
        if (authData) {
          try {
            const parsedData = JSON.parse(authData)
            
            // Less strict check - accept any valid JSON with authenticated flag or role
            // Check for expired session only if expires field exists
            if (parsedData.expires && parsedData.expires < Date.now()) {
              console.log('Authentication status: expired session')
              setIsAuthenticated(false)
              router.push('/admin/login?expired=true')
              return
            }
            
            // Accept any of these authentication patterns for backward compatibility
            const isAdmin = 
              (parsedData.authenticated === true) || 
              (parsedData.role === 'admin') || 
              (parsedData.user?.role === 'admin')
            
            if (isAdmin) {
              console.log('Authentication status: true')
              console.log('Auth data:', parsedData)
              console.log('User authenticated as admin')
              
              setIsAuthenticated(true)
              
              // Set user email from any of the possible structures
              if (parsedData.email) {
                setUserEmail(parsedData.email)
              } else if (parsedData.user?.email) {
                setUserEmail(parsedData.user.email)
              } else if (parsedData.userData?.email) {
                setUserEmail(parsedData.userData.email)
              } else if (parsedData.name) {
                setUserEmail(parsedData.name)
              }
              
              // Already authenticated, no need to redirect
              setIsLoading(false)
              return
            }
          } catch (parseError) {
            // Even if JSON parsing fails, consider the presence of the cookie as authentication
            // This makes the system less strict as requested
            console.log('Auth cookie exists but could not be parsed, allowing access')
            setIsAuthenticated(true)
            setIsLoading(false)
            return
          }
        } else {
          setIsAuthenticated(false)
          if (pathname !== '/admin/login') {
            router.push('/admin/login')
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
        // Even in case of error, if we're not on login page, stay on current page
        // This makes the authentication less strict
        if (pathname === '/admin/login') {
          setIsAuthenticated(false)
        } else {
          // Assume authenticated to prevent redirect loops
          setIsAuthenticated(true)
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
    
    // Check periodically for session expiration
    const interval = setInterval(() => {
      // Only check for expiration, don't redirect unless expired
      try {
        const authData = Cookies.get(ADMIN_AUTH_COOKIE)
        if (authData) {
          const parsedData = JSON.parse(authData)
          
          // Only redirect if session is expired
          if (parsedData.exp && parsedData.exp < Date.now()) {
            setIsAuthenticated(false)
            router.push('/admin/login?expired=true')
          }
        }
      } catch (error) {
        console.error('Periodic auth check error:', error)
      }
    }, 5 * 60 * 1000) // Every 5 minutes
    
    return () => clearInterval(interval)
  }, [router, pathname])

  // Logout functionality is now handled by the LogoutButton component

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ) },
    { name: 'Blog Posts', href: '/admin/blog', icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ) },
    { name: 'Portfolio', href: '/admin/portfolio', icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ) },
    { name: 'Contact Inquiries', href: '/admin/inquiries', icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ) },
    { name: 'User Management', href: '/admin/users', icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ) },
    { name: 'Settings', href: '/admin/settings', icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ) },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-blue"></div>
      </div>
    )
  }

  // Special case for login page - don't require authentication
  if (pathname === '/admin/login') {
    return <>{children}</>
  }
  
  // For all other admin pages, require authentication
  if (!isAuthenticated) {
    return null // Will redirect to login in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75" 
          aria-hidden="true"
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        {/* Sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white dark:bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center px-4">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-royal-blue dark:text-white">
                TsvWeb Admin
              </span>
            </Link>
          </div>
          
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    pathname === item.href
                      ? 'bg-royal-blue text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className={`mr-4 ${
                    pathname === item.href
                      ? 'text-white'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                  }`}>
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-royal-blue dark:text-white">
                TsvWeb Admin
              </span>
            </Link>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? 'bg-royal-blue text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className={`mr-3 ${
                    pathname === item.href
                      ? 'text-white'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                  }`}>
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col">
        {/* Top header */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow">
          <button
            type="button"
            className="px-4 text-gray-500 dark:text-gray-400 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {navigation.find(item => item.href === pathname)?.name || 'Admin Panel'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-royal-blue flex items-center justify-center">
                    <span className="text-white font-medium">
                      {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <LogoutButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
