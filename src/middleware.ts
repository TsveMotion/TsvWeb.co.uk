import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_AUTH_COOKIE } from '@/lib/constants'

// This middleware protects all admin routes except the login page
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname
  
  // Check if the request is for an admin route (but not login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check if the user is authenticated (cookie exists)
    const authCookie = request.cookies.get(ADMIN_AUTH_COOKIE)
    
    // If no auth cookie, redirect to login
    if (!authCookie) {
      // Create url to redirect to
      const loginUrl = new URL('/admin/login', request.url)
      
      // Add original destination as a parameter
      loginUrl.searchParams.set('from', pathname)
      
      // Redirect to login
      return NextResponse.redirect(loginUrl)
    }
    
    // Cookie exists, allow the request to proceed without validating its contents
    // This makes the authentication less strict as requested by the user
    // The client-side admin-layout.tsx will handle further validation if needed
  }
  
  // Allow the request to proceed
  return NextResponse.next()
}

// Configure middleware to run only on specific paths
export const config = {
  matcher: ['/admin/:path*'],
}
