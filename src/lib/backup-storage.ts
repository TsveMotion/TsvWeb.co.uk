import fs from 'fs';
import path from 'path';

// Backup storage directory
const BACKUP_DIR = path.join(process.cwd(), 'backups-tsvweb');

// Ensure backup directory exists
export function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

// Generate unique backup ID
export function generateBackupId(): string {
  return `backup-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

// Save backup to file system
export async function saveBackup(backupId: string, data: any): Promise<string> {
  ensureBackupDir();
  
  const backupPath = path.join(BACKUP_DIR, backupId);
  
  // Create backup directory
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }
  
  // Save backup data
  const filePath = path.join(backupPath, 'backup.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  
  // Save metadata
  const metadata = {
    id: backupId,
    timestamp: new Date().toISOString(),
    type: data.type || 'database',
    size: Buffer.byteLength(JSON.stringify(data)),
    collections: Object.keys(data.collections || {}),
  };
  
  const metadataPath = path.join(backupPath, 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  return backupId;
}

// List all backups
export async function listBackups(): Promise<any[]> {
  ensureBackupDir();
  
  const backups: any[] = [];
  const entries = fs.readdirSync(BACKUP_DIR);
  
  for (const entry of entries) {
    const backupPath = path.join(BACKUP_DIR, entry);
    const metadataPath = path.join(backupPath, 'metadata.json');
    
    if (fs.existsSync(metadataPath)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        backups.push({
          ...metadata,
          name: `Backup ${new Date(metadata.timestamp).toLocaleDateString()}`,
          date: new Date(metadata.timestamp).toLocaleString(),
          sizeFormatted: formatBytes(metadata.size),
        });
      } catch (error) {
        console.error(`Error reading backup metadata for ${entry}:`, error);
      }
    }
  }
  
  // Sort by timestamp (newest first)
  return backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Get backup by ID
export async function getBackup(backupId: string): Promise<any | null> {
  const backupPath = path.join(BACKUP_DIR, backupId, 'backup.json');
  
  if (!fs.existsSync(backupPath)) {
    return null;
  }
  
  try {
    return JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
  } catch (error) {
    console.error(`Error reading backup ${backupId}:`, error);
    return null;
  }
}

// Delete backup
export async function deleteBackup(backupId: string): Promise<boolean> {
  const backupPath = path.join(BACKUP_DIR, backupId);
  
  if (!fs.existsSync(backupPath)) {
    return false;
  }
  
  try {
    fs.rmSync(backupPath, { recursive: true, force: true });
    return true;
  } catch (error) {
    console.error(`Error deleting backup ${backupId}:`, error);
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
