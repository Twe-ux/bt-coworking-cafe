import { RoleSchema } from "./document";

export function attachHooks() {
  // Empêcher la suppression des rôles système
  RoleSchema.pre("remove", async function (next) {
    if (this.isSystem) {
      throw new Error("Cannot delete system role");
    }
    next();
  });

  // Empêcher la modification du slug des rôles système
  RoleSchema.pre("save", async function (next) {
    if (!this.isNew && this.isModified("slug") && this.isSystem) {
      throw new Error("Cannot modify slug of system role");
    }
    next();
  });
}
