import { Schema, model, models } from "mongoose";

export const ORDER_STATUSES = [
  "Placed",
  "Payment Pending",
  "Payment Received",
  "Preparing",
  "Ready for Pickup",
  "Out for Delivery",
  "Completed",
  "Cancelled",
] as const;

const OrderSchema = new Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    items: [
      {
        slug: String,
        title: String,
        image: String,
        price: Number,
        qty: Number,
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true, index: true },
      phone: String,
      notes: String,
    },
    delivery: {
      method: { type: String, enum: ["pickup", "delivery"], default: "pickup" },
      address: {
        line1: String,
        city: String,
        state: String,
        zip: String,
      },
      estimatedDate: Date,
    },
    payment: {
      method: { type: String, required: true },
      methodOther: String,
      label: String,
      instructions: String,
      amountDue: Number,
      dueDate: Date,
      status: {
        type: String,
        enum: ["pending", "received"],
        default: "pending",
      },
      receivedAt: Date,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Placed",
      index: true,
    },
    statusHistory: [
      {
        status: String,
        note: String,
        at: { type: Date, default: Date.now },
      },
    ],
    adminNotes: String,
  },
  { timestamps: true },
);

export const Order = models.Order ?? model("Order", OrderSchema);
