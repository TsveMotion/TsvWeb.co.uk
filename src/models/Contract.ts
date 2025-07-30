import { mongoose } from '../lib/db';
import { Schema } from 'mongoose';

export interface IContract {
  _id?: string;
  title: string;
  description?: string;
  contractType: 'web_development' | 'maintenance' | 'hosting' | 'consultation' | 'design' | 'custom';
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';
  userId: string; // Reference to User
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  
  // Contract details
  amount: number;
  currency: string;
  startDate?: Date;
  endDate?: Date;
  duration?: number; // in months
  
  // File management
  files: {
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimeType: string;
    uploadedAt: Date;
    uploadedBy: string; // User ID
  }[];
  
  // E-signature
  signatureRequestId?: string; // For DocuSign/SignRequest integration
  signedAt?: Date;
  signedBy?: string;
  signatureUrl?: string;
  
  // Email tracking
  sentAt?: Date;
  lastEmailSent?: Date;
  emailsSent: {
    sentAt: Date;
    sentBy: string;
    recipient: string;
    subject: string;
    status: 'sent' | 'delivered' | 'opened' | 'failed';
  }[];
  
  // Notes and communication
  notes: {
    content: string;
    createdBy: string;
    createdAt: Date;
    isPrivate: boolean; // Internal notes not visible to client
  }[];
  
  // Metadata
  createdBy: string; // Admin user ID
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema = new Schema<IContract>(
  {
    title: { type: String, required: true },
    description: { type: String },
    contractType: {
      type: String,
      enum: ['web_development', 'maintenance', 'hosting', 'consultation', 'design', 'custom'],
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'signed', 'expired', 'cancelled'],
      default: 'draft',
      required: true
    },
    userId: { type: String, required: true }, // Reference to client user
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientCompany: { type: String },
    
    // Contract details
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    startDate: { type: Date },
    endDate: { type: Date },
    duration: { type: Number }, // in months
    
    // File management
    files: [{
      filename: { type: String, required: true },
      originalName: { type: String, required: true },
      path: { type: String, required: true },
      size: { type: Number, required: true },
      mimeType: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
      uploadedBy: { type: String, required: true }
    }],
    
    // E-signature
    signatureRequestId: { type: String },
    signedAt: { type: Date },
    signedBy: { type: String },
    signatureUrl: { type: String },
    
    // Email tracking
    sentAt: { type: Date },
    lastEmailSent: { type: Date },
    emailsSent: [{
      sentAt: { type: Date, required: true },
      sentBy: { type: String, required: true },
      recipient: { type: String, required: true },
      subject: { type: String, required: true },
      status: {
        type: String,
        enum: ['sent', 'delivered', 'opened', 'failed'],
        default: 'sent'
      }
    }],
    
    // Notes and communication
    notes: [{
      content: { type: String, required: true },
      createdBy: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      isPrivate: { type: Boolean, default: false }
    }],
    
    // Metadata
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ContractSchema.index({ userId: 1 });
ContractSchema.index({ status: 1 });
ContractSchema.index({ contractType: 1 });
ContractSchema.index({ clientEmail: 1 });
ContractSchema.index({ createdAt: -1 });

// Virtual for expired status check
ContractSchema.virtual('isExpired').get(function() {
  if (!this.endDate) return false;
  return new Date() > this.endDate && this.status !== 'signed';
});

const Contract = mongoose.models.Contract || mongoose.model<IContract>('Contract', ContractSchema);

export default Contract;
