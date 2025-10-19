import { connectToDatabase } from './db';
import { Backup } from '@/models/Backup';

// Generate unique backup ID
export function generateBackupId(): string {
  return `backup-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

// Save backup to database
export async function saveBackup(backupId: string, data: any): Promise<string> {
  await connectToDatabase();
  
  const collectionNames = Object.keys(data.collections || {});
  let totalDocuments = 0;
  
  for (const collectionName of collectionNames) {
    const collectionData = data.collections[collectionName];
    if (Array.isArray(collectionData)) {
      totalDocuments += collectionData.length;
    }
  }
  
  const backup = new Backup({
    backupId,
    timestamp: new Date(data.timestamp || Date.now()),
    type: data.type || 'database',
    size: Buffer.byteLength(JSON.stringify(data)),
    collections: data.collections,
    metadata: {
      collectionNames,
      totalDocuments,
      createdBy: 'admin'
    }
  });
  
  await backup.save();
  return backupId;
}

// List all backups
export async function listBackups(): Promise<any[]> {
  await connectToDatabase();
  
  const backups = await Backup.find()
    .select('backupId timestamp type size metadata')
    .sort({ timestamp: -1 })
    .lean();
  
  return backups.map(backup => ({
    id: backup.backupId,
    timestamp: backup.timestamp,
    type: backup.type,
    size: backup.size,
    name: `Backup ${new Date(backup.timestamp).toLocaleDateString()}`,
    date: new Date(backup.timestamp).toLocaleString(),
    sizeFormatted: formatBytes(backup.size),
    collections: backup.metadata?.collectionNames || []
  }));
}

// Get backup by ID
export async function getBackup(backupId: string): Promise<any | null> {
  await connectToDatabase();
  
  const backup = await Backup.findOne({ backupId }).lean() as any;
  
  if (!backup) {
    return null;
  }
  
  return {
    timestamp: backup.timestamp,
    type: backup.type,
    collections: backup.collections
  };
}

// Delete backup
export async function deleteBackup(backupId: string): Promise<boolean> {
  await connectToDatabase();
  
  const result = await Backup.deleteOne({ backupId });
  return result.deletedCount > 0;
}

// Format bytes to human readable
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
