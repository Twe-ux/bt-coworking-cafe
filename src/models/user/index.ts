import { Model, model, models } from "mongoose";
import { UserSchema } from "./document";
import { attachHooks } from "./hooks";
import { UserMethods } from "./methods";
import { VirtualUser } from "./virtuals";

export type User = VirtualUser & UserMethods;

let UserModel: Model<User>;

if (models.User) {
  UserModel = models.User as Model<User>;
} else {
  attachHooks();
  UserModel = model<User>("User", UserSchema);
}

if (!UserModel) {
  throw new Error("User model not initialized");
}

export { UserModel as User };
