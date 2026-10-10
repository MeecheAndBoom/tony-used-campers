import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tony Used Campers has been inspecting, pricing straight and selling used campers out of Detroit since 2009.",
};

const VALUES = [
  {
    title: "Inspect everything, hide nothing",
    body: "Every unit passes a 120-point roof-to-tires inspection. The report comes with the camper — including the things we'd want to know if we were buying it.",
  },
  {
    title: "One price, no theater",
    body: "The lot price is the deal. No four-hour finance desk, no doc fee surprises, no 'let me talk to my manager.'",
  },
  {
    title: "Detroit first",
    body: "We deliver across the Lower Peninsula and we service what we sell — because you'll pass us on Michigan Ave for years after the sale.",
  },
];

const TEAM: {
  name: string;
  role: string;
  bio: string;
  image: string;
  position?: string;
}[] = [
  {
    name: "Tony Marchetti",
    role: "Founder",
    bio: "Started selling campers out of a two-space lot in 2009. Still inspects every trade-in himself.",
    image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/founder/family-portrait.webp",
    // Portrait source — bias upward so faces survive the 4/3 crop.
    position: "object-[center_22%]",
  },
  {
    name: "Dana Whitfield",
    role: "Lead Technician",
    bio: "ASE-certified, 22 years in RV service. Runs the 120-point inspection and the service bays.",
    image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/services-interior.jpg",
  },
  {
    name: "Marco Reyes",
    role: "Sales & Delivery",
    bio: "Handles deliveries from Ann Arbor to Traverse City — and the walkthrough when your camper arrives.",
    image: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/life-lot.jpg",
  },
];

const STATS = [
  { value: "2009", label: "Selling campers in Detroit since" },
  { value: "1,900+", label: "Campers delivered" },
  { value: "120", label: "Inspection points per unit" },
  { value: "4.9", label: "Average rating, 380 reviews" },
];

export default async function AboutPage() {
  const { site } = await getSettings();

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="section pb-14 pt-16 md:pt-24">
        <Reveal>
          <h1 className="max-w-[820px] text-balance text-[clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-ink">
            A family lot on Michigan Ave.
          </h1>
        </Reveal>
        <Reveal delay={90}>
          <p className="mt-5 max-w-[640px] text-[clamp(1.0625rem,1.8vw,1.3125rem)] leading-relaxed text-muted">
            We started with two spaces and a handshake rule: sell only what
            we&apos;d put our own family in. Seventeen years later, that&apos;s
            still the whole business.
          </p>
        </Reveal>
      </section>

      <Reveal delay={150} className="section">
        <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-alt">
          <Image
            src="https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/about-family.jpg"
            alt="The Tony Used Campers team on the lot"
            fill
            priority
            sizes="(max-width: 1180px) 100vw, 1180px"
            className="object-cover"
          />
        </div>
      </Reveal>

      {/* Stats band */}
      <section className="mt-16 bg-graphite py-14 md:mt-24 md:py-16">
        <div className="section grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <p className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tracking-[-0.03em] text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-[14px] leading-snug text-white/60">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="section section-pad">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
              How it runs.
            </h2>
          </Reveal>
          <div className="space-y-6 text-[17px] leading-[1.7] text-muted">
            <Reveal delay={70}>
              <p>
                Tony bought his first camper to fix it up for a friend, sold it
                for a profit, and never went back to his old job. The lot at
                4120 Michigan Ave opened in 2009 with two units and a folding
                table.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <p>
                What changed is scale — service bays, a delivery truck, a
                technician bench full of tools. What didn&apos;t change is how a
                unit gets here: trade-in or auction, then the same 120-point
                inspection, then the price card. Nothing moves to the front row
                until Dana signs the report.
              </p>
            </Reveal>
            <Reveal delay={210}>
              <p>
                Most of our buyers are first-timers or families coming back for
                a bigger unit. We answer the same questions happily, forever —
                that&apos;s why the{" "}
                <Link href="/first-time-buyers" className="text-accent hover:underline">
                  first-time buyer&apos;s guide
                </Link>{" "}
                exists.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-alt py-16 md:py-24">
        <div className="section">
          <Reveal>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.02em]">
              Three rules.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 90}>
                <div className="border-t-2 border-ink pt-5">
                  <h3 className="text-[19px] font-semibold tracking-[-0.01em]">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    {value.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section-pad">
        <Reveal>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.02em]">
            Who you&apos;ll deal with.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {TEAM.map((person, i) => (
            <Reveal key={person.name} delay={i * 90}>
              <article>
                <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-alt">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    sizes="(max-width: 640px) 90vw, 300px"
                    className={`object-cover ${person.position ?? ""}`}
                  />
                </div>
                <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.01em]">
                  {person.name}
                </h3>
                <p className="text-[13px] text-accent">{person.role}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">
                  {person.bio}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-graphite py-16 md:py-20">
        <div className="section text-center">
          <Reveal>
            <h2 className="text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
              Come see the lot.
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Link href="/shop" className="btn btn-primary btn-lg">
                Shop campers
              </Link>
              <Link href="/contact" className="btn btn-lg bg-white/10 text-white hover:bg-white/20">
                Book a viewing
              </Link>
            </div>
            <p className="mt-6 text-[14px] text-white/55">
              {site.address} · {site.hours[0]?.time ?? ""} weekdays
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
