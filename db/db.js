const mongoose = require("mongoose");

async function connectToDb() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Optional: exit process if DB connection is critical
    // process.exit(1);
  }
}

module.exports = connectToDb;
