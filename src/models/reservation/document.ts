import { ObjectId, Schema, Types, Document } from "mongoose";

export interface AdditionalServiceItem {
  service: ObjectId;
  name: string; // Nom du service au moment de la réservation
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/** Document of a {@link Reservation}, as stored in the database. */
export interface ReservationDocument extends Document {
  user: ObjectId;
  space?: ObjectId; // DEPRECATED: Old reference to Space model (kept for backward compatibility)
  spaceType: "open-space" | "salle-verriere" | "salle-etage" | "evenementiel"; // New: spaceType from SpaceConfiguration
  date: Date;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  numberOfPeople: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";

  // Pricing
  basePrice: number; // Prix de base de l'espace
  servicesPrice: number; // Prix total des services supplémentaires
  totalPrice: number; // basePrice + servicesPrice
  reservationType?: "hourly" | "daily" | "weekly" | "monthly"; // Type de réservation

  // Contact information
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;

  // Services supplémentaires
  additionalServices: AdditionalServiceItem[];

  // Payment
  requiresPayment: boolean; // true si paiement requis avant confirmation
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
      required: false, // DEPRECATED: Made optional for backward compatibility
      index: true,
    },
    spaceType: {
      type: String,
      enum: {
        values: ["open-space", "salle-verriere", "salle-etage", "evenementiel", "desk", "meeting-room", "private-office", "event-space"],
        message: "{VALUE} is not a valid space type",
      },
      required: [true, "Space type is required"],
      index: true,
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
    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    servicesPrice: {
      type: Number,
      default: 0,
      min: [0, "Services price cannot be negative"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Price cannot be negative"],
    },
    reservationType: {
      type: String,
      enum: {
        values: ["hourly", "daily", "weekly", "monthly"],
        message: "{VALUE} is not a valid reservation type",
      },
    },
    contactName: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    additionalServices: {
      type: [
        {
          service: {
            type: Types.ObjectId,
            ref: "AdditionalService",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
          },
          unitPrice: {
            type: Number,
            required: true,
            min: 0,
          },
          totalPrice: {
            type: Number,
            required: true,
            min: 0,
          },
        },
      ],
      default: [],
    },
    requiresPayment: {
      type: Boolean,
      default: true,
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
