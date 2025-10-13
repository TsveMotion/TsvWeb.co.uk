import { mongoose } from '@/lib/db';
import { Schema } from 'mongoose';

export type AgreementStatus = 'draft' | 'sent' | 'signed' | 'cancelled' | 'expired';

export interface IAgreement {
  _id?: string;
  title: string;
  description?: string;
  token: string; // unique public token used in the signing link
  status: AgreementStatus;

  // parties
  userId?: string; // optional link to existing user
  clientName: string;
  clientEmail: string;
  clientCompany?: string;

  companyName: string; // e.g., TsvWeb
  companySignerName?: string; // set when sending

  // document
  pdfPath?: string; // /uploads/agreements/<file>
  pdfOriginalName?: string;
  pdfSize?: number;
  pdfMimeType?: string;

  // signatures
  clientSignatureName?: string;
  clientSignedAt?: Date;
  clientSignatureIp?: string;
  clientSignatureUserAgent?: string;

  companySignedAt?: Date;

  // audit
  sentAt?: Date;
  views: number;

  createdBy: string; // admin id/email
  updatedBy?: string;

  createdAt: Date;
  updatedAt: Date;
}

const AgreementSchema = new Schema<IAgreement>({
  title: { type: String, required: true },
  description: { type: String },
  token: { type: String, required: true, unique: true, index: true },
  status: { type: String, enum: ['draft', 'sent', 'signed', 'cancelled', 'expired'], default: 'draft' },

  userId: { type: String },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientCompany: { type: String },

  companyName: { type: String, default: 'TsvWeb' },
  companySignerName: { type: String },

  pdfPath: { type: String },
  pdfOriginalName: { type: String },
  pdfSize: { type: Number },
  pdfMimeType: { type: String },

  clientSignatureName: { type: String },
  clientSignedAt: { type: Date },
  clientSignatureIp: { type: String },
  clientSignatureUserAgent: { type: String },

  companySignedAt: { type: Date },

  sentAt: { type: Date },
  views: { type: Number, default: 0 },

  createdBy: { type: String, required: true },
  updatedBy: { type: String },
}, { timestamps: true });

AgreementSchema.index({ clientEmail: 1, createdAt: -1 });
AgreementSchema.index({ userId: 1 });

const Agreement = mongoose.models.Agreement || mongoose.model<IAgreement>('Agreement', AgreementSchema);
export default Agreement;
