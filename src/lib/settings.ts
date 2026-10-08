import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";
import { SITE, PAYMENT_METHODS } from "./constants";
import { connectDB, hasDatabase } from "./db";
import { SettingsStore } from "./models/Settings";

export type HoursRow = { days: string; time: string };

export type SiteInfo = {
  name: string;
  tagline: string;
  location: string;
  address: string;
  phone: string;
  phoneHref: string;
  email: string;
  adminEmail: string;
  hours: HoursRow[];
};

export type PaymentMethodSetting = {
  id: string;
  label: string;
  hint: string;
};

export type StoreSettings = {
  site: SiteInfo;
  paymentMethods: PaymentMethodSetting[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_FILE = path.join(DATA_DIR, "settings.json");

export function defaultSettings(): StoreSettings {
  return {
    site: {
      name: SITE.name,
      tagline: SITE.tagline,
      location: SITE.location,
      address: SITE.address,
      phone: SITE.phone,
      phoneHref: SITE.phoneHref,
      email: SITE.email,
      adminEmail: SITE.adminEmail,
      hours: SITE.hours.map((h) => ({ ...h })),
    },
    paymentMethods: PAYMENT_METHODS.map((m) => ({ id: m.id, label: m.label, hint: m.hint })),
  };
}

async function readLocal(): Promise<StoreSettings | null> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreSettings>;
    if (!parsed.site && !parsed.paymentMethods) return null;
    const base = defaultSettings();
    return {
      site: { ...base.site, ...(parsed.site ?? {}) },
      paymentMethods: parsed.paymentMethods?.length
        ? parsed.paymentMethods
        : base.paymentMethods,
    };
  } catch {
    return null;
  }
}

async function writeLocal(settings: StoreSettings) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(settings, null, 2), "utf8");
}

/** Reads live settings from Mongo, falling back to the local file, then defaults. */
export const getSettings = cache(async (): Promise<StoreSettings> => {
  const defaults = defaultSettings();
  if (hasDatabase()) {
    try {
      await connectDB();
      const doc = (await SettingsStore.findOne({ key: "main" })
        .lean()) as unknown as (StoreSettings & { key?: string }) | null;
      if (doc) {
        return {
          site: { ...defaults.site, ...(doc.site ?? {}) },
          paymentMethods: doc.paymentMethods?.length
            ? doc.paymentMethods
            : defaults.paymentMethods,
        };
      }
    } catch {
      /* fall through to the local store */
    }
  }
  return (await readLocal()) ?? defaults;
});

/** Persists settings, merging partials over the current effective settings. */
export async function updateSettings(
  patch: { site?: Partial<SiteInfo>; paymentMethods?: PaymentMethodSetting[] },
): Promise<StoreSettings> {
  const current = await getSettings();
  const next: StoreSettings = {
    site: { ...current.site, ...(patch.site ?? {}) },
    paymentMethods: patch.paymentMethods ?? current.paymentMethods,
  };

  if (hasDatabase()) {
    try {
      await connectDB();
      await SettingsStore.updateOne(
        { key: "main" },
        { $set: { site: next.site, paymentMethods: next.paymentMethods } },
        { upsert: true },
      );
      return next;
    } catch {
      /* fall through to the local store */
    }
  }
  await writeLocal(next);
  return next;
}