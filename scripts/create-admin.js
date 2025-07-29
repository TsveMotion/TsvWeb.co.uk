/**
 * Script to create an initial admin user in the database
 * Run with: node scripts/create-admin.js
 */

const mongoose = require('mongoose');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Manual environment loading (instead of dotenv)
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    // Parse each line
    envContent.split('\n').forEach(line => {
      // Skip comments and empty lines
      if (!line || line.startsWith('#')) return;
      
      // Extract key and value
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        envVars[key] = value;
        // Also set to process.env
        process.env[key] = value;
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error loading .env.local file:', error.message);
    return {};
  }
}

// Load environment variables
const env = loadEnv();

// User Schema (copied from the model)
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
  },
  {
    timestamps: true,
  }
);

// Method to validate password
UserSchema.methods.validatePassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.email, 1000, 64, 'sha512')
    .toString('hex');
  return this.password === hash;
};

// Pre-save hook to hash password
UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const hash = crypto
    .pbkdf2Sync(this.password, this.email, 1000, 64, 'sha512')
    .toString('hex');
  
  this.password = hash;
  next();
});

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsvweb';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get admin credentials from environment
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tsvweb.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Administrator';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:', adminEmail);
      return;
    }

    // Create new admin user
    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

// Run the script
createAdmin();
