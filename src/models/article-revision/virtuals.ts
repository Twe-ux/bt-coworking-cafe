import { ArticleRevisionDocument, ArticleRevisionSchema } from "./document";

/** Virtual object derived from the {@link ArticleRevisionSchema}. */
export interface VirtualArticleRevision extends ArticleRevisionDocument {
  readonly hasChangeDescription: boolean;
  readonly contentLength: number;
}

// Virtual to check if revision has a change description
ArticleRevisionSchema.virtual("hasChangeDescription").get(function (
  this: ArticleRevisionDocument
) {
  return !!this.changeDescription && this.changeDescription.trim().length > 0;
});

// Virtual for content length
ArticleRevisionSchema.virtual("contentLength").get(function (
  this: ArticleRevisionDocument
) {
  return this.content.length;
});

// Virtual for title length
ArticleRevisionSchema.virtual("titleLength").get(function (
  this: ArticleRevisionDocument
) {
  return this.title.length;
});
