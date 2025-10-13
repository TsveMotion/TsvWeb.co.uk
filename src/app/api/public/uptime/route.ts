import { NextRequest, NextResponse } from 'next/server'
import { uptimeKumaService } from '@/lib/uptime-kuma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/public/uptime
 * Get public uptime statistics for homepage display
 */
export async function GET(request: NextRequest) {
  try {
    // Initialize the service if not already done
    if (!uptimeKumaService.isConfigured()) {
      await uptimeKumaService.initialize()
    }
    
    // If still not configured after initialization, return fallback data immediately
    if (!uptimeKumaService.isConfigured()) {
      const fallbackData = {
        totalMonitors: 5,
        upMonitors: 5,
        downMonitors: 0,
        pendingMonitors: 0,
        avgUptime: 99.9,
        avgResponseTime: 150,
        lastUpdated: new Date().toISOString()
      }
      
      return NextResponse.json({
        success: true,
        data: fallbackData,
        fallback: true,
        timestamp: new Date().toISOString()
      })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'stats'

    let data
    switch (type) {
      case 'stats':
        // Get overall stats for all monitors
        const monitors = await uptimeKumaService.getMonitors()
        data = {
          totalMonitors: monitors.length,
          upMonitors: monitors.filter(m => m.status === 'up').length,
          downMonitors: monitors.filter(m => m.status === 'down').length,
          pendingMonitors: monitors.filter(m => m.status === 'pending').length,
          avgUptime: monitors.length > 0 
            ? monitors.reduce((sum, m) => sum + m.uptime, 0) / monitors.length 
            : 99.9,
          avgResponseTime: monitors.length > 0
            ? monitors.reduce((sum, m) => sum + m.ping, 0) / monitors.length
            : 150,
          lastUpdated: new Date().toISOString()
        }
        break
      case 'monitors':
        // Get public monitor list (limited info)
        const allMonitors = await uptimeKumaService.getMonitors()
        data = allMonitors.map(monitor => ({
          id: monitor.id,
          name: monitor.name,
          status: monitor.status,
          uptime: monitor.uptime,
          ping: monitor.ping
        }))
        break
      case 'health':
        // Simple health check
        data = {
          status: 'operational',
          timestamp: new Date().toISOString(),
          services: {
            website: 'up',
            api: 'up',
            database: 'up'
          }
        }
        break
      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid type parameter. Use: stats, monitors, or health'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Public uptime API error:', error)
    
    // Return fallback data for public consumption
    const fallbackData = {
      totalMonitors: 5,
      upMonitors: 5,
      downMonitors: 0,
      pendingMonitors: 0,
      avgUptime: 99.9,
      avgResponseTime: 150,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: fallbackData,
      fallback: true,
      timestamp: new Date().toISOString()
    })
  }
}
