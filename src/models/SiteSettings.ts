import { mongoose } from '../lib/db';
import { Schema } from 'mongoose';

export interface ISiteSettings {
  _id?: string;
  siteName: string;
  tagline: string;
  description: string;
  logo?: string;
  favicon?: string;
  contactEmail: string;
  phoneNumber?: string;
  address?: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
    youtube?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    ogImage?: string;
  };
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String },
    favicon: { type: String },
    contactEmail: { type: String, required: true },
    phoneNumber: { type: String },
    address: { type: String },
    socialMedia: {
      facebook: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
      instagram: { type: String },
      github: { type: String },
      youtube: { type: String },
    },
    seo: {
      metaTitle: { type: String, required: true },
      metaDescription: { type: String, required: true },
      metaKeywords: [{ type: String }],
      ogImage: { type: String },
    },
    analytics: {
      googleAnalyticsId: { type: String },
      facebookPixelId: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
