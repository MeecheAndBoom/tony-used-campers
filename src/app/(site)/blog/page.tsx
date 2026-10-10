import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogPosts, readingMinutes, BLOG_CATEGORIES } from "@/lib/blog";
import { blogJsonLd, breadcrumbJsonLd, SITE_KEYWORDS } from "@/lib/seo";
import { shortDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "RV Blog — Buying Guides, Maintenance & Michigan Camping",
  description:
    "Straight answers on buying, owning and maintaining used campers: inspection checklists, winterizing, tire codes, real ownership costs and Michigan campground picks.",
  keywords: [
    ...SITE_KEYWORDS,
    "RV blog",
    "camper buying guide",
    "RV maintenance tips",
    "Michigan RV camping",
    "full-time RV living",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "RV Blog — Buying Guides, Maintenance & Michigan Camping",
    description:
      "Inspection checklists, winterizing steps, tire codes, ownership costs and Michigan campground picks — from the lot on Michigan Ave.",
    url: "/blog",
    type: "website",
  },
};

type Props = { searchParams: Promise<{ category?: string; q?: string }> };

export default async function BlogIndexPage({ searchParams }: Props) {
  const params = await searchParams;
  const category =
    params.category && BLOG_CATEGORIES.includes(params.category as never)
      ? params.category
      : undefined;

  const [posts, allPosts] = await Promise.all([
    getBlogPosts({
      ...(category ? { category } : {}),
      ...(params.q ? { q: params.q } : {}),
    }),
    getBlogPosts(),
  ]);

  const featured = !category && !params.q ? allPosts.find((p) => p.featured) : undefined;
  const grid = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;
  const categories = BLOG_CATEGORIES.filter((c) =>
    allPosts.some((p) => p.category === c),
  );

  return (
    <div className="bg-white">
      <JsonLd data={blogJsonLd(allPosts)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog" },
        ])}
      />

      <section className="section pb-8 pt-16 md:pt-24">
        <Reveal>
          <h1 className="text-balance text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            Straight answers from the lot.
          </h1>
        </Reveal>
        <Reveal delay={90}>
          <p className="mt-4 max-w-[640px] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-relaxed text-muted">
            Inspection checklists, maintenance work, real ownership numbers and
            where to camp in Michigan — written by the people who sell and
            service the campers.
          </p>
        </Reveal>
      </section>

      {/* Category filter */}
      <section className="section pb-10">
        <nav aria-label="Blog categories" className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-pill px-4 py-2 text-[14px] font-medium transition-colors ${
              !category
                ? "bg-ink text-white"
                : "bg-alt text-ink-soft hover:bg-alt-deep"
            }`}
          >
            All posts
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/blog?category=${encodeURIComponent(c)}`}
              className={`rounded-pill px-4 py-2 text-[14px] font-medium transition-colors ${
                category === c
                  ? "bg-ink text-white"
                  : "bg-alt text-ink-soft hover:bg-alt-deep"
              }`}
            >
              {c}
            </Link>
          ))}
        </nav>
      </section>

      {featured ? (
        <section className="section pb-14">
          <Reveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid gap-6 rounded-card border border-line-soft bg-alt p-6 transition-colors hover:border-line md:grid-cols-2 md:p-8"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-box bg-alt-deep">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 768px) 92vw, 46vw"
                  className="object-cover transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 text-[13px] text-muted">
                  <span className="rounded-pill bg-white px-2.5 py-1 font-medium text-accent">
                    {featured.category}
                  </span>
                  <span>{shortDate(featured.date)}</span>
                  <span>{readingMinutes(featured.body)} min read</span>
                </div>
                <h2 className="mt-3 text-balance text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-[1.15] tracking-[-0.015em] text-ink transition-colors group-hover:text-accent">
                  {featured.title}
                </h2>
                <p className="mt-3 text-[16px] leading-relaxed text-muted">
                  {featured.excerpt}
                </p>
                <span className="mt-5 text-[15px] font-medium text-accent">
                  Read the post →
                </span>
              </div>
            </Link>
          </Reveal>
        </section>
      ) : null}

      <section className="section pb-20 md:pb-28">
        {grid.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((post, i) => (
              <li key={post.slug}>
                <Reveal delay={Math.min(i * 60, 240)}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col rounded-card border border-line-soft bg-white p-5 transition-[transform,border-color] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-line"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-box bg-alt">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                        className="object-cover transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-muted">
                      <span className="font-medium text-accent">{post.category}</span>
                      <span>{shortDate(post.date)}</span>
                    </div>
                    <h2 className="mt-2 text-[18px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-3 text-[13px] text-muted">
                      <span>{post.author}</span>
                      <span>{readingMinutes(post.body)} min read</span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-card bg-alt p-10 text-center">
            <p className="text-[17px] font-medium text-ink">
              Nothing in that category yet.
            </p>
            <p className="mt-2 text-[15px] text-muted">
              Try another category, or{" "}
              <Link href="/blog" className="text-accent hover:underline">
                see everything we&apos;ve published
              </Link>
              .
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
