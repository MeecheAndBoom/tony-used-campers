export type ProductType =
  | "Travel Trailer"
  | "Camper Van"
  | "Class C Motorhome"
  | "Class A Motorhome"
  | "Fifth Wheel"
  | "Pop-Up"
  | "Teardrop";

export type ProductSpecs = {
  /** Overall length, e.g. "28' 4\"" */
  length: string;
  /** Sleeps, e.g. "6" */
  sleeps: string;
  /** Hitch weight / dry weight, e.g. "5,200 lb" */
  weight: string;
  /** Axles (trailers) or slides */
  axles: string;
  /** Number of slide-outs */
  slides: string;
};

export type Product = {
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  condition: "used" | "new";
  type: ProductType;
  price: number;
  listPrice?: number;
  monthlyFrom?: number;
  stockNumber: string;
  specs: ProductSpecs;
  description: string;
  features: string[];
  images: string[];
  status: "live" | "draft";
  featured: boolean;
  createdAt?: string;
};

export type Review = {
  name: string;
  /** Optional — reviews may be submitted without a city. */
  city?: string;
  rating: number;
  /** Optional — reviews may be submitted without a title. */
  title?: string;
  body: string;
  purchased?: string;
  date: string;
  published: boolean;
};

export type BlogCategory =
  | "Buying Guides"
  | "Maintenance"
  | "Owning an RV"
  | "RV Life"
  | "Destinations"
  | "Dealership";

export type BlogPost = {
  slug: string;
  title: string;
  /** Used as the meta description and the card summary — 140–160 chars. */
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  author: string;
  /** Publish date, ISO yyyy-mm-dd. */
  date: string;
  /** Hero image path under /public. */
  image: string;
  /**
   * Post body in lightweight Markdown: paragraphs split on blank lines,
   * `## ` / `### ` headings, `- ` bullets, `1. ` numbered lists and `> ` quotes.
   */
  body: string;
  /** Optional override — computed from the body when missing. */
  readMinutes?: number;
  featured?: boolean;
  status: "live" | "draft";
  createdAt?: string;
  updatedAt?: string;
};

export type OrderStatus =
  | "Placed"
  | "Payment Pending"
  | "Payment Received"
  | "Preparing"
  | "Ready for Pickup"
  | "Out for Delivery"
  | "Completed"
  | "Cancelled";

export type OrderItem = {
  slug: string;
  title: string;
  image: string;
  price: number;
  qty: number;
};
