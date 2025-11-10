import { Model, model, models } from "mongoose";
import { PermissionSchema } from "./document";
import { attachHooks } from "./hooks";
import { PermissionMethods } from "./methods";
import { VirtualPermission } from "./virtuals";

export type Permission = VirtualPermission & PermissionMethods;

let PermissionModel: Model<Permission>;

if (models.Permission) {
  PermissionModel = models.Permission as Model<Permission>;
} else {
  attachHooks();
  PermissionModel = model<Permission>("Permission", PermissionSchema);
}

if (!PermissionModel) {
  throw new Error("Permission model not initialized");
}

export { PermissionModel as Permission };
