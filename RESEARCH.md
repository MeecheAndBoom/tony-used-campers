# Tony Used Campers — Research & Build Plan

Caravan dealership website. Detroit, Michigan.
Stack: Next.js (App Router) · MongoDB · Cloudinary · SMTP email.
Design language: apple.com — clean, simple, restrained. No eyebrow headings, no icon spam.

---

## 1. Competitor Research — Caravan / RV Dealer Websites

### Sites studied
XGRiD Campers, Campers Inn RV, Paw Paw Campers, Kimberley Caravans (UK), Caravan World (AU),
SMC Motorhomes (UK), Carpenter's Campers, Joe's Campers, Williams Family RV, Alpin Haus RV,
CampMart RV, Gerzeny's RV, Camper Valley RV, Glossop Caravans (UK), Caravan Kingdom (UK),
Staffordshire Caravans (UK), Tilshead Caravans, Adwick Caravans, Winchester Caravans,
North West Caravans, Swindon Caravan Group, Lee Davey Caravans.

### Common page inventory found on these sites
| Category | Pages |
|---|---|
| Core | Home, About / Why Buy From Us, Contact |
| Inventory | Shop / New / Used inventory, individual listing pages, compare, filter/search |
| Services | Finance, Service & Parts, Accessories shop, Delivery, Trade-In / Consignment / Sell your caravan |
| Trust | Testimonials / Reviews, Awards, First-Time Buyers Guide, FAQ, Blog / News |
| Utility | Track Your Order, Book a Viewing, Book a Service, Sitemap, Search |
| Legal | Privacy, Terms, Cookies, Shipping/Delivery, Returns/Refunds, Accessibility, Finance Disclosure, Disclaimer, Complaints |

### Product card anatomy (the standard across all dealer sites)
1. Photo (large, consistent aspect ratio)
2. Condition/year badge — "New" / "Used 2023"
3. Make + model as title (e.g. "2023 Forest River Impression 235RW")
4. Stock number
5. Key specs in a row: Length · Sleeps · Dry Weight · Berths · Axles
6. Pricing block: list price struck through → "You save $X" → **sale price** → "from $X/mo"
7. CTA: "View Details" / "Get Today's Price"

### What the best sites do (patterns worth stealing)
- **Inventory-first homepage**: hero → featured units grid → trust blocks → services → reviews → CTA.
- **Filters**: condition (new/used), type/class, price range, length, brand, sleeps/berths.
- **Price transparency**: MSRP struck, savings called out, monthly payment estimate.
- **"Why buy from us"** as a dedicated page: no-pressure sales, multi-point inspection,
  history/finance check, warranty, handover demonstration, family-owned story, awards.
- **Sell/consignment funnel**: free valuation form, "we buy any condition", process explained in 3 steps.
- **Reviews integrated**: Trustpilot/Google rating in header area, full testimonials page, review cards with name + location + date.
- **First-time buyer guide** and **FAQ** reduce support load.
- **Handover / delivery** explained — collection day experience is a selling point.

### Gaps we can beat them on
- Almost all dealer sites are visually dated, icon-sprinkled, template-y.
- Few have a real cart/checkout + order tracking experience — we will (Apple-clean).
- Few send well-designed transactional emails — we will (one consistent template system).

---

## 2. Apple Design Language — What We Copy

### Navigation
- Translucent frosted bar: `background: rgba(255,255,255,.72)` + `backdrop-filter: blur(20px) saturate(180%)`.
- Height ~44–48px, small 12px links, generous letter spacing, items evenly spaced.
- Left: wordmark. Center/left group: primary links. Right: search icon, account, cart/bag icon.
- Sits over content; content scrolls underneath. On mobile: collapses to hamburger → full-screen sheet.
- Footer: light gray `#f5f5f7`, 4–5 columns of tiny 12px links, legal row at bottom.

### Homepage structure (apple.com)
- Full-bleed hero units: **centered** small headline → subhead → two blue text links
  ("Learn more · Buy") → large product image below. One unit per viewport, alternating bg (white / #f5f5f7 / black).
- Then a **tile grid**: 2-column on desktop, 1-column mobile. Each tile = image, centered title,
  centered one-line subhead, two links. Sometimes 2×2 bento of smaller tiles.
- Section rhythm: ~100–140px vertical padding, max-width ~980–1280px content.

### Product cards (apple.com/shop pattern)
- Image on top, **centered** text below: name (17px, semibold), tagline (14–15px, gray), price ("From $999").
- Two text links: `Learn more` (blue) and `Buy` (blue) — or one pill button.
- No borders, no drop shadows, no badges screaming. Whitespace does the separating.
- Hover: subtle image scale (`transform: scale(1.02)`, 400–600ms ease-out), link underline.

### Typography (SF Pro / system stack)
| Role | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|
| Hero display | clamp(40px, 6vw, 64px) | 600–700 | 1.05 | -0.02em |
| Section headline | clamp(28px, 4vw, 48px) | 600 | 1.1 | -0.015em |
| Card title | 17–21px | 600 | 1.2 | -0.01em |
| Body | 16–17px | 400 | 1.47–1.5 | 0 |
| Caption / meta | 12–14px | 400 | 1.4 | 0 |
- Hierarchy from **weight + size + leading as a set**, never eyebrow labels above headings.
- Headings are direct: "Used campers, ready for the road." — no kicker text.

### Color tokens (brand)
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#ffffff` | Page background |
| `--bg-alt` | `#f5f5f7` | Alternating sections, footer |
| `--ink` | `#1d1d1f` | Primary text, dark sections bg |
| `--ink-2` | `#6e6e73` | Secondary text |
| `--black` | `#000000` | CTA bands, footer option |
| `--blue` | `#0071e3` | **Primary buttons, links** (light blue) |
| `--blue-hover` | `#0077ed` | Button hover |
| `--line` | `#d2d2d7` | Hairlines, dividers |
- Buttons: light blue pill, `border-radius: 980px`, white text, 12–17px, no icons.
- Secondary button: transparent w/ blue text, or `#f5f5f7` with ink text.
- Sections alternate white / `#f5f5f7` / occasionally `#1d1d1f` (dark band for CTA + footer).

### Icons policy (per brief)
- **No decorative icons.** Icons only for: nav/search/cart/filter affordances, admin dashboard
  nav links, small-screen word representation.
- Font Awesome (FA), never emoji.

### Motion (apple-design skill + transitions.dev)
- Springs by default: `bounce: 0, duration: 0.4` (critically damped); bounce only after a flick/drag.
- Press feedback on pointer-down: `:active { transform: scale(.97) }`, 100ms ease-out.
- Translucent materials animate blur + scale on enter ("materialize, don't just fade").
- Enter/exit along the same path; origin anchored to trigger.
- Scroll reveals: short opacity + 12–16px rise, 400–500ms, ease-out — used sparingly.
- All transitions via **transitions.dev** motion tokens — never ad-hoc durations.
- `prefers-reduced-motion`: cross-fade only, no springs/slides.

---

## 3. Skills Installed

| Skill | Source | Purpose in this project |
|---|---|---|
| `apple-design` | emilkowalski/skills | Apple motion + layout principles, springs, materials, typography rules |
| `design-taste-frontend` (+12 variants) | Leonxlnx/taste-skill | Anti-slop layout/typography/spacing discipline |
| `transitions-dev` | Jakubantalik/transitions.dev | Canonical transition recipes + motion token scale |
| `impeccable` | pbakaus/impeccable | `/impeccable` critique/audit/polish commands, 61 design anti-pattern detectors |

Installed to `.agents/skills/` in the workspace root.

---

## 4. Page Inventory — Tony Used Campers

### Public site
| # | Page | Route | Notes |
|---|---|---|---|
| 1 | Home | `/` | Hero, featured campers, services strip, why-us, reviews, CTA band |
| 2 | About | `/about` | Story, family/Detroit, values, team, stats |
| 3 | Services | `/services` | Service, repair, parts, accessories, delivery, warranty — index w/ detail sections |
| 4 | Shop | `/shop` | All units, filters (condition, type, price, length, brand, sleeps), sort, grid |
| 5 | Product detail | `/shop/[slug]` | Gallery, specs, price block, add to cart, enquiry, related units |
| 6 | Cart | `/cart` | Line items, totals, continue |
| 7 | Checkout | `/checkout` | Contact → delivery/pickup → **payment method select** → place order |
| 8 | Order confirmation | `/checkout/success/[ref]` | Reference number, what happens next |
| 9 | Track order | `/track` | Email + order reference → progress timeline + order summary |
| 10 | Testimonials & Reviews | `/testimonials` | Rating summary, review cards, submit-review form |
| 11 | Contact | `/contact` | Form, address (Detroit MI), hours, map placeholder |
| 12 | Why Buy From Us | `/why-buy-from-us` | Trust page (common on competitor sites) |
| 13 | Finance | `/finance` | Options, calculator, application enquiry |
| 14 | Trade-In / Sell Your Camper | `/sell` | Valuation form, 3-step process |
| 15 | FAQ | `/faq` | Accordion |
| 16 | First-Time Buyers Guide | `/first-time-buyers` | Editorial guide (differentiator) |
| 17 | Search results | `/search` | Site + inventory search |

### Legal (footer-linked, all required)
| Page | Route |
|---|---|
| Privacy Policy | `/legal/privacy` |
| Terms & Conditions | `/legal/terms` |
| Cookie Policy | `/legal/cookies` (+ consent banner) |
| Shipping & Delivery Policy | `/legal/shipping` |
| Returns & Refunds Policy | `/legal/returns` |
| Accessibility Statement | `/legal/accessibility` |
| Disclaimer | `/legal/disclaimer` |
| Finance Disclosure | `/legal/finance-disclosure` |
| Sitemap | `/sitemap` (also XML) |

### Admin dashboard (`/admin`, session-protected)
- Login
- Overview (orders, low stock, recent reviews, revenue)
- **Orders** — list, detail, status workflow, **send payment details form** (styled email), mark paid, update status, notes
- **Products** — CRUD, image upload → Cloudinary, publish/unpublish, specs, pricing
- **Reviews** — approve/reject/publish
- **Enquiries** — contact/finance/sell-form submissions
- **Settings** — payment methods list editable, store info, email templates preview
- Icons: Font Awesome, used only for sidebar nav + row actions.

---

## 5. Order → Payment → Tracking Flow (core requirement)

```
Cart → Checkout
  1. Contact details (name, email, phone)
  2. Delivery method (pickup in Detroit / delivery — cost shown)
  3. Payment method (radio list):
       Credit / Debit Card
       PayPal
       Zelle
       Cashier's Check / Bank Transfer
       Financing (we'll send application)
       Other ──► free-text input ("specify your method")
  4. Place order
       → order reference generated:  TUC-XXXXXX
       → email #1 to CLIENT  (order received + reference + next steps + track link)
       → email #2 to ADMIN   (new order: items, totals, chosen payment method, contact)
       → cart cleared, redirect to /checkout/success/[ref]

Admin side (later):
  → Admin opens order → "Send payment details" form
       (method, pay-to name, routing/account or wallet, amount, due date, instructions, memo)
  → email #3 to CLIENT — styled template: payment instructions + amount due + reference
  → client pays, admin clicks "Mark as payment received"
  → email #4 to CLIENT — payment confirmed, order status advances

Statuses: Placed → Payment Pending → Payment Received → Preparing → Out for Delivery / Ready for Pickup → Completed
          (+ Cancelled)
```

### Track page (research: Baymard 6 details that matter)
Form: **email used at checkout + order reference**. Result shows:
1. Expected delivery / pickup date
2. Status progress bar (stepper through statuses)
3. Current status label in plain language
4. Timeline history with timestamps
5. Linked tracking number (if shipped) → opens carrier site in new tab
6. Package contents summary (thumbnail, name, qty, price, order total)
Never expose order data without both email + reference match.

### Email templates (one consistent system, React Email or MJML → Nodemailer/SMTP)
| # | Email | Trigger |
|---|---|---|
| 1 | Order received | order placed |
| 2 | New order alert | order placed (admin) |
| 3 | Payment instructions | admin action |
| 4 | Payment confirmed | admin action |
| 5 | Status update (ready/shipped) | admin status change |
| 6 | Contact form notice | enquiry (admin) + auto-reply (client) |
- Style: white card on `#f5f5f7`, logo top-left, order ref top-right, system font stack,
  14–15px body, blue pill CTA, gray hairline dividers, legal footer. Apple-order-email minimal.

---

## 6. Technical Architecture

```
Next.js 15 (App Router, TypeScript)
  ├─ MongoDB (mongoose) — collections:
  │    products, orders, reviews, enquiries, users(admin), settings, pages
  ├─ Cloudinary — product/gallery image upload (unsigned preset or signed route)
  ├─ Nodemailer (SMTP) — transactional emails, React Email templates
  ├─ Cart: client store (Zustand + localStorage) → persisted server-side on order
  ├─ Auth: credentials (bcrypt) + iron-session/jose cookie for /admin
  ├─ Validation: zod on all API routes
  └─ Motion: motion (framer) springs + transitions.dev tokens + tailwind transitions
```

### Product schema (sketch)
```
Product { slug, title, brand, model, year, condition: new|used, type,
  price, listPrice?, monthlyFrom?, stockNumber, specs { length, sleeps, weight, berths, axles },
  description, features[], images[] (cloudinary), status, featured, createdAt }
```

### Order schema (sketch)
```
Order { reference: "TUC-XXXXXX", items[], subtotal, deliveryFee, total,
  customer { name, email, phone }, delivery { method, address? },
  payment { method, methodOther?, instructions?, status: pending|received },
  status, statusHistory[{ status, note, at }],
  timeline[{ label, at }], createdAt }
```

---

## 7. Design Rules (non-negotiable, from the brief)

1. Apple-level simplicity. Whitespace over borders.
2. **No eyebrow/kicker headings** — headings stand alone.
3. **No icon spam** — icons only: cart, search, filter, admin nav, mobile affordances. Font Awesome only, never emoji.
4. Light blue (`#0071e3`) for primary buttons. White / gray / black sections. Black or gray footer + CTA bands.
5. Translucent Apple-style nav, identical treatment sitewide.
6. Product cards: image top, centered text, no heavy chrome.
7. Every transition comes from transitions.dev tokens; springs (apple-design) for interactive motion.
8. Copy voice: short, plain, confident. Product names are the headline.
