import { mongoose } from '../lib/db';
import { Schema } from 'mongoose';

export interface IBlogPost {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: string;
  status: 'draft' | 'published';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    coverImage: { type: String },
    author: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['draft', 'published'], 
      default: 'draft', 
      required: true 
    },
    tags: [{ type: String }],
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Create text indexes for search functionality
BlogPostSchema.index({ 
  title: 'text', 
  content: 'text', 
  excerpt: 'text',
  tags: 'text' 
});

// Add a pre-save hook to generate slug if not provided
BlogPostSchema.pre('save', function (next) {
  // If slug is not provided, generate from title
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  }
  next();
});

export const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
