import { Model, model, models } from "mongoose";
import { CommentSchema } from "./document";
import { attachHooks } from "./hooks";
import { CommentMethods } from "./methods";
import { VirtualComment } from "./virtuals";

export type Comment = VirtualComment & CommentMethods;

let CommentModel: Model<Comment>;

if (models.Comment) {
  CommentModel = models.Comment as Model<Comment>;
} else {
  attachHooks();
  CommentModel = model<Comment>("Comment", CommentSchema);
}

if (!CommentModel) {
  throw new Error("Comment model not initialized");
}

export { CommentModel as Comment };
