import { Schema, model, models } from "mongoose";

/** Editable shop-by-category tiles shown on the homepage and edited from /admin/categories. */
const CategorySchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    image: { type: String, default: "" },
  },
  { timestamps: true },
);

export const CategoryStore =
  models.CategoryStore ?? model("CategoryStore", CategorySchema);