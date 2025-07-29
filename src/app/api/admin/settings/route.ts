import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { SiteSettings } from '@/models/SiteSettings';

// Get site settings
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Site settings are stored as a single document
    // Get the first (and usually only) document
    let settings = await SiteSettings.findOne();
    
    // If no settings exist yet, return empty object
    if (!settings) {
      return NextResponse.json({ 
        success: true, 
        data: null,
        message: 'No settings found'
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: settings
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

// Create or update site settings
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const data = await request.json();
    
    // Find existing settings
    let settings = await SiteSettings.findOne();
    
    if (settings) {
      // Update existing settings
      settings = await SiteSettings.findByIdAndUpdate(
        settings._id,
        { $set: data },
        { new: true, runValidators: true }
      );
    } else {
      // Create new settings
      settings = new SiteSettings(data);
      await settings.save();
    }
    
    return NextResponse.json({ 
      success: true, 
      data: settings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}
