import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_AUTH_COOKIE } from '@/lib/constants'

// This middleware protects all admin routes except the login page
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname
  
  // Check if the request is for an admin route (but not login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check if the user is authenticated (custom cookie or NextAuth session)
    const authCookie = request.cookies.get(ADMIN_AUTH_COOKIE)
    
    // Check for NextAuth session cookie (multiple possible names)
    const nextAuthSession = 
      request.cookies.get('next-auth.session-token') || 
      request.cookies.get('__Secure-next-auth.session-token') ||
      request.cookies.get('__Host-next-auth.session-token')
    
    // If no auth cookie and no NextAuth session, redirect to login
    if (!authCookie && !nextAuthSession) {
      // Create url to redirect to
      const loginUrl = new URL('/admin/login', request.url)
      
      // Add original destination as a parameter
      loginUrl.searchParams.set('from', pathname)
      
      // Redirect to login
      return NextResponse.redirect(loginUrl)
    }
    
    // Cookie exists, allow the request to proceed
    // The client-side admin-layout.tsx will handle further validation if needed
  }
  
  // Allow the request to proceed
  return NextResponse.next()
}

// Configure middleware to run only on specific paths
export const config = {
  matcher: ['/admin/:path*'],
}
