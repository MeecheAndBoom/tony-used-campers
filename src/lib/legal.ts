import { SITE } from "./constants";
import type { SiteInfo } from "./settings";

export type LegalPage = {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

type LegalSite = Pick<SiteInfo, "name" | "address" | "phone" | "email" | "hours">;

const DEFAULT_SITE = SITE as unknown as LegalSite;

/** Builds the legal copy from the live store settings so contact details stay current. */
export function legalPages(site: LegalSite = DEFAULT_SITE): LegalPage[] {
  const BUSINESS = `${site.name}, LLC (“${site.name}”, “we”, “us”) of ${site.address}`;

  return [
  {
    slug: "privacy",
    title: "Privacy Policy",
    updated: "October 8, 2026",
    intro:
      "This policy explains what we collect when you browse www.tonyusedcampers.com, place an order or contact us — and what we do with it.",
    sections: [
      {
        heading: "Information we collect",
        paragraphs: [
          "You give us information directly when you place an order, submit a contact, financing, trade-in or review form, or create an order tracking lookup. That includes your name, email address, phone number, delivery address and anything you write in a message field.",
          "We collect order information as part of completing a sale: the campers you ordered, totals, chosen payment method and order status history. Payment card details are never stored on our servers — card payments are completed through our payment provider's secure link.",
          "Like most websites, we collect basic technical data: pages visited, browser type, approximate region derived from your IP address, and referring pages. We use this only to understand what visitors are looking for.",
        ],
      },
      {
        heading: "How we use it",
        paragraphs: ["We use your information to:"],
        bullets: [
          "Process, confirm and deliver your order and send related emails (confirmation, payment details, status updates)",
          "Answer enquiries and provide support",
          "Arrange pickup, delivery and service appointments",
          "Detect fraud, abuse and security incidents",
          "Improve the website and our inventory selection",
          "Comply with legal obligations, including tax and title records",
        ],
      },
      {
        heading: "What we never do",
        paragraphs: [
          "We do not sell your personal information. We do not rent, trade or share your contact details with third-party advertisers. We do not store payment card numbers.",
        ],
      },
      {
        heading: "Who we share it with",
        paragraphs: [
          "We share the minimum necessary with service providers who help us operate: our database host, email delivery provider, payment processor and delivery partners. Each is bound to use the data only for the service they provide to us.",
          "We disclose information when required by law, court order, or to protect the rights, safety and property of our customers and our business.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "We use essential cookies and local storage to keep your bag and preferences working. Analytics cookies are optional and set only with your consent. Full details are in our cookie policy.",
        ],
      },
      {
        heading: "Retention",
        paragraphs: [
          "Order records are retained for as long as needed for warranty service, accounting and legal obligations — typically seven years. Enquiries and unapproved reviews are kept for 24 months. You can request deletion of anything else at any time.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "Depending on where you live, you may have the right to access, correct, delete or receive a copy of your personal information, and to object to or restrict certain processing. Michigan residents and visitors everywhere may make these requests by emailing us — we respond within 30 days.",
          "You can opt out of marketing emails at any time using the unsubscribe link in any message. Transactional emails about your order will still be sent.",
        ],
      },
      {
        heading: "Security",
        paragraphs: [
          "Data in transit is encrypted with HTTPS. Access to production data is limited to staff who need it. No system is perfectly secure, but we review our practices regularly and notify affected customers if a breach ever occurs.",
        ],
      },
      {
        heading: "Children",
        paragraphs: [
          "Our website is not directed at children under 13, and we do not knowingly collect their information.",
        ],
      },
      {
        heading: "Changes and contact",
        paragraphs: [
          `We'll post any changes on this page and update the date above. Questions about privacy go to ${site.email} or ${site.address}.`,
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    updated: "October 8, 2026",
    intro:
      "These terms govern your use of this website and any order placed through it. By placing an order you agree to them.",
    sections: [
      {
        heading: "The website",
        paragraphs: [
          `${BUSINESS} provides this website for browsing inventory, submitting enquiries and placing orders for used recreational vehicles. By using the site you agree to use it lawfully and not interfere with its operation.`,
        ],
      },
      {
        heading: "Inventory and pricing",
        paragraphs: [
          "Every unit listed is a specific, one-of-a-kind vehicle. Listing a unit does not guarantee availability — an order is not accepted until we confirm it by phone or email, at which point the unit is reserved.",
          "Prices are shown in US dollars and exclude tax, title, registration, documentation and any delivery outside our free zone. We correct pricing errors promptly; if we've quoted you an incorrect price, we will honor the correct price or cancel the order with a full refund of anything paid.",
          "Descriptions, specifications and inspection reports are provided in good faith. Photographs are of the actual unit unless marked otherwise.",
        ],
      },
      {
        heading: "Orders",
        paragraphs: [
          "Placing an order on this website submits an offer to purchase. Payment details are sent separately by our team, and the sale is complete when payment is received and the order is confirmed in writing.",
          "You agree to provide accurate contact, delivery and payment information. Orders placed by someone misrepresenting their identity or authority may be cancelled.",
        ],
      },
      {
        heading: "Vehicle condition and warranty",
        paragraphs: [
          "Unless a written warranty accompanies the unit, vehicles are sold as-is. Any limited warranty we provide (such as our 90-day powertrain and appliance coverage) is described in the warranty document delivered at sale and takes precedence over general statements on this website.",
          "You are encouraged to inspect the vehicle and obtain an independent inspection before purchase.",
        ],
      },
      {
        heading: "Delivery and pickup",
        paragraphs: [
          "Delivery timelines quoted are good-fortune estimates, not guarantees. Risk of loss passes to you on delivery or pickup. Full terms are in our shipping and delivery policy.",
        ],
      },
      {
        heading: "Returns",
        paragraphs: [
          "Exchanges and refunds are governed by our returns and refunds policy, which forms part of these terms.",
        ],
      },
      {
        heading: "Acceptable use",
        paragraphs: ["You may not:"],
        bullets: [
          "Scrape, crawl or automatically extract inventory data at scale",
          "Use the site for fraudulent purposes or to place speculative orders",
          "Attempt to breach access controls, including the admin dashboard",
          "Upload malicious content through any form on the site",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "All content on this site — text, photographs, logos, layout and code — belongs to Tony Used Campers or its licensors. You may view and print pages for personal, non-commercial use. Other reproduction requires our written permission.",
        ],
      },
      {
        heading: "Limitation of liability",
        paragraphs: [
          "To the maximum extent permitted by law, Tony Used Campers is not liable for indirect, incidental or consequential damages arising from use of this website. Our total liability for any claim related to the site is limited to the amount you paid us, if any, giving rise to the claim. Nothing in these terms limits liability that cannot be limited by law, including for fraud or personal injury.",
        ],
      },
      {
        heading: "Governing law",
        paragraphs: [
          "These terms are governed by the laws of the State of Michigan. Disputes are subject to the exclusive jurisdiction of the state and federal courts located in Wayne County, Michigan.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          `Questions about these terms: ${site.email} or ${site.address}.`,
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    updated: "October 8, 2026",
    intro:
      "Cookies and local storage keep your bag working and tell us which pages are useful. Here's exactly what we set.",
    sections: [
      {
        heading: "What cookies are",
        paragraphs: [
          "Cookies are small text files placed on your device by a website. Local storage works similarly but stays in your browser. Both are used here for the purposes described below.",
        ],
      },
      {
        heading: "Essential (always on)",
        paragraphs: ["These are required for the site to function and cannot be switched off."],
        bullets: [
          "tuc-cart — remembers the campers in your bag between visits (local storage)",
          "Session security — keeps admin sessions authenticated and protects forms from abuse",
        ],
      },
      {
        heading: "Analytics (optional)",
        paragraphs: [
          "With your consent we collect aggregated usage statistics — which pages are viewed, where visitors come from, and how the shop is used. We use this only to improve the site. Refusing leaves every feature working.",
        ],
      },
      {
        heading: "Email and tracking",
        paragraphs: [
          "Order emails contain a link to your tracking page. We do not embed tracking pixels or read receipts in customer emails.",
        ],
      },
      {
        heading: "Managing cookies",
        paragraphs: [
          "You can clear or block cookies in your browser settings at any time — check your browser's privacy panel. Blocking essential cookies will empty your bag and may prevent checkout from working.",
          "Because we do not currently run advertising networks, no ad-targeting cookies are set on this site.",
        ],
      },
      {
        heading: "Changes and contact",
        paragraphs: [
          `If we change the cookies we use, we'll update this page and re-ask for consent where required. Contact: ${site.email}.`,
        ],
      },
    ],
  },
  {
    slug: "shipping",
    title: "Shipping & Delivery Policy",
    updated: "October 8, 2026",
    intro:
      "How campers get from our Michigan Ave lot to your driveway — timelines, coverage and what happens on arrival.",
    sections: [
      {
        heading: "Delivery zones and cost",
        paragraphs: [
          "Delivery anywhere in Michigan's Lower Peninsula is free, including a full setup walkthrough on arrival.",
          "Outside the Lower Peninsula (Upper Peninsula, out-of-state), delivery is quoted case by case before payment — typically $2.50–$4.00 per loaded mile with a minimum charge. We'll always confirm the exact cost in writing before you pay.",
        ],
      },
      {
        heading: "Pickup",
        paragraphs: [
          `Pickup is available at ${site.address} during business hours — ${site.hours[0].time} Monday through Friday, ${site.hours[1].time} Saturday. Bring your ID, your payment confirmation and, if applicable, your trade-in title. We block 45 minutes for a handover walkthrough.`,
        ],
      },
      {
        heading: "Timeline",
        paragraphs: [
          "Most orders are ready for pickup or delivery within 48 hours of payment confirmation: final inspection, detailing, systems test and paperwork.",
          "Delivery scheduling then depends on route availability — we run deliveries twice weekly and book your slot the same day the unit is ready. Dates quoted are estimates; we will never take your money and go quiet. If anything slips, you hear it from us first with a new date.",
        ],
      },
      {
        heading: "What happens on delivery",
        paragraphs: [
          "Our driver walks you through leveling, hookups, propane, water and waste systems, slide operation and the awning — first-timers get a hitching lesson too. Nothing leaves until you've started every appliance yourself.",
        ],
      },
      {
        heading: "Risk and damage",
        paragraphs: [
          "Inspect the unit at handoff. Note any damage on the delivery receipt before signing — claims for transit damage must be reported within 48 hours with photographs, and we'll make it right.",
          "If we damage your unit in transit (or your property during delivery), repairs are on us.",
        ],
      },
      {
        heading: "Failed delivery",
        paragraphs: [
          "If we can't reach the address or the site isn't accessible for a trailer (low wires, soft ground, gate codes missing), we'll contact you to reschedule. A reasonable re-delivery fee may apply after the second attempt.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [`Delivery questions: ${site.phone} or ${site.email}.`, BUSINESS],
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns & Refunds Policy",
    updated: "October 8, 2026",
    intro:
      "Our exchange window, when refunds apply, and how to start a return — in plain language.",
    sections: [
      {
        heading: "3-day / 300-mile exchange window",
        paragraphs: [
          "Most units include a three-day exchange window from delivery or pickup, provided the camper has been driven fewer than 300 miles. You may exchange it for another unit on the lot of equal or greater value.",
          "If the replacement costs more, you pay the difference. If it costs less, we refund the difference. Units sold as-is at a disclosed-and-acknowledged discount are excluded — this is always stated on your bill of sale.",
        ],
      },
      {
        heading: "When refunds apply",
        paragraphs: ["Full refunds are issued when:"],
        bullets: [
          "We cancel your order before the unit is prepared or delivered",
          "A unit turns out to be unavailable after your payment cleared",
          "Payment was taken in error or charged twice",
          "A required disclosure was omitted and you choose to cancel",
        ],
      },
      {
        heading: "How refunds are paid",
        paragraphs: [
          "Refunds go back to the original payment method. Card payments return in 3–7 business days; Zelle and bank transfers return in 1–3 business days. We process approved refunds within two business days and email you a confirmation with the reference number.",
        ],
      },
      {
        heading: "What's not refundable",
        paragraphs: [
          "Completed sales outside the exchange window are not refundable — like most vehicle dealers, our sales are exchanges rather than returns. Third-party delivery charges already incurred, and damage or alterations caused after handoff, are not refundable. Nothing here affects your rights under any written warranty or applicable law.",
        ],
      },
      {
        heading: "How to start a return or exchange",
        paragraphs: [
          `Call ${site.phone} or email ${site.email} with your order reference (TUC-XXXXXX) and what's going on. We'll respond within one business day with the next step — usually a quick inspection slot at the lot.`,
          "Do not ship or deliver a unit back to us without written authorization from our team.",
        ],
      },
      {
        heading: "Warranty claims",
        paragraphs: [
          "Warranty repairs are scheduled through the same contact. In-warranty failures are repaired at no charge; if we can't repair within a reasonable time, we'll offer an exchange or a refund of the warranty price.",
        ],
      },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    updated: "October 8, 2026",
    intro:
      "We want every visitor — regardless of ability — to browse inventory, place an order and track it without barriers.",
    sections: [
      {
        heading: "Our commitment",
        paragraphs: [
          `We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA across this website. Accessibility is part of how we build: features are keyboard-operable, text scales cleanly, and motion respects reduced-motion settings.`,
        ],
      },
      {
        heading: "What we've done",
        bullets: [
          "Semantic headings, landmarks and skip navigation for screen readers",
          "All interactive controls reachable and operable by keyboard, with visible focus indicators",
          "Text and interface colors meeting WCAG AA contrast ratios",
          "Alternative text on inventory and editorial images",
          "Form errors announced and linked to their fields",
          "Animations disabled when your system requests reduced motion",
          "Responsive layout that works at 400% zoom without horizontal scrolling",
        ],
        paragraphs: [],
      },
      {
        heading: "Known limitations",
        paragraphs: [
          "Some older documents (archived inspection reports and scanned warranty forms) may not be fully tagged. If you need one of these in an accessible format, we'll provide it on request — usually same day.",
          "Third-party content we don't control, such as linked map providers, may not fully conform. We're happy to give you any location information in text instead.",
        ],
      },
      {
        heading: "Alternative ways to use our services",
        paragraphs: [
          `Everything on this website can also be done by phone: orders, financing requests, trade-in valuations, tracking and support. Call ${site.phone} during business hours and a person will handle it for you.`,
        ],
      },
      {
        heading: "Feedback",
        paragraphs: [
          `Found a barrier? Tell us at ${site.email} or ${site.address} — include the page and what went wrong, and we'll fix it and reply within two business days.`,
        ],
      },
      {
        heading: "Assessment",
        paragraphs: [
          "This statement was last reviewed on October 8, 2026 following an internal audit against WCAG 2.2 AA. We re-test key flows after every significant site update.",
        ],
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    updated: "October 8, 2026",
    intro:
      "What the information on this website is — and isn't — and the limits on how you may rely on it.",
    sections: [
      {
        heading: "General information",
        paragraphs: [
          "Content on www.tonyusedcampers.com is provided for general information only. It is not professional advice — financial, legal, technical or otherwise — and should not be relied upon as the sole basis for a purchase decision.",
        ],
      },
      {
        heading: "Inventory accuracy",
        paragraphs: [
          "We work hard to keep specifications, photographs, pricing and availability accurate, but inventory turns quickly and errors happen. Photographs are of the actual unit unless stated. Mileage shown is odometer mileage at listing and may increase if the unit is road-tested. Confirm everything that matters to you in writing before purchase.",
        ],
      },
      {
        heading: "Pricing and estimates",
        paragraphs: [
          "Monthly payment figures on this website are illustrative estimates using sample rates — they are not offers of credit. Actual terms depend on lender approval, credit history and unit selection. See our finance disclosure for details.",
        ],
      },
      {
        heading: "External links",
        paragraphs: [
          "Links to third-party sites are provided for convenience. We do not control and are not responsible for their content, policies or accessibility.",
        ],
      },
      {
        heading: "Professional inspection",
        paragraphs: [
          "Our inspection reports describe findings at the time of inspection. Vehicles are mechanical products subject to wear; they are not warranted to be free of future faults unless a written warranty says so. Consider an independent pre-purchase inspection.",
        ],
      },
      {
        heading: "Limitation",
        paragraphs: [
          "To the fullest extent permitted by law, Tony Used Campers disclaims warranties, express or implied, regarding the website's uninterrupted operation or the completeness of its content, and is not liable for damages arising from reliance on information presented here. Nothing in this disclaimer limits liability that cannot be limited under Michigan law.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [`Corrections and questions: ${site.email}.`, BUSINESS],
      },
    ],
  },
  {
    slug: "finance-disclosure",
    title: "Finance Disclosure",
    updated: "October 8, 2026",
    intro:
      "Lending terms, how we're compensated, and the fine print behind the payment calculator.",
    sections: [
      {
        heading: "We are a dealer, not a lender",
        paragraphs: [
          `${BUSINESS} is a dealer arranging financing with third-party lenders. We are not a bank and do not make credit decisions. Approval, rate and terms are determined solely by the lender.`,
        ],
      },
      {
        heading: "Sample terms",
        paragraphs: [
          "Payment calculator figures use illustrative annual percentage rates between 7.49% and 8.99% over terms of 60 to 120 months, with your selected down payment, and assume a first payment due 30 days after signing. These are examples — not commitments.",
          "Your actual APR depends on creditworthiness, loan amount, unit age and term. Longer terms increase total interest paid. Late fees, prepayment and default terms are set out in your lender's contract.",
        ],
      },
      {
        heading: "Down payment",
        paragraphs: [
          "Most approvals require 10–20% down. Trade equity may be applied toward the down payment. Down payment amounts shown are estimates until the lender confirms the approved structure.",
        ],
      },
      {
        heading: "How we may be compensated",
        paragraphs: [
          "We may receive a flat origination fee or a small reserve from the lender when a loan is funded. We may also offer lender-rate buydowns that change your APR. Any compensation arrangement affecting your rate will be disclosed to you before you sign.",
          "You are never required to finance through our lenders — cash, Zelle, cashier's check and bank transfer are all available with no fee difference.",
        ],
      },
      {
        heading: "Soft vs. hard credit inquiry",
        paragraphs: [
          "Submitting the financing enquiry form on this website triggers no credit inquiry. A hard inquiry occurs only when you formally complete a lender application, and we'll tell you before that happens.",
        ],
      },
      {
        heading: "Required disclosures",
        bullets: [
          "Truth in Lending (Regulation Z) disclosures are provided by your lender at signing",
          "APR and total cost of credit will be shown before you commit",
          "You have the right to receive a copy of the credit application and decision",
          "Equal Housing Lender — credit is extended without regard to race, religion, national origin, sex, familial status or other protected class",
        ],
        paragraphs: [],
      },
      {
        heading: "Contact",
        paragraphs: [`Financing questions: ${site.email} or ${site.phone}.`, BUSINESS],
      },
    ],
  },
  ];
}

export const LEGAL_SLUGS = legalPages().map((page) => page.slug);

export function getLegalPage(slug: string, site?: LegalSite) {
  return legalPages(site).find((page) => page.slug === slug) ?? null;
}
