import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_AUTH_COOKIE } from '@/lib/constants'

// This middleware protects all admin routes except the login page
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname
  
  // SPAM URL PROTECTION: Block spam product pages and gambling URLs with 410 Gone
  // These are fake product pages from negative SEO attack (34.5K+ pages)
  
  // Check for spam product pages (product IDs with numbers)
  const productPagePattern = /^\/[A-Z].*-\d{6,}$/i
  if (productPagePattern.test(pathname)) {
    return new NextResponse(null, {
      status: 410,
      statusText: 'Gone - This page never existed'
    })
  }
  
  // Check for spam review pages
  if (pathname.startsWith('/reviews/product/')) {
    return new NextResponse(null, {
      status: 410,
      statusText: 'Gone - This page never existed'
    })
  }
  
  // Check for spam directory/help/cp pages
  const spamPaths = [
    '/cp/',
    '/help/',
    '/store/directory',
    '/global/',
    '/shop/',
    '/all-departments',
    '/browse/',
    '/lists',
    '/orders',
    '/my-registries',
    '/account/api/'
  ]
  
  if (spamPaths.some(path => pathname.startsWith(path))) {
    return new NextResponse(null, {
      status: 410,
      statusText: 'Gone - This page never existed'
    })
  }
  
  // Check for spam gambling URLs
  const gamblingPatterns = [
    '/news/jackpot',
    '/news/mahjong',
    '/news/scatter',
    '/news/strategi',
    '/news/tips-jackpot',
    '/news/trik-scatter',
    '/news/pengganda',
    '/news/ways2',
    '/news/cuan',
    '/news/gacor',
    '/news/bocor',
    '/news/ways',
    '/news/wins'
  ]
  
  if (gamblingPatterns.some(pattern => pathname.includes(pattern))) {
    return new NextResponse(null, {
      status: 410,
      statusText: 'Gone - This page never existed'
    })
  }
  
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

// Configure middleware to run on ALL routes to catch spam URLs
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
