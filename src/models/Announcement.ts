import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAnnouncement extends Document {
  title: string
  content: string
  type: 'info' | 'warning' | 'success' | 'urgent'
  customColor?: string
  targetAudience: 'all' | 'customers' | 'admins' | 'public'
  displayLocation: Array<'dashboard' | 'header' | 'footer' | 'contact'>
  isActive: boolean
  publishedAt?: Date
  expiresAt?: Date
  emailSent: boolean
  emailSentAt?: Date
  viewedBy: Array<{
    userId: mongoose.Types.ObjectId
    viewedAt: Date
  }>
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'urgent'],
      default: 'info'
    },
    customColor: {
      type: String,
      default: null
    },
    targetAudience: {
      type: String,
      enum: ['all', 'customers', 'admins', 'public'],
      default: 'customers'
    },
    displayLocation: {
      type: [String],
      enum: ['dashboard', 'header', 'footer', 'contact'],
      default: ['dashboard']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    publishedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: null
    },
    emailSent: {
      type: Boolean,
      default: false
    },
    emailSentAt: {
      type: Date,
      default: null
    },
    viewedBy: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      viewedAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

// Index for efficient queries
AnnouncementSchema.index({ isActive: 1, publishedAt: -1 })
AnnouncementSchema.index({ expiresAt: 1 })
AnnouncementSchema.index({ 'viewedBy.userId': 1 })

const Announcement: Model<IAnnouncement> = 
  mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema)

export default Announcement
