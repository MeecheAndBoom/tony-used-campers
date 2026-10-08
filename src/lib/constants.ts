export const SITE = {
  name: "Tony Used Campers",
  tagline: "Used campers, ready for the road.",
  location: "Detroit, Michigan",
  address: "4120 Michigan Ave, Detroit, MI 48208",
  phone: "(313) 555-0142",
  phoneHref: "+13135550142",
  email: "sales@tonyusedcampers.com",
  adminEmail: "orders@tonyusedcampers.com",
  hours: [
    { days: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
    { days: "Saturday", time: "10:00 AM – 5:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  currency: "USD",
  locale: "en-US",
} as const;

export type PaymentMethodId = "card" | "zelle" | "check" | "other";

export const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: string;
  hint: string;
}[] = [
  {
    id: "card",
    label: "Credit / Debit Card",
    hint: "We'll email you a secure payment link for Visa, Mastercard, Amex or Discover.",
  },
  {
    id: "zelle",
    label: "Zelle",
    hint: "Pay directly from your bank app. Instructions arrive by email.",
  },
  {
    id: "check",
    label: "Cashier's Check / Bank Transfer",
    hint: "Pay by cashier's check or wire transfer. Details sent to your email.",
  },
  {
    id: "other",
    label: "Other",
    hint: "Describe your preferred payment method and we'll arrange it with you.",
  },
];

export const DELIVERY_FEE = 0;
export const FREE_DELIVERY_THRESHOLD = 0;

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

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** The customer-facing tracking stepper. */
export const TRACKING_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "Placed", label: "Order placed" },
  { status: "Payment Pending", label: "Payment pending" },
  { status: "Payment Received", label: "Payment received" },
  { status: "Preparing", label: "Preparing your camper" },
  { status: "Ready for Pickup", label: "Ready for pickup" },
  { status: "Completed", label: "Completed" },
];

export const PRODUCT_TYPES = [
  "Travel Trailer",
  "Camper Van",
  "Class C Motorhome",
  "Class A Motorhome",
  "Fifth Wheel",
  "Pop-Up",
  "Teardrop",
] as const;

export const BRANDS = [
  "Jayco",
  "Forest River",
  "Keystone",
  "Winnebago",
  "Thor Motor Coach",
  "Coachmen",
  "Grand Design",
  "Airstream",
  "KZ RV",
  "Cherokee",
] as const;
