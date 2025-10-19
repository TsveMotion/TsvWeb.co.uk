import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import MaintenanceMode from '@/models/MaintenanceMode'

// GET - Public endpoint to check maintenance mode status
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get the most recent maintenance mode record
    const maintenanceMode = await MaintenanceMode.findOne({})
      .sort({ updatedAt: -1 })
      .select('isEnabled message scope scheduledStart scheduledEnd')
      .lean()

    // If no record exists or maintenance is disabled, return disabled state
    if (!maintenanceMode || !maintenanceMode.isEnabled) {
      return NextResponse.json({
        success: true,
        data: {
          isEnabled: false
        }
      })
    }

    // Check if scheduled maintenance is active
    const now = new Date()
    let isCurrentlyActive = maintenanceMode.isEnabled

    if (maintenanceMode.scheduledStart && maintenanceMode.scheduledEnd) {
      isCurrentlyActive = 
        now >= new Date(maintenanceMode.scheduledStart) && 
        now <= new Date(maintenanceMode.scheduledEnd)
    }

    return NextResponse.json({
      success: true,
      data: {
        isEnabled: isCurrentlyActive,
        message: maintenanceMode.message,
        scope: maintenanceMode.scope,
        scheduledEnd: maintenanceMode.scheduledEnd
      }
    })
  } catch (error) {
    console.error('Error fetching maintenance mode:', error)
    // Return disabled state on error to avoid blocking the site
    return NextResponse.json({
      success: true,
      data: {
        isEnabled: false
      }
    })
  }
}
