import { promises as fs } from "fs";
import path from "path";
import { connectDB, hasDatabase } from "./db";
import { Enquiry, Review } from "./models/Review";
import type { Review as ReviewRecord } from "./types";

export type EnquiryKind = "contact" | "finance" | "sell" | "review";

export type EnquiryRecord = {
  id: string;
  kind: EnquiryKind;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  budget?: string;
  vehicle?: string;
  handled: boolean;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_FILE = path.join(DATA_DIR, "enquiries.json");

function newId() {
  return `enq_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

async function readLocal(): Promise<EnquiryRecord[]> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8")) as EnquiryRecord[];
  } catch {
    return [];
  }
}

async function writeLocal(records: EnquiryRecord[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(records, null, 2), "utf8");
}

export async function saveEnquiry(
  input: Omit<EnquiryRecord, "id" | "handled" | "createdAt">,
): Promise<EnquiryRecord> {
  const record: EnquiryRecord = {
    ...input,
    id: newId(),
    handled: false,
    createdAt: new Date().toISOString(),
  };

  if (hasDatabase()) {
    try {
      await connectDB();
      await Enquiry.create(record);
      return record;
    } catch {
      /* fall through to the local store */
    }
  }
  const records = await readLocal();
  records.unshift(record);
  await writeLocal(records);
  return record;
}

export async function listEnquiries(): Promise<EnquiryRecord[]> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const docs = (await Enquiry.find()
        .sort({ createdAt: -1 })
        .lean()) as unknown as EnquiryRecord[];
      if (docs.length) return docs;
    } catch {
      /* fall through to the local store */
    }
  }
  return readLocal();
}

export async function markEnquiryHandled(id: string): Promise<void> {
  if (hasDatabase()) {
    try {
      await connectDB();
      await Enquiry.updateOne({ id }, { $set: { handled: true } });
      return;
    } catch {
      /* fall through to the local store */
    }
  }
  const records = await readLocal();
  const index = records.findIndex((r) => r.id === id);
  if (index !== -1) {
    records[index].handled = true;
    await writeLocal(records);
  }
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const res = await Enquiry.deleteOne({ id });
      if (res.deletedCount) return true;
    } catch {
      /* fall through to the local store */
    }
  }
  const records = await readLocal();
  const next = records.filter((r) => r.id !== id);
  if (next.length === records.length) return false;
  await writeLocal(next);
  return true;
}

export type ReviewInput = {
  name: string;
  city?: string;
  email?: string;
  rating: number;
  title?: string;
  body: string;
  purchased?: string;
};

/** Reviews land as unpublished until an admin approves them. */
export async function saveReview(input: ReviewInput): Promise<void> {
  const record = {
    id: `rev_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    ...input,
    date: new Date().toISOString(),
    published: false,
  };
  if (hasDatabase()) {
    try {
      await connectDB();
      await Review.create(record);
      return;
    } catch {
      /* fall through to the local store */
    }
  }
  const file = path.join(DATA_DIR, "reviews-pending.json");
  await fs.mkdir(DATA_DIR, { recursive: true });
  let pending: (ReviewInput & { date: string; published: boolean })[] = [];
  try {
    pending = JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    pending = [];
  }
  pending.unshift(record);
  await fs.writeFile(file, JSON.stringify(pending, null, 2), "utf8");
}
