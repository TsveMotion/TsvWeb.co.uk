import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuoteRequest extends Document {
  name: string;
  email: string;
  slug: string;
  businessName?: string;
  website?: string;
  industry?: string;
  services: string[];
  additionalRequirements?: string;
  estimatedCost?: {
    monthly: number;
    oneOff: number;
  };
  seoAuditSent: boolean;
  status: 'pending' | 'contacted' | 'quoted' | 'converted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

const QuoteRequestSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    services: {
      type: [String],
      default: [],
    },
    additionalRequirements: {
      type: String,
      trim: true,
    },
    estimatedCost: {
      monthly: {
        type: Number,
        default: 0,
      },
      oneOff: {
        type: Number,
        default: 0,
      },
    },
    seoAuditSent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'quoted', 'converted', 'declined'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster slug lookups
QuoteRequestSchema.index({ slug: 1 });
QuoteRequestSchema.index({ email: 1 });

const QuoteRequest: Model<IQuoteRequest> =
  mongoose.models.QuoteRequest || mongoose.model<IQuoteRequest>('QuoteRequest', QuoteRequestSchema);

export default QuoteRequest;
