import { Model, model, models } from "mongoose";
import { MediaSchema } from "./document";
import { attachHooks } from "./hooks";
import { MediaMethods } from "./methods";
import { VirtualMedia } from "./virtuals";

export type Media = VirtualMedia & MediaMethods;

let MediaModel: Model<Media>;

if (models.Media) {
  MediaModel = models.Media as Model<Media>;
} else {
  attachHooks();
  MediaModel = model<Media>("Media", MediaSchema);
}

if (!MediaModel) {
  throw new Error("Media model not initialized");
}

export { MediaModel as Media };
