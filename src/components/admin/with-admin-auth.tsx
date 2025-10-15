"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

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
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
      // Check for authentication on the client side
      const checkAuth = async () => {
        try {
          // Check NextAuth session
          if (status === 'loading') {
            return // Still loading
          }
          
          if (status === 'unauthenticated' || !session) {
            redirectToLogin()
            return
          }
          
          // Check if user has admin role
          const userRole = (session.user as any)?.role
          
          if (userRole === 'admin' || userRole === 'editor') {
            setIsAuthenticated(true)
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
      
      checkAuth()
    }, [session, status, router])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-blue"></div>
        </div>
      )
    }

    return isAuthenticated ? <Component {...props} user={session?.user} /> : null
  }
}
