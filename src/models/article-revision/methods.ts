import { ArticleRevisionDocument, ArticleRevisionSchema } from "./document";

export interface ArticleRevisionMethods extends ArticleRevisionDocument {
  hasChanges(currentTitle: string, currentContent: string): boolean;
  getWordCount(): number;
}

/** Check if this revision has changes compared to current content */
ArticleRevisionSchema.methods.hasChanges = function (
  this: ArticleRevisionDocument,
  currentTitle: string,
  currentContent: string
): boolean {
  return this.title !== currentTitle || this.content !== currentContent;
};

/** Get word count of the revision content */
ArticleRevisionSchema.methods.getWordCount = function (
  this: ArticleRevisionDocument
): number {
  return this.content.split(/\s+/).filter(Boolean).length;
};
