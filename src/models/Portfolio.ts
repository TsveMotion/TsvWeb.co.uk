import { mongoose } from '../lib/db';
import { Schema } from 'mongoose';

export interface IPortfolio {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  clientName?: string;
  projectType: string;
  technologies: string[];
  images: string[];
  thumbnailImage: string;
  projectUrl?: string;
  featured: boolean;
  completionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    clientName: { type: String },
    projectType: { type: String, required: true },
    technologies: [{ type: String }],
    images: [{ type: String }],
    thumbnailImage: { type: String, required: true },
    projectUrl: { type: String },
    featured: { type: Boolean, default: false },
    completionDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Create text indexes for search functionality
PortfolioSchema.index({ 
  title: 'text', 
  description: 'text', 
  shortDescription: 'text',
  clientName: 'text',
  technologies: 'text'
});

// Add a pre-save hook to generate slug if not provided
PortfolioSchema.pre('save', function (next) {
  // If slug is not provided, generate from title
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  }
  next();
});

export const Portfolio = mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
