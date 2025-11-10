import { ObjectId, Schema, Types } from "mongoose";
import type { User } from "./index";

/** Document of a {@link User}, as stored in the databse. */
export interface UserDocument extends Document {
  email: string;
  password: string;
  username?: string;
  givenName?: string;
  role: ObjectId;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/** Schema used to validate User objects for the database. */
export const UserSchema = new Schema<UserDocument, User>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    username: { type: String, trim: true },
    givenName: { type: String, trim: true },
    role: {
      type: Types.ObjectId,
      ref: "Role",
      required: [true, "User role is required"],
    },
    emailVerifiedAt: {
      type: Date,
    },
    lastLoginAt: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
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

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true, sparse: true });
UserSchema.index({ role: 1 });
UserSchema.index({ deletedAt: 1 });
