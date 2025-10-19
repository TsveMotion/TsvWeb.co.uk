import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { uploadBackupToDrive } from '@/lib/google-drive-backup';

// Database backup endpoint
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { type, destination } = await request.json();

    await connectToDatabase();

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const backup: any = {
      timestamp: new Date().toISOString(),
      type,
      collections: {}
    };

    // Export all collections
    for (const collection of collections) {
      const collectionName = collection.name;
      const data = await mongoose.connection.db.collection(collectionName).find({}).toArray();
      backup.collections[collectionName] = data;
    }

    const backupData = JSON.stringify(backup, null, 2);
    const filename = `tsvweb-backup-${type}-${Date.now()}.json`;

    if (destination === 'local') {
      // Return download URL for local download
      const blob = Buffer.from(backupData).toString('base64');
      return NextResponse.json({
        success: true,
        downloadUrl: `data:application/json;base64,${blob}`,
        filename,
        message: 'Backup downloaded successfully'
      });
    } else if (destination === 'google-drive') {
      // Upload to Google Drive
      try {
        const userEmail = session.user.email;
        if (!userEmail) {
          return NextResponse.json(
            { success: false, message: 'User email not found' },
            { status: 400 }
          );
        }

        const result = await uploadBackupToDrive(userEmail, backup, filename);
        
        return NextResponse.json({
          success: true,
          message: 'Backup uploaded to Google Drive successfully!',
          fileId: result.fileId,
          webViewLink: result.webViewLink,
          filename
        });
      } catch (error: any) {
        console.error('Google Drive upload error:', error);
        return NextResponse.json(
          { success: false, message: `Failed to upload to Google Drive: ${error.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: false, message: 'Invalid destination' }, { status: 400 });

  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create backup' },
      { status: 500 }
    );
  }
}
