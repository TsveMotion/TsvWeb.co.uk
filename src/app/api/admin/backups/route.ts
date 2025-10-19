import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { listDriveBackups, deleteBackupFromDrive } from '@/lib/google-drive-backup';

// List backups endpoint
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch backups from Google Drive
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ success: false, message: 'User email not found' }, { status: 400 });
    }

    const backups = await listDriveBackups(userEmail);

    return NextResponse.json({
      success: true,
      backups
    });

  } catch (error) {
    console.error('Fetch backups error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch backups' },
      { status: 500 }
    );
  }
}

// Delete backup endpoint
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { backupId } = await request.json();
    
    if (!backupId) {
      return NextResponse.json({ success: false, message: 'Backup ID required' }, { status: 400 });
    }

    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ success: false, message: 'User email not found' }, { status: 400 });
    }

    const deleted = await deleteBackupFromDrive(userEmail, backupId);
    
    if (deleted) {
      return NextResponse.json({
        success: true,
        message: 'Backup deleted successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Backup not found' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Delete backup error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete backup' },
      { status: 500 }
    );
  }
}
