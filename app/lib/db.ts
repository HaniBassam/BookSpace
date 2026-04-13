import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached =
  globalThis.mongooseCache ?? (globalThis.mongooseCache = { conn: null, promise: null });

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI);
  }

  cached.conn = await cached.promise;

  return cached.conn;
}
