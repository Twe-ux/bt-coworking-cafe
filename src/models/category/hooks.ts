import { CategorySchema } from "./document";
import slugify from "slugify";
import mongoose from "mongoose";

export function attachHooks() {
  // Auto-generate slug from name if not provided
  CategorySchema.pre("save", async function (next) {
    if (this.isModified("name") && !this.slug) {
      this.slug = slugify(this.name, {
        lower: true,
        strict: true,
        trim: true,
      });
    }
    next();
  });

  // Validate that parent is not self
  CategorySchema.pre("save", async function (next) {
    if (this.parent && this.parent.toString() === this._id.toString()) {
      throw new Error("Category cannot be its own parent");
    }
    next();
  });

  // Prevent deletion if category has articles
  CategorySchema.pre("remove", async function (next) {
    if (this.articleCount > 0) {
      throw new Error(
        "Cannot delete category with articles. Move or delete articles first."
      );
    }

    // Check if category has children
    const childrenCount = await mongoose.models.Category.countDocuments({
      parent: this._id,
    });

    if (childrenCount > 0) {
      throw new Error(
        "Cannot delete category with subcategories. Delete subcategories first."
      );
    }

    next();
  });
}
