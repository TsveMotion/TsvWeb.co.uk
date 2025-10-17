import mongoose from 'mongoose'

export interface ILead {
  _id?: string
  name: string
  email: string
  phone?: string
  googleMapsLink?: string
  interestLevel: 'Very Interested' | 'Somewhat Interested' | 'Neutral' | 'Unlikely'
  status: 'New Lead' | 'Contacted' | 'Follow-Up Needed' | 'Converted' | 'Lost' | 'Viewed Presentation'
  notes?: string
  source: 'Manual' | 'Presentation' | 'Website' | 'Referral'
  dateAdded: Date
  lastContacted?: Date
  createdAt?: Date
  updatedAt?: Date
}

const LeadSchema = new mongoose.Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    googleMapsLink: {
      type: String,
      trim: true,
    },
    interestLevel: {
      type: String,
      enum: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Unlikely'],
      default: 'Neutral',
    },
    status: {
      type: String,
      enum: ['New Lead', 'Contacted', 'Follow-Up Needed', 'Converted', 'Lost', 'Viewed Presentation'],
      default: 'New Lead',
    },
    notes: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ['Manual', 'Presentation', 'Website', 'Referral'],
      default: 'Manual',
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
    lastContacted: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster searches
LeadSchema.index({ email: 1 })
LeadSchema.index({ status: 1 })
LeadSchema.index({ interestLevel: 1 })
LeadSchema.index({ dateAdded: -1 })

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema)
