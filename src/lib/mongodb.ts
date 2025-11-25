import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local if MONGODB_URI is not already set (useful for ts-node scripts)
// This is done lazily in connectDB() to avoid build-time errors
function ensureMongoDBUri(): string {
  if (!process.env.MONGODB_URI) {
    dotenv.config({ path: path.join(__dirname, '../../.env.local') });
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MONGODB_URI to .env.local');
  }

  return process.env.MONGODB_URI;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Get MongoDB URI only when actually connecting (not at import time)
    const MONGODB_URI = ensureMongoDBUri();

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      const dbName = mongoose.connection.db?.databaseName;
      const host = mongoose.connection.host;
      console.log('✅ MongoDB connected successfully');
      console.log('📊 Database:', dbName, '@ Host:', host);
      console.log('🔗 Connection string preview:', MONGODB_URI.substring(0, 50) + '...');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
}

// Export as default and as named export to support both import styles:
// - import connectDB from '@/lib/mongodb' (default)
// - import { connectDB } from '@/lib/mongodb' (named)
export default connectDB;
export { connectDB };
