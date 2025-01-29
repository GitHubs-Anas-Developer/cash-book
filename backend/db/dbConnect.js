const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.log("❌ MongoDB connection error:", error);
  }
};

module.exports = dbConnect;
