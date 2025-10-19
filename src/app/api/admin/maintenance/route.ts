import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/db'
import MaintenanceMode from '@/models/MaintenanceMode'
import { User } from '@/models/User'

// Helper function to check admin authentication
async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    return { authenticated: false, error: 'Unauthorized' }
  }
  
  const userRole = (session.user as any).role
  if (userRole !== 'admin' && userRole !== 'editor') {
    return { authenticated: false, error: 'Forbidden: Admin access required' }
  }
  
  // Get user ID from database using email
  await connectToDatabase()
  const user = await User.findOne({ email: session.user.email }).select('_id').lean()
  
  if (!user) {
    return { authenticated: false, error: 'User not found' }
  }
  
  return { authenticated: true, userId: (user as any)._id.toString() }
}

// GET - Fetch current maintenance mode status
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get the most recent maintenance mode record
    const maintenanceMode = await MaintenanceMode.findOne({})
      .sort({ updatedAt: -1 })
      .lean()

    // If no record exists, return default disabled state
    if (!maintenanceMode) {
      return NextResponse.json({
        success: true,
        data: {
          isEnabled: false,
          message: '⚠️ SERVICES MAY BE DOWN\nWEBSITES ARE ALL UNDER MAINTENANCE',
          scope: 'tsvweb'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: maintenanceMode
    })
  } catch (error) {
    console.error('Error fetching maintenance mode:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch maintenance mode status' },
      { status: 500 }
    )
  }
}

// POST - Update maintenance mode settings
export async function POST(request: NextRequest) {
  const auth = await checkAdminAuth()
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, message: auth.error },
      { status: auth.error === 'Unauthorized' ? 401 : 403 }
    )
  }

  try {
    await connectToDatabase()

    const body = await request.json()
    const { 
      isEnabled, 
      message, 
      scope, 
      scheduledStart, 
      scheduledEnd, 
      autoDisable, 
      autoDisableDuration,
      customMessage 
    } = body

    // Validation
    if (typeof isEnabled !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'isEnabled must be a boolean' },
        { status: 400 }
      )
    }

    if (scope && !['tsvweb', 'all'].includes(scope)) {
      return NextResponse.json(
        { success: false, message: 'Invalid scope. Must be "tsvweb" or "all"' },
        { status: 400 }
      )
    }

    // Get existing maintenance mode or create new one
    let maintenanceMode = await MaintenanceMode.findOne({}).sort({ updatedAt: -1 })

    const updateData: any = {
      isEnabled,
      message: message || '⚠️ SERVICES MAY BE DOWN\nWEBSITES ARE ALL UNDER MAINTENANCE',
      scope: scope || 'tsvweb',
      scheduledStart: scheduledStart ? new Date(scheduledStart) : null,
      scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : null,
      autoDisable: autoDisable || false,
      autoDisableDuration: autoDisableDuration || null,
      customMessage: customMessage || null,
      createdBy: auth.userId
    }

    // Track when maintenance mode is enabled/disabled
    if (isEnabled && (!maintenanceMode || !maintenanceMode.isEnabled)) {
      updateData.enabledAt = new Date()
    } else if (!isEnabled && maintenanceMode && maintenanceMode.isEnabled) {
      updateData.disabledAt = new Date()
    }

    if (maintenanceMode) {
      // Update existing record
      Object.assign(maintenanceMode, updateData)
      await maintenanceMode.save()
    } else {
      // Create new record
      maintenanceMode = await MaintenanceMode.create(updateData)
    }

    return NextResponse.json({
      success: true,
      message: `Maintenance mode ${isEnabled ? 'enabled' : 'disabled'} successfully`,
      data: maintenanceMode
    })
  } catch (error) {
    console.error('Error updating maintenance mode:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update maintenance mode' },
      { status: 500 }
    )
  }
}
