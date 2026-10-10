import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";
import { connectDB, hasDatabase } from "./db";
import { CategoryStore } from "./models/Category";

export type Category = {
  id: string;
  name: string;
  image: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_FILE = path.join(DATA_DIR, "categories.json");

/** Seed categories used on the homepage and as the no-store fallback. */
export const DEFAULT_CATEGORIES: Category[] = [
  { id: "travel-trailer", name: "Travel Trailer", image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/carav-cat/Travel_Trailer.png" },
  { id: "camper-van", name: "Camper Van", image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/carav-cat/Camper_Van.png" },
  { id: "class-c-motorhome", name: "Class C Motorhome", image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/carav-cat/Class_C_Motorhome.png" },
  { id: "class-a-motorhome", name: "Class A Motorhome", image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/carav-cat/Class_A_Motorhome.png" },
  { id: "fifth-wheel", name: "Fifth Wheel", image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/carav-cat/Fifth_Wheel.png" },
  { id: "pop-up", name: "Pop-Up", image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/carav-cat/Pop-Up.png" },
  { id: "teardrop", name: "Teardrop", image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/carav-cat/Teardrop.png" },
];

async function readLocal(): Promise<Category[]> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    const parsed = JSON.parse(raw) as Category[];
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    /* missing or corrupt — fall back to the seed */
  }
  return DEFAULT_CATEGORIES.map((c) => ({ ...c }));
}

async function writeLocal(categories: Category[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(categories, null, 2), "utf8");
}

/** Live categories from Mongo, falling back to the local store, then seeds. */
export const getCategories = cache(async (): Promise<Category[]> => {
  if (hasDatabase()) {
    try {
      await connectDB();
      const docs = (await CategoryStore.find()
        .sort({ createdAt: 1 })
        .lean()) as unknown as Category[] | null;
      if (docs?.length) return docs;
    } catch {
      /* fall through to the local store */
    }
  }
  return readLocal();
});

/** "Class C Motorhome" -> "class-c-motorhome". */
export function categoryId(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || `category-${Date.now().toString(36)}`;
}

export async function createCategory(input: {
  name: string;
  image: string;
}): Promise<Category> {
  const id = categoryId(input.name);
  const record: Category = { id, name: input.name, image: input.image };

  if (hasDatabase()) {
    try {
      await connectDB();
      await CategoryStore.create(record);
      return record;
    } catch {
      /* fall through to the local store */
    }
  }
  const list = await readLocal();
  if (list.some((c) => c.id === id)) {
    record.id = `${id}-${Date.now().toString(36)}`;
  }
  list.push(record);
  await writeLocal(list);
  return record;
}

export async function updateCategory(
  id: string,
  patch: { name?: string; image?: string },
): Promise<Category | null> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const doc = (await CategoryStore.findOneAndUpdate(
        { id },
        { $set: patch },
        { new: true },
      ).lean()) as unknown as Category | null;
      if (doc) return doc;
    } catch {
      /* fall through to the local store */
    }
  }
  const list = await readLocal();
  const index = list.findIndex((c) => c.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...patch };
  await writeLocal(list);
  return list[index];
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const res = await CategoryStore.deleteOne({ id });
      if (res.deletedCount) return true;
    } catch {
      /* fall through to the local store */
    }
  }
  const list = await readLocal();
  const next = list.filter((c) => c.id !== id);
  if (next.length === list.length) return false;
  await writeLocal(next);
  return true;
}