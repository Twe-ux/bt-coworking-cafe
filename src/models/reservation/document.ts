import { ObjectId, Schema, Types } from "mongoose";

/** Document of a {@link Reservation}, as stored in the database. */
export interface ReservationDocument extends Document {
  user: ObjectId;
  spaceType: "desk" | "meeting-room" | "private-office" | "event-space";
  date: Date;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  numberOfPeople: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  totalPrice: number;
  notes?: string;
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod?: "card" | "cash" | "bank-transfer";
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
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
    spaceType: {
      type: String,
      required: [true, "Space type is required"],
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
    paymentStatus: {
      type: String,
      required: true,
      enum: {
        values: ["pending", "paid", "refunded"],
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
    cancelledAt: {
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
ReservationSchema.index({ status: 1, date: 1 });
ReservationSchema.index({ date: 1, spaceType: 1 });
