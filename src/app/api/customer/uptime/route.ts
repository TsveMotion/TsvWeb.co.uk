import { NextRequest, NextResponse } from 'next/server'
import { verifyCustomerToken, createAuthResponse } from '@/lib/customer-auth'
import { uptimeKumaService } from '@/lib/uptime-kuma'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

/**
 * GET /api/customer/uptime
 * Get uptime monitoring data for authenticated customers
 */
export async function GET(request: NextRequest) {
  try {
    // Verify customer authentication
    const customer = await verifyCustomerToken(request)
    if (!customer) {
      return createAuthResponse('Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'stats'

    // Get customer's assigned websites from database
    const client = await clientPromise
    const db = client.db()
    
    const customerData = await db.collection('users').findOne(
      { _id: new ObjectId(customer.userId) },
      { projection: { websites: 1, company: 1, name: 1 } }
    )
    
    const customerWebsites = customerData?.websites || []
    
    // Check if Uptime Kuma is configured
    if (!uptimeKumaService.isConfigured()) {
      return NextResponse.json({
        success: false,
        message: 'Uptime monitoring is not configured',
        data: null
      }, { status: 503 })
    }

    let data
    switch (type) {
      case 'stats':
        // Get filtered monitors first, then calculate stats
        const filteredMonitors = await uptimeKumaService.getMonitors(customerWebsites)
        data = {
          totalMonitors: filteredMonitors.length,
          upMonitors: filteredMonitors.filter(m => m.status === 'up').length,
          downMonitors: filteredMonitors.filter(m => m.status === 'down').length,
          pendingMonitors: filteredMonitors.filter(m => m.status === 'pending').length,
          avgUptime: filteredMonitors.length > 0 
            ? filteredMonitors.reduce((sum, m) => sum + m.uptime, 0) / filteredMonitors.length 
            : 0,
          avgResponseTime: filteredMonitors.length > 0
            ? filteredMonitors.reduce((sum, m) => sum + m.ping, 0) / filteredMonitors.length
            : 0
        }
        break
      case 'monitors':
        data = await uptimeKumaService.getMonitors(customerWebsites)
        break
      case 'test':
        data = await uptimeKumaService.testConnection()
        break
      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid type parameter. Use: stats, monitors, or test'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Uptime API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch uptime data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * POST /api/customer/uptime/test
 * Test Uptime Kuma connection (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify customer authentication
    const customer = await verifyCustomerToken(request)
    if (!customer) {
      return createAuthResponse('Authentication required')
    }

    // For now, allow any authenticated customer to test
    // In production, you might want to restrict this to admin customers
    const testResult = await uptimeKumaService.testConnection()

    return NextResponse.json({
      success: true,
      data: testResult,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Uptime test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to test uptime connection',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
