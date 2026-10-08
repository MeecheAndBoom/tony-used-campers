import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    condition: { type: String, enum: ["used", "new"], default: "used" },
    type: { type: String, required: true, index: true },
    price: { type: Number, required: true, index: true },
    listPrice: { type: Number },
    monthlyFrom: { type: Number },
    stockNumber: { type: String, required: true },
    specs: {
      length: String,
      sleeps: String,
      weight: String,
      axles: String,
      slides: String,
    },
    description: String,
    features: [String],
    images: [String],
    status: { type: String, enum: ["live", "draft"], default: "live", index: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Product = models.Product ?? model("Product", ProductSchema);
