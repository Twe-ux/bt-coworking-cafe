import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env.local") });

// Import models to register them
import { Category } from "../src/models/category/index.js";
import { Article } from "../src/models/article/index.js";

async function fixArticleCounts() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }    await mongoose.connect(mongoUri);
    // Get all categories
    const categories = await Category.find({});
    // Reset all article counts and recalculate
    for (const category of categories) {
      // Count published articles in this category
      const publishedCount = await Article.countDocuments({
        category: category._id,
        status: "published",
      });

      // Update the category with the correct count
      await Category.findByIdAndUpdate(category._id, {
        articleCount: publishedCount,
      });    }
    // Disconnect
    await mongoose.disconnect();  } catch (error) {    process.exit(1);
  }
}

// Run the script
fixArticleCounts();
