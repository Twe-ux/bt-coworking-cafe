import { Schema } from "mongoose";
import { SpaceConfigurationDocument } from "./document";

const dayHoursSchema = new Schema(
  {
    isOpen: {
      type: Boolean,
      required: true,
      default: true,
    },
    openTime: {
      type: String,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    closeTime: {
      type: String,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
  },
  { _id: false }
);

const weeklyHoursSchema = new Schema(
  {
    monday: { type: dayHoursSchema, required: true },
    tuesday: { type: dayHoursSchema, required: true },
    wednesday: { type: dayHoursSchema, required: true },
    thursday: { type: dayHoursSchema, required: true },
    friday: { type: dayHoursSchema, required: true },
    saturday: { type: dayHoursSchema, required: true },
    sunday: { type: dayHoursSchema, required: true },
  },
  { _id: false }
);

const exceptionalClosureSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
    },
    startTime: {
      type: String,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    endTime: {
      type: String,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    isFullDay: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const pricingStructureSchema = new Schema(
  {
    hourly: {
      type: Number,
      required: true,
      min: 0,
    },
    daily: {
      type: Number,
      required: true,
      min: 0,
    },
    weekly: {
      type: Number,
      required: true,
      min: 0,
    },
    monthly: {
      type: Number,
      required: true,
      min: 0,
    },
    perPerson: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const availableReservationTypesSchema = new Schema(
  {
    hourly: {
      type: Boolean,
      default: true,
    },
    daily: {
      type: Boolean,
      default: true,
    },
    weekly: {
      type: Boolean,
      default: false,
    },
    monthly: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const spaceConfigurationSchema = new Schema<SpaceConfigurationDocument>(
  {
    spaceType: {
      type: String,
      enum: ["open-space", "salle-verriere", "salle-etage", "evenementiel"],
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    pricing: {
      type: pricingStructureSchema,
      required: true,
    },
    availableReservationTypes: {
      type: availableReservationTypesSchema,
      required: true,
    },
    requiresQuote: {
      type: Boolean,
      default: false,
    },
    minCapacity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    maxCapacity: {
      type: Number,
      required: true,
      min: 1,
    },
    defaultHours: {
      type: weeklyHoursSchema,
      required: true,
    },
    exceptionalClosures: {
      type: [exceptionalClosureSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
spaceConfigurationSchema.index({ spaceType: 1 });
spaceConfigurationSchema.index({ slug: 1 });
spaceConfigurationSchema.index({ isActive: 1, isDeleted: 1 });

export default spaceConfigurationSchema;
