import { Schema, model, models } from "mongoose";

const HoursSchema = new Schema(
  {
    days: String,
    time: String,
  },
  { _id: false },
);

const PaymentMethodSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    hint: { type: String, default: "" },
  },
  { _id: false },
);

/** Cloudinary account used for dashboard image uploads. Env values win when set. */
const CloudinarySchema = new Schema(
  {
    cloudName: { type: String, default: "" },
    apiKey: { type: String, default: "" },
    apiSecret: { type: String, default: "" },
  },
  { _id: false },
);

/** Singleton store for store info + payment methods edited from /admin/settings. */
const SettingsSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true, index: true },
    site: {
      name: String,
      tagline: String,
      location: String,
      address: String,
      phone: String,
      phoneHref: String,
      email: String,
      adminEmail: String,
      hours: [HoursSchema],
    },
    paymentMethods: [PaymentMethodSchema],
    cloudinary: { type: CloudinarySchema, default: () => ({}) },
  },
  { timestamps: true },
);

export const SettingsStore =
  models.SettingsStore ?? model("SettingsStore", SettingsSchema);