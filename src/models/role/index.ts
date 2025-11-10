import { Model, model, models } from "mongoose";
import { RoleSchema } from "./document";
import { attachHooks } from "./hooks";
import { RoleMethods } from "./methods";
import { VirtualRole } from "./virtuals";

export type Role = VirtualRole & RoleMethods;

let RoleModel: Model<Role>;

if (models.Role) {
  RoleModel = models.Role as Model<Role>;
} else {
  attachHooks();
  RoleModel = model<Role>("Role", RoleSchema);
}

if (!RoleModel) {
  throw new Error("Role model not initialized");
}

export { RoleModel as Role };
