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
      .select('isEnabled message scope scheduledStart scheduledEnd enabledAt')
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

    // If there's a schedule, check if we're within the scheduled window
    if (maintenanceMode.scheduledStart && maintenanceMode.scheduledEnd) {
      const startTime = new Date(maintenanceMode.scheduledStart)
      const endTime = new Date(maintenanceMode.scheduledEnd)
      
      // Only show maintenance if we're within the scheduled window
      isCurrentlyActive = 
        maintenanceMode.isEnabled &&
        now >= startTime && 
        now <= endTime
      
      // If we're past the scheduled end time, maintenance should be disabled
      if (now > endTime) {
        isCurrentlyActive = false
      }
    } else if (maintenanceMode.isEnabled && !maintenanceMode.scheduledStart && !maintenanceMode.scheduledEnd) {
      // If maintenance is enabled but no schedule is set, check if it's been enabled for more than 24 hours
      // This prevents maintenance mode from being stuck on indefinitely
      if (maintenanceMode.enabledAt) {
        const enabledAt = new Date(maintenanceMode.enabledAt)
        const hoursSinceEnabled = (now.getTime() - enabledAt.getTime()) / (1000 * 60 * 60)
        
        // Auto-disable after 24 hours if no schedule is set
        if (hoursSinceEnabled > 24) {
          isCurrentlyActive = false
        }
      }
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
