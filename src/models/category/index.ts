import { Model, model, models } from "mongoose";
import { CategorySchema } from "./document";
import { attachHooks } from "./hooks";
import { CategoryMethods } from "./methods";
import { VirtualCategory } from "./virtuals";

export type Category = VirtualCategory & CategoryMethods;

let CategoryModel: Model<Category>;

if (models.Category) {
  CategoryModel = models.Category as Model<Category>;
} else {
  attachHooks();
  CategoryModel = model<Category>("Category", CategorySchema);
}

if (!CategoryModel) {
  throw new Error("Category model not initialized");
}

export { CategoryModel as Category };
