import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Services",
  description:
    "RV service and repair, inspections, parts, accessories, delivery and warranty support — Tony Used Campers, Detroit.",
};

type Service = {
  title: string;
  body: string;
  points: string[];
  image?: string;
  /** object-position for portrait sources so the subject stays framed. */
  imagePos?: string;
};

const SERVICES: Service[] = [
  {
    title: "Service & repair",
    body: "Factory-trained techs in our Michigan Ave bays — from a fridge that won't light to a slide that won't move.",
    points: [
      "Roof resealing and leak tracing",
      "Slide-out service and roller replacement",
      "Appliance repair — fridge, furnace, water heater",
      "Brakes, bearings, suspension and hitch setup",
      "Pre-season checkups before your first trip",
    ],
    image: "https://res.cloudinary.com/qkbrqtav/image/upload/tuc/images/services-repair.jpg",
    imagePos: "center 35%",
  },
  {
    title: "Inspections",
    body: "Buying elsewhere? Bring it to us. An independent 120-point report before you sign anything.",
    points: [
      "Roof, seals and water-intrusion check",
      "Systems test — propane, electrical, plumbing",
      "Undercarriage, tires and brakes",
      "Written report with photos within 24 hours",
    ],
    image: "https://res.cloudinary.com/qkbrqtav/image/upload/tuc/images/services-inspection.jpg",
  },
  {
    title: "Parts & accessories",
    body: "The stuff you forgot to buy before you left — plus the upgrades worth doing at home.",
    points: [
      "Hitch equipment and weight distribution setups",
      "Leveling blocks, sewer hoses, water filters",
      "Slide toppers, awning care, covers",
      "Dash cams, solar, battery upgrades",
    ],
    image: "https://res.cloudinary.com/qkbrqtav/image/upload/tuc/images/services-parts.jpg",
  },
  {
    title: "Delivery & walkthrough",
    body: "We deliver anywhere in Michigan's Lower Peninsula and hand over the keys in person.",
    points: [
      "Free delivery within the Lower Peninsula",
      "Full setup walkthrough on arrival",
      "Hitching lesson for first-timers",
      "Storage guidance for the off-season",
    ],
    image: "https://res.cloudinary.com/qkbrqtav/image/upload/tuc/images/services-delivery.jpg",
  },
  {
    title: "Trade-ins & consignment",
    body: "Upgrading? We'll value your current unit in writing — cash offer or trade credit.",
    points: [
      "Same-day written valuation",
      "Trade credit applies to any unit on the lot",
      "Consignment handled end to end",
    ],
    image: "https://res.cloudinary.com/qkbrqtav/image/upload/tuc/images/services-tradein.jpg",
  },
  {
    title: "Warranty support",
    body: "Units sold with a powertrain or appliance warranty — we handle the claims, you make one call.",
    points: [
      "In-house 90-day limited warranty on most units",
      "Third-party plans honored and serviced here",
      "Claim paperwork filed by our team",
    ],
    image: "https://res.cloudinary.com/qkbrqtav/image/upload/tuc/images/services-warranty.jpg",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-white">
      <section className="section pb-14 pt-16 md:pt-24">
        <Reveal>
          <h1 className="max-w-[820px] text-balance text-[clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-ink">
            We service what we sell.
          </h1>
        </Reveal>
        <Reveal delay={90}>
          <p className="mt-5 max-w-[640px] text-[clamp(1.0625rem,1.8vw,1.3125rem)] leading-relaxed text-muted">
            Two working bays, one inspection bench, and techs who&apos;ve seen
            every failure mode a ten-year-old camper can produce.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn btn-primary">
              Book service
            </Link>
            <a href="tel:+13133649615" className="btn btn-ghost">
              Call the shop
            </a>
          </div>
        </Reveal>
      </section>

      <section className="section content-auto pb-20 md:pb-28">
        <div className="space-y-16 md:space-y-24">
          {SERVICES.map((service, index) => {
            const flipped = index % 2 === 1;
            return (
              <Reveal key={service.title}>
                <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                  <div
                    className={`relative aspect-[4/3] overflow-hidden rounded-card bg-alt ${
                      flipped ? "lg:order-2" : ""
                    }`}
                  >
                    {service.image && (
                      <Image
                        src={service.image}
                        alt={`${service.title} — Tony Used Campers service bay on Michigan Ave, Detroit`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 560px"
                        className="object-cover"
                        style={
                          service.imagePos
                            ? { objectPosition: service.imagePos }
                            : undefined
                        }
                      />
                    )}
                  </div>

                  <div>
                    <h2 className="text-[clamp(1.5rem,3vw,2.125rem)] font-semibold leading-[1.12] tracking-[-0.015em]">
                      {service.title}
                    </h2>
                    <p className="mt-3 text-[17px] leading-relaxed text-muted">
                      {service.body}
                    </p>
                    <ul className="mt-5 space-y-0">
                      {service.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 border-b border-line-soft py-3 text-[15px] last:border-0"
                        >
                          <i
                            className="fa-solid fa-check mt-1 text-[12px] text-accent"
                            aria-hidden="true"
                          />
                          <span className="text-ink">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-graphite py-16 md:py-20">
        <div className="section text-center">
          <Reveal>
            <h2 className="text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
              Something broken?
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-relaxed text-white/60">
              Tell us the symptom and the model — we&apos;ll tell you honestly
              whether it&apos;s a Tuesday fix or a parts wait.
            </p>
          </Reveal>
          <Reveal delay={90}>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn btn-primary btn-lg">
                Request service
              </Link>
              <Link href="/faq" className="btn btn-lg bg-white/10 text-white hover:bg-white/20">
                Read the FAQ
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
