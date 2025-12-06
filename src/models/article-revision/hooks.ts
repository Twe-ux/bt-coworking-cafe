import { ArticleRevisionSchema } from "./document";

export function attachHooks() {
  // Validate that content is not empty
  ArticleRevisionSchema.pre("save", async function (next) {
    if (!this.content || this.content.trim().length === 0) {
      throw new Error("Revision content cannot be empty");
    }
    next();
  });

  // Validate that title is not empty
  ArticleRevisionSchema.pre("save", async function (next) {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error("Revision title cannot be empty");
    }
    next();
  });

  // Trim change description
  ArticleRevisionSchema.pre("save", async function (next) {
    if (this.changeDescription) {
      this.changeDescription = this.changeDescription.trim();
    }
    next();
  });
}
