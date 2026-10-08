import { promises as fs } from "fs";
import path from "path";
import { connectDB, hasDatabase } from "./db";
import { Order } from "./models/Order";
import type { OrderItem, OrderStatus } from "./types";

export type OrderRecord = {
  reference: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: { name: string; email: string; phone?: string; notes?: string };
  delivery: {
    method: "pickup" | "delivery";
    address?: { line1?: string; city?: string; state?: string; zip?: string };
    estimatedDate?: string;
  };
  payment: {
    method: string;
    methodOther?: string;
    label: string;
    instructions?: string;
    amountDue?: number;
    dueDate?: string;
    status: "pending" | "received";
    receivedAt?: string;
  };
  status: OrderStatus;
  statusHistory: { status: string; note?: string; at: string }[];
  adminNotes?: string;
  createdAt?: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_FILE = path.join(DATA_DIR, "orders.json");

export function newReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `TUC-${out}`;
}

async function readLocal(): Promise<OrderRecord[]> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    return JSON.parse(raw) as OrderRecord[];
  } catch {
    return [];
  }
}

async function writeLocal(orders: OrderRecord[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(orders, null, 2), "utf8");
}

export async function saveOrder(order: OrderRecord): Promise<OrderRecord> {
  if (hasDatabase()) {
    try {
      await connectDB();
      await Order.updateOne(
        { reference: order.reference },
        { $setOnInsert: order },
        { upsert: true },
      );
      return order;
    } catch {
      /* fall through to the local store */
    }
  }
  const orders = await readLocal();
  orders.unshift(order);
  await writeLocal(orders);
  return order;
}

export async function findOrder(
  reference: string,
  email?: string,
): Promise<OrderRecord | null> {
  const normalizedRef = reference.trim().toUpperCase();
  const normalizedEmail = email?.trim().toLowerCase();

  if (hasDatabase()) {
    try {
      await connectDB();
      const doc = (await Order.findOne({
        reference: normalizedRef,
        ...(normalizedEmail
          ? { "customer.email": normalizedEmail }
          : {}),
      }).lean()) as unknown as OrderRecord | null;
      if (doc) return doc;
    } catch {
      /* fall through to the local store */
    }
  }

  const orders = await readLocal();
  return (
    orders.find(
      (o) =>
        o.reference.toUpperCase() === normalizedRef &&
        (!normalizedEmail ||
          o.customer.email.toLowerCase() === normalizedEmail),
    ) ?? null
  );
}

export async function listOrders(): Promise<OrderRecord[]> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const docs = (await Order.find()
        .sort({ createdAt: -1 })
        .lean()) as unknown as OrderRecord[];
      if (docs.length) return docs;
    } catch {
      /* fall through to the local store */
    }
  }
  return readLocal();
}

export async function updateOrder(
  reference: string,
  patch: Partial<OrderRecord>,
): Promise<OrderRecord | null> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const doc = (await Order.findOneAndUpdate(
        { reference },
        { $set: patch },
        { new: true },
      ).lean()) as unknown as OrderRecord | null;
      if (doc) return doc;
    } catch {
      /* fall through to the local store */
    }
  }

  const orders = await readLocal();
  const index = orders.findIndex((o) => o.reference === reference);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...patch };
  await writeLocal(orders);
  return orders[index];
}

export async function deleteOrder(reference: string): Promise<boolean> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const res = await Order.deleteOne({ reference });
      if (res.deletedCount) return true;
    } catch {
      /* fall through to the local store */
    }
  }
  const orders = await readLocal();
  const next = orders.filter((o) => o.reference !== reference);
  if (next.length === orders.length) return false;
  await writeLocal(next);
  return true;
}

export async function allCustomers() {
  const orders = await listOrders();
  return orders.map((o) => ({ email: o.customer.email, reference: o.reference }));
}
