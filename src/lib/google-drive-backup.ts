import { google } from 'googleapis';
import { connectToDatabase } from './db';
import { User } from '@/models/User';

// Get Google Drive client for a user
async function getDriveClient(userEmail: string) {
  await connectToDatabase();
  
  const user = await User.findOne({ email: userEmail.toLowerCase() });
  
  console.log('getDriveClient - User found:', {
    email: userEmail,
    hasUser: !!user,
    hasGoogleId: !!user?.googleId,
    hasAccessToken: !!user?.googleAccessToken,
    hasRefreshToken: !!user?.googleRefreshToken
  });
  
  if (!user || !user.googleId) {
    throw new Error('User not connected to Google Drive');
  }
  
  if (!user.googleAccessToken || !user.googleRefreshToken) {
    throw new Error('No Google Drive tokens found. Please reconnect your Google account.');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + '/api/auth/callback/google'
  );

  // Set credentials from user's stored tokens
  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

// Create or get TsvWeb Backups folder
async function getOrCreateBackupFolder(drive: any): Promise<string> {
  const folderName = 'TsvWeb Backups';
  
  // Search for existing folder
  const response = await drive.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive'
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id;
  }

  // Create folder if it doesn't exist
  const folderMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder'
  };

  const folder = await drive.files.create({
    requestBody: folderMetadata,
    fields: 'id'
  });

  return folder.data.id;
}

// Upload backup to Google Drive
export async function uploadBackupToDrive(
  userEmail: string,
  backupData: any,
  filename: string
): Promise<{ fileId: string; webViewLink: string }> {
  const drive = await getDriveClient(userEmail);
  const folderId = await getOrCreateBackupFolder(drive);

  const fileMetadata = {
    name: filename,
    parents: [folderId],
    description: `TsvWeb database backup created on ${new Date().toLocaleString()}`
  };

  const media = {
    mimeType: 'application/json',
    body: JSON.stringify(backupData, null, 2)
  };

  const file = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, webViewLink, size'
  });

  return {
    fileId: file.data.id,
    webViewLink: file.data.webViewLink
  };
}

// List backups from Google Drive
export async function listDriveBackups(userEmail: string): Promise<any[]> {
  try {
    const drive = await getDriveClient(userEmail);
    const folderId = await getOrCreateBackupFolder(drive);

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false and mimeType='application/json'`,
      fields: 'files(id, name, createdTime, size, webViewLink)',
      orderBy: 'createdTime desc',
      pageSize: 100
    });

    return (response.data.files || []).map((file: any) => ({
      id: file.id,
      name: file.name,
      date: new Date(file.createdTime).toLocaleString(),
      timestamp: file.createdTime,
      size: parseInt(file.size || '0'),
      sizeFormatted: formatBytes(parseInt(file.size || '0')),
      webViewLink: file.webViewLink,
      source: 'google-drive'
    }));
  } catch (error) {
    console.error('Error listing Drive backups:', error);
    return [];
  }
}

// Download backup from Google Drive
export async function downloadBackupFromDrive(
  userEmail: string,
  fileId: string
): Promise<any> {
  const drive = await getDriveClient(userEmail);

  const response = await drive.files.get({
    fileId: fileId,
    alt: 'media'
  }, {
    responseType: 'json'
  });

  return response.data;
}

// Delete backup from Google Drive
export async function deleteBackupFromDrive(
  userEmail: string,
  fileId: string
): Promise<boolean> {
  try {
    const drive = await getDriveClient(userEmail);
    
    await drive.files.delete({
      fileId: fileId
    });

    return true;
  } catch (error) {
    console.error('Error deleting Drive backup:', error);
    return false;
  }
}

// Format bytes to human readable
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
