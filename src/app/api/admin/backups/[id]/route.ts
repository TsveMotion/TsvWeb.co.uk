import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { downloadBackupFromDrive } from '@/lib/google-drive-backup';

interface Params {
  params: {
    id: string;
  };
}

// Download specific backup
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: 'User email not found' },
        { status: 400 }
      );
    }
    
    const backup = await downloadBackupFromDrive(userEmail, id);
    
    if (!backup) {
      return NextResponse.json(
        { success: false, message: 'Backup not found' },
        { status: 404 }
      );
    }

    // Return backup data as downloadable JSON
    const backupData = JSON.stringify(backup, null, 2);
    const blob = Buffer.from(backupData).toString('base64');
    
    return NextResponse.json({
      success: true,
      downloadUrl: `data:application/json;base64,${blob}`,
      filename: `tsvweb-backup-${id}.json`,
      backup
    });

  } catch (error) {
    console.error('Download backup error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to download backup' },
      { status: 500 }
    );
  }
}
