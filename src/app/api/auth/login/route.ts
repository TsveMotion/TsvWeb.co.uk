import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { authenticateUser, createSession } from '@/lib/auth'
import { SESSION_COOKIE, ADMIN_AUTH_COOKIE } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Connect to database
    try {
      await connectToDatabase()
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Service temporarily unavailable. Please try again shortly.' },
        { status: 503 }
      )
    }
    
    // Authenticate user
    const userData = await authenticateUser(email, password)
    
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Create the response with authentication data
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Authentication successful',
        user: {
          name: userData.name,
          email: userData.email,
          role: userData.role
        }
      },
      { status: 200 }
    )
    
    // Create session and set cookies
    await createSession(userData, response)
    
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    )
  }
}

