import { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

export interface CustomerUser {
  userId: string
  username: string
  email: string
  role: string
}

export async function verifyCustomerToken(request: NextRequest): Promise<CustomerUser | null> {
  try {
    const token = request.cookies.get('customer-auth-token')?.value

    if (!token) {
      return null
    }

    const decoded = verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as CustomerUser
    
    // Ensure it's a customer role
    if (decoded.role !== 'customer') {
      return null
    }

    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export function createAuthResponse(message: string, redirectTo: string = '/customer/login') {
  return Response.json(
    { success: false, message, redirectTo },
    { status: 401 }
  )
}
