import { Model, model, models } from "mongoose";
import { ArticleSchema } from "./document";
import { attachHooks } from "./hooks";
import { ArticleMethods } from "./methods";
import { VirtualArticle } from "./virtuals";

export type Article = VirtualArticle & ArticleMethods;

let ArticleModel: Model<Article>;

if (models.Article) {
  ArticleModel = models.Article as Model<Article>;
} else {
  attachHooks();
  ArticleModel = model<Article>("Article", ArticleSchema);
}

if (!ArticleModel) {
  throw new Error("Article model not initialized");
}

export { ArticleModel as Article };
