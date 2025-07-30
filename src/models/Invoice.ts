import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  type: 'invoice' | 'quote';
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  customerPhone?: string;
  items: IInvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  dueDate?: Date;
  issueDate: Date;
  notes?: string;
  terms?: string;
  viewedAt?: Date;
  viewCount: number;
  paidAt?: Date;
  emailSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  unitPrice: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 }
});

const InvoiceSchema = new Schema({
  invoiceNumber: { 
    type: String, 
    required: false, 
    unique: true,
    index: true 
  },
  type: { 
    type: String, 
    enum: ['invoice', 'quote'], 
    required: true,
    index: true 
  },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true, index: true },
  customerAddress: { type: String },
  customerPhone: { type: String },
  items: [InvoiceItemSchema],
  subtotal: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true, min: 0 },
  taxRate: { type: Number, required: true, min: 0, max: 100 },
  total: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'], 
    default: 'draft',
    index: true 
  },
  dueDate: { type: Date },
  issueDate: { type: Date, default: Date.now },
  notes: { type: String },
  terms: { type: String },
  viewedAt: { type: Date },
  viewCount: { type: Number, default: 0 },
  paidAt: { type: Date },
  emailSentAt: { type: Date },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'expired', 'refunded'],
      default: 'pending'
    },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    amount: { type: Number },
    currency: { type: String },
    paidAt: { type: Date },
    failedAt: { type: Date },
    expiredAt: { type: Date },
    refundedAt: { type: Date },
    tosAcceptedAt: { type: Date },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true
});

// Generate invoice number automatically
InvoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const prefix = this.type === 'invoice' ? 'INV' : 'QUO';
    try {
      // Use this.constructor to reference the model
      const count = await (this.constructor as any).countDocuments({ type: this.type });
      this.invoiceNumber = `${prefix}-${String(count + 1).padStart(4, '0')}`;
    } catch (error) {
      console.error('Error generating invoice number:', error);
      // Fallback to timestamp-based number
      const timestamp = Date.now().toString().slice(-4);
      this.invoiceNumber = `${prefix}-${timestamp}`;
    }
  }
  next();
});

// Update status based on dates
InvoiceSchema.pre('save', function(next) {
  if (this.type === 'invoice' && this.dueDate && new Date() > this.dueDate) {
    if (this.status === 'sent' || this.status === 'viewed') {
      this.status = 'overdue';
    }
  }
  next();
});

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
