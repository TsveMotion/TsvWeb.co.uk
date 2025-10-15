import { mongoose } from '../lib/db';
import { Schema } from 'mongoose';
import crypto from 'crypto';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'admin' | 'editor';
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  googleId?: string;
  googleEmail?: string;
  validatePassword: (password: string) => boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    phone: { type: String },
    role: { 
      type: String, 
      enum: ['admin', 'editor'],
      default: 'editor',
      required: true 
    },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    googleId: { type: String },
    googleEmail: { type: String },
  },
  {
    timestamps: true,
  }
);

// Method to validate password
UserSchema.methods.validatePassword = function(password: string): boolean {
  // Create hash of input password with same salt
  const hash = crypto
    .pbkdf2Sync(password, this.email, 1000, 64, 'sha512')
    .toString('hex');
  
  // Compare with stored hash
  return this.password === hash;
};

// Pre-save hook to hash password before saving
UserSchema.pre('save', function(next) {
  // Skip if no password (OAuth users)
  if (!this.password) {
    return next();
  }
  
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) {
    return next();
  }

  // Hash password using email as salt (in production, use a proper salt)
  const hash = crypto
    .pbkdf2Sync(this.password, this.email, 1000, 64, 'sha512')
    .toString('hex');
  
  this.password = hash;
  next();
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
