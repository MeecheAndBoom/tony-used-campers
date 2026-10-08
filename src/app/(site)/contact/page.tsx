import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call, email or visit the lot — Tony Used Campers, 4120 Michigan Ave, Detroit, MI.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="section pb-16 pt-16 md:pb-20 md:pt-24">
        <Reveal>
          <h1 className="text-balance text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            Talk to a real person.
          </h1>
        </Reveal>
        <Reveal delay={90}>
          <p className="mt-4 max-w-[600px] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-relaxed text-muted">
            No call centers, no bots. Messages go straight to the lot and we
            answer within one business day.
          </p>
        </Reveal>
      </section>

      <section className="section grid gap-12 pb-20 md:pb-28 lg:grid-cols-[1fr_360px] lg:gap-16">
        <div>
          <h2 className="text-[20px] font-semibold tracking-[-0.01em]">
            Send a message
          </h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-card bg-alt p-6">
            <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
              Visit the lot
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              {SITE.address}
            </p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(SITE.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[14px] text-accent hover:underline"
            >
              Open in Maps →
            </a>

            {/* Map placeholder */}
            <div className="mt-5 grid aspect-[16/10] place-items-center rounded-box bg-alt-deep">
              <p className="text-center text-[13px] text-muted">
                <i className="fa-solid fa-location-dot mb-2 block text-[22px] text-accent" aria-hidden="true" />
                Detroit, Michigan
              </p>
            </div>
          </div>

          <div className="rounded-card border border-line p-6">
            <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
              Hours
            </h2>
            <dl className="mt-3 space-y-2 text-[14px]">
              {SITE.hours.map((row) => (
                <div key={row.days} className="flex justify-between gap-4">
                  <dt className="text-muted">{row.days}</dt>
                  <dd className="m-0 text-ink">{row.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-card border border-line p-6">
            <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
              Direct lines
            </h2>
            <ul className="mt-3 space-y-2.5 text-[15px]">
              <li>
                <a
                  href={`tel:${SITE.phoneHref}`}
                  className="text-accent hover:underline"
                >
                  {SITE.phone}
                </a>
                <span className="block text-[13px] text-muted">
                  Sales &amp; questions
                </span>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-accent hover:underline"
                >
                  {SITE.email}
                </a>
                <span className="block text-[13px] text-muted">Email</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
