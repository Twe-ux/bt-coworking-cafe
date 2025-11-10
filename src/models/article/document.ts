import { ObjectId, Schema, Types, Document } from "mongoose";
import type { Article } from "./index";

/** Document of an {@link Article}, as stored in the database. */
export interface ArticleDocument extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  author: ObjectId;
  category: ObjectId;
  tags: ObjectId[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  status: "draft" | "published" | "archived" | "scheduled";
  publishedAt?: Date;
  scheduledFor?: Date;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isFeatured: boolean;
  allowComments: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/** Schema used to validate Article objects for the database. */
export const ArticleSchema = new Schema<ArticleDocument, Article>(
  {
    title: {
      type: String,
      required: [true, "Article title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Article slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Article content is required"],
    },
    featuredImage: {
      type: String,
    },
    featuredImageAlt: {
      type: String,
      trim: true,
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Article author is required"],
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "Article category is required"],
    },
    tags: [
      {
        type: Types.ObjectId,
        ref: "Tag",
      },
    ],
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [60, "Meta title cannot exceed 60 characters"],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    metaKeywords: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived", "scheduled"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    scheduledFor: {
      type: Date,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for search and performance
ArticleSchema.index({ slug: 1 });
ArticleSchema.index({ author: 1 });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ isFeatured: 1, status: 1 });
ArticleSchema.index({ deletedAt: 1 });
ArticleSchema.index({ title: "text", content: "text" }); // Full-text search
