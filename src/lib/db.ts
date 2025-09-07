import mongoose from "mongoose";

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (!global.mongooseCache) {
    global.mongooseCache = { conn: null, promise: null };
  }

  if (global.mongooseCache.conn) {
    console.log("mongoDB is already connected");
    return global.mongooseCache.conn;
  }

  if (!global.mongooseCache.promise) {
    const dbUrl = process.env.MONGODB_URI;
    if (!dbUrl) throw new Error("MONGODB_URI is not defined");

    global.mongooseCache.promise = mongoose
      .connect(dbUrl, {
        serverSelectionTimeoutMS: 30000, // wait up to 30s for Atlas
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  try {
    global.mongooseCache.conn = await global.mongooseCache.promise;
    console.log("mongoDB connected");
    return global.mongooseCache.conn;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
};

export default connectDB;
