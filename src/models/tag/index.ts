import { Model, model, models } from "mongoose";
import { TagSchema } from "./document";
import { attachHooks } from "./hooks";
import { TagMethods } from "./methods";
import { VirtualTag } from "./virtuals";

export type Tag = VirtualTag & TagMethods;

let TagModel: Model<Tag>;

if (models.Tag) {
  TagModel = models.Tag as Model<Tag>;
} else {
  attachHooks();
  TagModel = model<Tag>("Tag", TagSchema);
}

if (!TagModel) {
  throw new Error("Tag model not initialized");
}

export { TagModel as Tag };
