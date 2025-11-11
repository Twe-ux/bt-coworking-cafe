import { RoleSchema, RoleDocument } from "./document";

export function attachHooks() {
  // Empêcher la suppression des rôles système
  RoleSchema.pre("deleteOne", async function (this: any, next) {
    const doc = await this.model.findOne(this.getFilter());
    if (doc && doc.isSystem) {
      throw new Error("Cannot delete system role");
    }
    next();
  });

  // Empêcher la modification du slug des rôles système
  RoleSchema.pre("save", async function (this: any, next) {
    if (!this.isNew && this.isModified("slug") && this.isSystem) {
      throw new Error("Cannot modify slug of system role");
    }
    next();
  });
}
