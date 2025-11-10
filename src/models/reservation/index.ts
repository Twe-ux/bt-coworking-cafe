import { Model, model, models } from "mongoose";
import { ReservationSchema } from "./document";
import { attachHooks } from "./hooks";
import { ReservationMethods } from "./methods";
import { VirtualReservation } from "./virtuals";

export type Reservation = VirtualReservation & ReservationMethods;

let ReservationModel: Model<Reservation>;

if (models.Reservation) {
  ReservationModel = models.Reservation as Model<Reservation>;
} else {
  attachHooks();
  ReservationModel = model<Reservation>("Reservation", ReservationSchema);
}

if (!ReservationModel) {
  throw new Error("Reservation model not initialized");
}

export { ReservationModel as Reservation };
