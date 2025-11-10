import { RoleDocument, RoleSchema } from "./document";

export interface RoleMethods extends RoleDocument {
  hasPermission(permissionSlug: string): Promise<boolean>;
  canManageUsers(): boolean;
}

/** Check if role has a specific permission */
RoleSchema.methods.hasPermission = async function (
  this: RoleDocument,
  permissionSlug: string
): Promise<boolean> {
  await this.populate("permissions");
  const permissions = this.permissions as any[];
  return permissions.some((p) => p.slug === permissionSlug);
};

/** Check if role can manage users (admin or dev only) */
RoleSchema.methods.canManageUsers = function (this: RoleDocument): boolean {
  return this.slug === "dev" || this.slug === "admin";
};
