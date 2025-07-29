import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { clearSession } from '@/lib/auth'
import { ADMIN_AUTH_COOKIE, SESSION_COOKIE } from '@/lib/constants'

export async function POST(request: NextRequest) {
  // Create the response
  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  )
  
  // Clear session cookies
  clearSession(response)
  
  return response
}
