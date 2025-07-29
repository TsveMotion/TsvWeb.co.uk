"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isClientAuthenticated, getClientAuthData, clearClientSession } from '@/lib/auth-client'

/**
 * A higher-order component (HOC) that wraps admin components with authentication logic
 * This provides an additional layer of client-side protection beyond the middleware
 */
export default function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function ProtectedComponent(props: P) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<{name?: string; email: string; role: string} | null>(null)
    const router = useRouter()

    useEffect(() => {
      // Check for authentication on the client side
      const checkAuth = async () => {
        try {
          // Use the client auth helper
          const authenticated = isClientAuthenticated()
          
          if (!authenticated) {
            redirectToLogin()
            return
          }
          
          // Get the auth data
          const authData = getClientAuthData()
          
          if (authData?.user?.role === 'admin' || authData?.role === 'admin') {
            setIsAuthenticated(true)
            setUser(authData.user || { email: authData.email, role: authData.role, name: authData.name })
          } else {
            redirectToLogin()
          }
        } catch (error) {
          console.error('Auth check error:', error)
          redirectToLogin()
        } finally {
          setIsLoading(false)
        }
      }
      
      const redirectToLogin = () => {
        setIsLoading(false)
        router.push('/admin/login')
      }
      
      const logout = async () => {
        try {
          // Call logout endpoint to clear server-side cookies
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
          // Also clear client-side cookies using our utility
          clearClientSession()
          
          redirectToLogin()
        } catch (error) {
          console.error('Logout error:', error)
          redirectToLogin()
        }
      }
      
      checkAuth()
      
      // Set up an interval to periodically check session status
      const interval = setInterval(checkAuth, 5 * 60 * 1000) // Check every 5 minutes
      
      return () => clearInterval(interval)
    }, [router])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-blue"></div>
        </div>
      )
    }

    return isAuthenticated ? <Component {...props} user={user} /> : null
  }
}
