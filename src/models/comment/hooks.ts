import { CommentSchema, CommentDocument } from "./document";
import mongoose from "mongoose";

export function attachHooks() {
  // Increment article comment count when comment is approved
  CommentSchema.post("save", async function (doc) {
    if (doc.status === "approved") {
      await mongoose.models.Article.findByIdAndUpdate(doc.article, {
        $inc: { commentCount: 1 },
      });
    }
  });

  // Decrement article comment count when approved comment is deleted
  CommentSchema.pre("deleteOne", async function (this: any, next) {
    const doc = await this.model.findOne(this.getFilter());
    if (doc && doc.status === "approved") {
      await mongoose.models.Article.findByIdAndUpdate(doc.article, {
        $inc: { commentCount: -1 },
      });
    }
    next();
  });

  // Prevent self-referencing parent
  CommentSchema.pre("save", async function (this: CommentDocument, next) {
    if (this.parent && this.parent.toString() === (this._id as any).toString()) {
      throw new Error("Comment cannot be its own parent");
    }
    next();
  });
}
