import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IMaintenanceMode extends Document {
  isEnabled: boolean
  message: string
  scope: 'tsvweb' | 'all' // 'tsvweb' = only tsvweb.co.uk, 'all' = all TSVWeb client websites
  scheduledStart?: Date
  scheduledEnd?: Date
  autoDisable: boolean
  autoDisableDuration?: number // in minutes
  customMessage?: string
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  enabledAt?: Date
  disabledAt?: Date
}

const MaintenanceModeSchema = new Schema<IMaintenanceMode>(
  {
    isEnabled: {
      type: Boolean,
      required: true,
      default: false
    },
    message: {
      type: String,
      required: true,
      default: '⚠️ SERVICES MAY BE DOWN\nWEBSITES ARE ALL UNDER MAINTENANCE'
    },
    scope: {
      type: String,
      enum: ['tsvweb', 'all'],
      required: true,
      default: 'tsvweb'
    },
    scheduledStart: {
      type: Date,
      default: null
    },
    scheduledEnd: {
      type: Date,
      default: null
    },
    autoDisable: {
      type: Boolean,
      default: false
    },
    autoDisableDuration: {
      type: Number,
      default: null // in minutes
    },
    customMessage: {
      type: String,
      default: null
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    enabledAt: {
      type: Date,
      default: null
    },
    disabledAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

// Index for efficient queries
MaintenanceModeSchema.index({ isEnabled: 1 })
MaintenanceModeSchema.index({ scheduledStart: 1, scheduledEnd: 1 })

// Force delete cached model to ensure schema updates are applied
if (mongoose.models.MaintenanceMode) {
  delete mongoose.models.MaintenanceMode
}

const MaintenanceMode: Model<IMaintenanceMode> = mongoose.model<IMaintenanceMode>('MaintenanceMode', MaintenanceModeSchema)

export default MaintenanceMode
