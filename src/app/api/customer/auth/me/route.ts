import { NextRequest, NextResponse } from 'next/server'
import { verifyCustomerToken } from '@/lib/customer-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyCustomerToken(request)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.userId,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
