import { Model, model, models } from "mongoose";
import { ArticleRevisionSchema } from "./document";
import { attachHooks } from "./hooks";
import { ArticleRevisionMethods } from "./methods";
import { VirtualArticleRevision } from "./virtuals";

export type ArticleRevision = VirtualArticleRevision & ArticleRevisionMethods;

let ArticleRevisionModel: Model<ArticleRevision>;

if (models.ArticleRevision) {
  ArticleRevisionModel = models.ArticleRevision as Model<ArticleRevision>;
} else {
  attachHooks();
  ArticleRevisionModel = model<ArticleRevision>("ArticleRevision", ArticleRevisionSchema);
}

if (!ArticleRevisionModel) {
  throw new Error("ArticleRevision model not initialized");
}

export { ArticleRevisionModel as ArticleRevision };
