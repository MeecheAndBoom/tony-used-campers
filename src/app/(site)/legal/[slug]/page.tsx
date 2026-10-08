import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { LEGAL_PAGES, getLegalPage } from "@/lib/legal";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LEGAL_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) return { title: "Legal" };
  return { title: page.title, description: page.intro };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  return (
    <div className="bg-white">
      <section className="section grid gap-12 pb-20 pt-16 md:pb-28 md:pt-24 lg:grid-cols-[220px_1fr] lg:gap-16">
        <nav aria-label="Legal documents" className="hidden lg:block">
          <ul className="sticky top-24 space-y-3 text-[15px]">
            {LEGAL_PAGES.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/legal/${item.slug}`}
                  className={
                    item.slug === page.slug
                      ? "font-medium text-ink"
                      : "text-muted transition-colors hover:text-accent"
                  }
                  aria-current={item.slug === page.slug ? "page" : undefined}
                >
                  {item.title}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link href="/sitemap" className="text-accent hover:underline">
                All pages →
              </Link>
            </li>
          </ul>
        </nav>

        <article className="max-w-[760px]">
          <Reveal>
            <h1 className="text-balance text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-ink">
              {page.title}
            </h1>
            <p className="mt-3 text-[14px] text-muted">Last updated {page.updated}</p>
            <p className="mt-5 text-[clamp(1.0625rem,1.6vw,1.1875rem)] leading-relaxed text-muted">
              {page.intro}
            </p>
          </Reveal>

          <div className="mt-12 space-y-11">
            {page.sections.map((section, i) => (
              <Reveal key={section.heading} delay={Math.min(i, 3) * 50} as="section">
                <h2 className="text-[20px] font-semibold tracking-[-0.01em]">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-4 text-[16px] leading-[1.7] text-muted">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2.5">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-3 text-[16px] leading-[1.6] text-muted"
                      >
                        <i
                          className="fa-solid fa-check mt-1.5 text-[12px] text-accent"
                          aria-hidden="true"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
