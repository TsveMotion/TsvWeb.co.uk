import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplateItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface IInvoiceTemplate extends Document {
  name: string;
  type: 'invoice' | 'quote';
  items: ITemplateItem[];
  taxRate: number;
  currency: string;
  terms?: string;
  notes?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateItemSchema = new Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0, default: 1 },
  unitPrice: { type: Number, required: true, min: 0 }
});

const InvoiceTemplateSchema = new Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['invoice', 'quote'], 
    required: true 
  },
  items: [TemplateItemSchema],
  taxRate: { type: Number, required: true, min: 0, max: 100, default: 0 },
  currency: { type: String, default: 'USD' },
  terms: { type: String },
  notes: { type: String },
  isDefault: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.models.InvoiceTemplate || mongoose.model<IInvoiceTemplate>('InvoiceTemplate', InvoiceTemplateSchema);
