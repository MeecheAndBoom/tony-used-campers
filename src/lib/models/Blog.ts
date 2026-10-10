import { Schema, model, models } from "mongoose";

const BlogPostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    /** Meta description + card summary, 140–160 chars. */
    excerpt: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Buying Guides",
        "Maintenance",
        "Owning an RV",
        "RV Life",
        "Destinations",
        "Dealership",
      ],
      default: "Buying Guides",
      index: true,
    },
    tags: [String],
    author: { type: String, required: true },
    /** Publish date, ISO yyyy-mm-dd. */
    date: { type: String, required: true, index: true },
    image: { type: String, default: "" },
    /** Lightweight Markdown: paragraphs, ## / ### headings, - bullets, 1. lists, > quotes. */
    body: { type: String, required: true },
    readMinutes: Number,
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["live", "draft"], default: "live", index: true },
  },
  { timestamps: true },
);

export const BlogPost = models.BlogPost ?? model("BlogPost", BlogPostSchema);
