import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { downloadBackupFromDrive } from '@/lib/google-drive-backup';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { backupId } = await request.json();

    if (!backupId) {
      return NextResponse.json({ success: false, message: 'Backup ID required' }, { status: 400 });
    }

    // Get backup data from Google Drive
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ success: false, message: 'User email not found' }, { status: 400 });
    }

    const backup = await downloadBackupFromDrive(userEmail, backupId);
    
    if (!backup || !backup.collections) {
      return NextResponse.json({ success: false, message: 'Backup not found or invalid' }, { status: 404 });
    }

    await connectToDatabase();

    // CRITICAL: Save current user's session data before restore
    const currentUserEmail = session.user.email;
    let currentUserData = null;
    
    if (currentUserEmail) {
      const User = mongoose.connection.db.collection('users');
      currentUserData = await User.findOne({ email: currentUserEmail.toLowerCase() });
    }

    // Track restoration progress
    const restoredCollections: string[] = [];
    const errors: string[] = [];

    // Restore each collection
    for (const [collectionName, data] of Object.entries(backup.collections)) {
      try {
        // Skip system collections
        if (collectionName.startsWith('system.')) {
          continue;
        }

        const collection = mongoose.connection.db.collection(collectionName);
        
        // Clear existing data
        await collection.deleteMany({});
        
        // Insert backup data
        if (Array.isArray(data) && data.length > 0) {
          await collection.insertMany(data);
        }
        
        restoredCollections.push(collectionName);
      } catch (error) {
        console.error(`Error restoring collection ${collectionName}:`, error);
        errors.push(`${collectionName}: ${error}`);
      }
    }

    // CRITICAL: Restore current user's data to preserve Google account
    if (currentUserData && currentUserEmail) {
      try {
        const User = mongoose.connection.db.collection('users');
        
        // Check if user exists in restored data
        const restoredUser = await User.findOne({ email: currentUserEmail.toLowerCase() });
        
        if (restoredUser) {
          // Update restored user with current Google account info
          await User.updateOne(
            { email: currentUserEmail.toLowerCase() },
            { 
              $set: { 
                googleId: currentUserData.googleId,
                googleEmail: currentUserData.googleEmail,
                // Preserve any other OAuth data
                ...(currentUserData.googleId && { googleId: currentUserData.googleId }),
                ...(currentUserData.googleEmail && { googleEmail: currentUserData.googleEmail }),
              } 
            }
          );
        } else {
          // User not in backup - insert current user to preserve access
          await User.insertOne(currentUserData);
        }
      } catch (error) {
        console.error('Error preserving current user:', error);
        errors.push(`Failed to preserve current user: ${error}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database restored successfully',
      details: {
        restoredCollections,
        totalCollections: restoredCollections.length,
        errors: errors.length > 0 ? errors : undefined,
        userPreserved: currentUserEmail ? true : false
      }
    });

  } catch (error) {
    console.error('Restore error:', error);
    return NextResponse.json(
      { success: false, message: `Failed to restore backup: ${error}` },
      { status: 500 }
    );
  }
}
