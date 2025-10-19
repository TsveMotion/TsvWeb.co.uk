import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { saveBackup, generateBackupId } from '@/lib/backup-storage';

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

    // Generate backup ID and save to file system
    const backupId = generateBackupId();
    await saveBackup(backupId, backup);
    
    const backupData = JSON.stringify(backup, null, 2);
    const filename = `tsvweb-backup-${type}-${Date.now()}.json`;

    if (destination === 'local') {
      // Return download URL
      const blob = Buffer.from(backupData).toString('base64');
      return NextResponse.json({
        success: true,
        downloadUrl: `data:application/json;base64,${blob}`,
        filename,
        backupId,
        message: 'Backup created and saved successfully'
      });
    } else if (destination === 'google-drive') {
      // TODO: Implement Google Drive upload
      // For now, just save locally
      return NextResponse.json({
        success: true,
        message: 'Backup saved locally (Google Drive integration pending)',
        backupId,
        filename
      });
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
