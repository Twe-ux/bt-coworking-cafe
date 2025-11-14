import { ObjectId, Schema, Types, Document } from "mongoose";

/** Document of a {@link Reservation}, as stored in the database. */
export interface ReservationDocument extends Document {
  user: ObjectId;
  space: ObjectId;
  spaceType?: "desk" | "meeting-room" | "private-office" | "event-space"; // Deprecated: kept for backward compatibility
  date: Date;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  numberOfPeople: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  totalPrice: number;
  notes?: string;
  specialRequests?: string;
  confirmationNumber?: string;
  paymentStatus: "pending" | "paid" | "refunded" | "failed";
  paymentMethod?: "card" | "cash" | "bank-transfer";
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  completedAt?: Date;
}

/** Schema used to validate Reservation objects for the database. */
export const ReservationSchema = new Schema<ReservationDocument>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    space: {
      type: Types.ObjectId,
      ref: "Space",
      required: [true, "Space is required"],
      index: true,
    },
    spaceType: {
      type: String,
      enum: {
        values: ["desk", "meeting-room", "private-office", "event-space"],
        message: "{VALUE} is not a valid space type",
      },
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      index: true,
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"],
    },
    numberOfPeople: {
      type: Number,
      required: [true, "Number of people is required"],
      min: [1, "At least 1 person required"],
      max: [100, "Maximum 100 people allowed"],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["pending", "confirmed", "cancelled", "completed"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
      index: true,
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Price cannot be negative"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    specialRequests: {
      type: String,
      trim: true,
      maxlength: [1000, "Special requests cannot exceed 1000 characters"],
    },
    confirmationNumber: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: {
        values: ["pending", "paid", "refunded", "failed"],
        message: "{VALUE} is not a valid payment status",
      },
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["card", "cash", "bank-transfer"],
        message: "{VALUE} is not a valid payment method",
      },
    },
    stripePaymentIntentId: {
      type: String,
      trim: true,
      index: true,
    },
    stripeSessionId: {
      type: String,
      trim: true,
    },
    stripeCustomerId: {
      type: String,
      trim: true,
    },
    cancelledAt: {
      type: Date,
    },
    completedAt: {
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
ReservationSchema.index({ user: 1, date: 1 });
ReservationSchema.index({ space: 1, date: 1 });
ReservationSchema.index({ status: 1, date: 1 });
ReservationSchema.index({ date: 1, spaceType: 1 });
ReservationSchema.index({ stripePaymentIntentId: 1 }, { sparse: true });
ReservationSchema.index({ confirmationNumber: 1 }, { sparse: true });

// Compound index to prevent double bookings
ReservationSchema.index({
  space: 1,
  date: 1,
  startTime: 1,
  endTime: 1,
  status: 1,
});
