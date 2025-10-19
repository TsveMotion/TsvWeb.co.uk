import mongoose from 'mongoose';

const BackupSchema = new mongoose.Schema({
  backupId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  type: {
    type: String,
    required: true,
    default: 'database'
  },
  size: {
    type: Number,
    required: true
  },
  collections: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  metadata: {
    collectionNames: [String],
    totalDocuments: Number,
    createdBy: String
  }
}, {
  timestamps: true
});

export const Backup = mongoose.models.Backup || mongoose.model('Backup', BackupSchema);
