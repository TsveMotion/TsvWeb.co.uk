import mongoose from 'mongoose';

// MongoDB connection string - replace with your actual connection string
// For production, this should be stored in an environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsvweb';

// Cached connection
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB database
 */
export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB successfully');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);
      console.error('💡 Make sure MongoDB is running on port 27017 or update MONGODB_URI in .env.local');
      
      // Reset the promise so we can try again
      cached.promise = null;
      throw error;
    });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Reset both promise and connection on error
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}

// Export mongoose for model creation
export { mongoose };
