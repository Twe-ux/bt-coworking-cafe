import { Model, model, models } from "mongoose";
import { SessionSchema } from "./document";
import { attachHooks } from "./hooks";
import { SessionMethods } from "./methods";
import { VirtualSession } from "./virtuals";

export type Session = VirtualSession & SessionMethods;

let SessionModel: Model<Session>;

if (models.Session) {
  SessionModel = models.Session as Model<Session>;
} else {
  attachHooks();
  SessionModel = model<Session>("Session", SessionSchema);
}

if (!SessionModel) {
  throw new Error("Session model not initialized");
}

export { SessionModel as Session };
