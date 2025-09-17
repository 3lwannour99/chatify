import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { MONGO_URI } = process.env;
    if (!MONGO_URI) throw new Error("NONGO_URI is not set");

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGODB connected successfully", conn.connection.host);
  } catch (error) {
    console.log("Error connecting to MONGODB", error);
    process.exit(1); // 1 means fail , 0 means success
  }
};
