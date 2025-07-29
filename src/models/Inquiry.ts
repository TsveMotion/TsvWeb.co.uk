import { mongoose } from '../lib/db';
import { Schema } from 'mongoose';

export interface IInquiry {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  readAt?: Date;
  repliedAt?: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    phone: { type: String },
    status: { 
      type: String, 
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
      required: true 
    },
    readAt: { type: Date },
    repliedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Create text indexes for search functionality
InquirySchema.index({ 
  name: 'text', 
  email: 'text', 
  subject: 'text',
  message: 'text'
});

export const Inquiry = mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
