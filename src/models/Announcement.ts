import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAnnouncement extends Document {
  title: string
  message: string
  content?: string // Keep for backward compatibility
  type: 'info' | 'warning' | 'success' | 'error'
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'scheduled' | 'archived'
  startDate?: Date
  endDate?: Date
  targetAudience?: string
  customColor?: string
  displayLocation?: Array<'dashboard' | 'header' | 'footer' | 'contact'>
  isActive?: boolean
  publishedAt?: Date
  expiresAt?: Date
  emailSent?: boolean
  emailSentAt?: Date
  viewedBy?: Array<{
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
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true
    },
    content: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'error'],
      default: 'info'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['active', 'scheduled', 'archived'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: null
    },
    targetAudience: {
      type: String,
      default: ''
    },
    customColor: {
      type: String,
      default: null
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

// Force delete cached model to ensure schema updates are applied
if (mongoose.models.Announcement) {
  delete mongoose.models.Announcement
}

const Announcement: Model<IAnnouncement> = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema)

export default Announcement
