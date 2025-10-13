import { NextRequest, NextResponse } from 'next/server'
import { verifyCustomerToken } from '@/lib/customer-auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

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

    // Get additional user data from database
    const client = await clientPromise
    const db = client.db()
    
    const userData = await db.collection('users').findOne(
      { _id: new ObjectId(user.userId) },
      { projection: { websites: 1, company: 1, name: 1 } }
    )

    return NextResponse.json({
      success: true,
      user: {
        id: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
        name: userData?.name || user.username,
        websites: userData?.websites || [],
        company: userData?.company || ''
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
