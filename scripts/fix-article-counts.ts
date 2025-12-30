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
    }

    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Get all categories
    const categories = await Category.find({});
    console.log(`\n📊 Found ${categories.length} categories`);

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
      });

      console.log(
        `📝 ${category.name}: ${category.articleCount} → ${publishedCount} articles`
      );
    }

    console.log("\n✅ Article counts fixed successfully!");

    // Disconnect
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error fixing article counts:", error);
    process.exit(1);
  }
}

// Run the script
fixArticleCounts();
