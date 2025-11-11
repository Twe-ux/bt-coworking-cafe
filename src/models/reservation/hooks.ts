import { ReservationSchema } from "./document";
import type { ReservationMethods } from "./methods";

export function attachHooks(): void {
  // Add methods to schema
  ReservationSchema.methods.calculateDuration = function (
    this: ReservationMethods
  ): number {
    const [startHour, startMinute] = (this as any).startTime.split(":").map(Number);
    const [endHour, endMinute] = (this as any).endTime.split(":").map(Number);
    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;
    return endInMinutes - startInMinutes;
  };

  ReservationSchema.methods.canCancel = function (
    this: ReservationMethods
  ): boolean {
    const reservation = this as any;
    const now = new Date();
    const reservationDate = new Date(reservation.date);

    // Cannot cancel if already cancelled or completed
    if (reservation.status === "cancelled" || reservation.status === "completed") {
      return false;
    }

    // Cannot cancel if reservation date is in the past
    if (reservationDate < now) {
      return false;
    }

    return true;
  };

  ReservationSchema.methods.cancel = async function (
    this: ReservationMethods
  ): Promise<void> {
    const reservation = this as any;

    if (!reservation.canCancel()) {
      throw new Error("This reservation cannot be cancelled");
    }

    reservation.status = "cancelled";
    reservation.cancelledAt = new Date();
    await reservation.save();
  };

  // Add virtuals
  ReservationSchema.virtual("duration").get(function (this: any) {
    return this.calculateDuration();
  });

  ReservationSchema.virtual("isUpcoming").get(function (this: any) {
    const now = new Date();
    const reservationDate = new Date(this.date);
    return reservationDate > now && this.status !== "cancelled" && this.status !== "completed";
  });

  ReservationSchema.virtual("isPast").get(function (this: any) {
    const now = new Date();
    const reservationDate = new Date(this.date);
    return reservationDate < now;
  });

  ReservationSchema.virtual("canBeCancelled").get(function (this: any) {
    return this.canCancel();
  });

  // Pre-save hook to validate times
  ReservationSchema.pre("save", function (next) {
    const [startHour, startMinute] = this.startTime.split(":").map(Number);
    const [endHour, endMinute] = this.endTime.split(":").map(Number);
    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;

    if (endInMinutes <= startInMinutes) {
      next(new Error("End time must be after start time"));
    } else {
      next();
    }
  });
}
