import { ArticleSchema } from "./document";
import slugify from "slugify";
import mongoose from "mongoose";

export function attachHooks() {
  // Auto-generate slug from title
  ArticleSchema.pre("save", async function (next) {
    if (this.isModified("title") && !this.slug) {
      this.slug = slugify(this.title, {
        lower: true,
        strict: true,
        trim: true,
      });

      // Ensure slug is unique
      const existingArticle = await mongoose.models.Article.findOne({
        slug: this.slug,
      });
      if (existingArticle) {
        this.slug = `${this.slug}-${Date.now()}`;
      }
    }

    // Auto-set publishedAt when status becomes published
    if (
      this.isModified("status") &&
      this.status === "published" &&
      !this.publishedAt
    ) {
      this.publishedAt = new Date();
    }

    next();
  });

  // Update category article count when article is published
  ArticleSchema.post("save", async function (doc) {
    if (doc.status === "published" && doc.category) {
      await mongoose.models.Category.findByIdAndUpdate(doc.category, {
        $inc: { articleCount: 1 },
      });
    }
  });

  // Update counters when article is deleted
  ArticleSchema.pre("remove", async function (next) {
    // Decrement articleCount in category
    if (this.category) {
      await mongoose.models.Category.findByIdAndUpdate(this.category, {
        $inc: { articleCount: -1 },
      });
    }

    // Decrement articleCount in tags
    if (this.tags && this.tags.length > 0) {
      await mongoose.models.Tag.updateMany(
        { _id: { $in: this.tags } },
        { $inc: { articleCount: -1 } }
      );
    }

    next();
  });
}
