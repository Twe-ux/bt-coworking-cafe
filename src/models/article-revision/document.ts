import { ObjectId, Schema, Types, Document } from "mongoose";
import type { ArticleRevision } from "./index";

/** Document of an {@link ArticleRevision}, as stored in the database. */
export interface ArticleRevisionDocument extends Document {
  article: ObjectId;
  user: ObjectId;
  title: string;
  content: string;
  excerpt?: string;
  changeDescription?: string;
  createdAt: Date;
}

/** Schema used to validate ArticleRevision objects for the database. */
export const ArticleRevisionSchema = new Schema<
  ArticleRevisionDocument,
  ArticleRevision
>(
  {
    article: {
      type: Types.ObjectId,
      ref: "Article",
      required: [true, "Article reference is required"],
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
    },
    changeDescription: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only track creation time
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
ArticleRevisionSchema.index({ article: 1, createdAt: -1 });
ArticleRevisionSchema.index({ user: 1 });
