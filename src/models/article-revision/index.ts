import { Model, model, models } from "mongoose";
import { ArticleRevisionDocument, ArticleRevisionSchema } from "./document";
import { attachHooks } from "./hooks";
import { ArticleRevisionMethods } from "./methods";
import { VirtualArticleRevision } from "./virtuals";

export type ArticleRevision = VirtualArticleRevision & ArticleRevisionMethods;

let ArticleRevisionModel: Model<ArticleRevisionDocument>;

if (models.ArticleRevision) {
  ArticleRevisionModel = models.ArticleRevision as Model<ArticleRevisionDocument>;
} else {
  attachHooks();
  ArticleRevisionModel = model<ArticleRevisionDocument>("ArticleRevision", ArticleRevisionSchema);
}

if (!ArticleRevisionModel) {
  throw new Error("ArticleRevision model not initialized");
}

export { ArticleRevisionModel as ArticleRevision };
