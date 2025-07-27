import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL!;

if (!MONGO_URL) {
  throw new Error("Please define the mongo url in the .env file");
}

// Extend the global namespace to include mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

// Use the global mongoose cache or create a new one
let cached = globalThis.mongooseCache;

if (!cached) {
  cached = globalThis.mongooseCache = { conn: null, promise: null };
}

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };
    
    cached!.promise = mongoose.connect(MONGO_URL, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}