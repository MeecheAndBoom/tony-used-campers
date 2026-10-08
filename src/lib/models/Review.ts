import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    name: { type: String, required: true },
    city: String,
    email: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    title: String,
    body: { type: String, required: true },
    purchased: String,
    published: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

const EnquirySchema = new Schema(
  {
    kind: {
      type: String,
      enum: ["contact", "finance", "sell", "review"],
      default: "contact",
      index: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    subject: String,
    message: String,
    budget: String,
    vehicle: String,
    handled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Review = models.Review ?? model("Review", ReviewSchema);
export const Enquiry = models.Enquiry ?? model("Enquiry", EnquirySchema);
