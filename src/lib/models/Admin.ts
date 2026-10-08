import { Schema, model, models } from "mongoose";

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["owner", "staff"], default: "owner" },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

export const Admin = models.Admin ?? model("Admin", AdminSchema);
