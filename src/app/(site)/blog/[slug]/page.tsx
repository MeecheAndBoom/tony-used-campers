import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostBody } from "@/components/site/PostBody";
import { JsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { getBlogPost, getBlogPosts, readingMinutes } from "@/lib/blog";
import { getSettings } from "@/lib/settings";
import { ratingSummary, getReviews } from "@/lib/reviews";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  localBusinessJsonLd,
  postDescription,
  postKeywords,
} from "@/lib/seo";
import { shortDate } from "@/lib/format";
import { SITE } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post not found" };

  const description = postDescription(post);
  return {
    title: post.title,
    description,
    keywords: postKeywords(post),
    authors: [{ name: post.author }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/blog/${post.slug}`,
      siteName: SITE.name,
      publishedTime: post.date,
      // Mongo returns updatedAt as a Date; normalize so Next renders an ISO
      // string instead of "[object Object]".
      modifiedTime: post.updatedAt
        ? new Date(post.updatedAt).toISOString()
        : post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.image
        ? [{ url: post.image, alt: post.title }]
        : [{ url: "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/tony-campers-og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [post.image || "https://res.cloudinary.com/hrnohv4p/image/upload/tuc/tony-campers-og.png"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const [{ site }, reviews, siblings] = await Promise.all([
    getSettings(),
    getReviews(),
    getBlogPosts({ category: post.category }),
  ]);
  const { average, count } = ratingSummary(reviews);
  const related = siblings.filter((p) => p.slug !== post.slug).slice(0, 3);
  const minutes = readingMinutes(post.body);

  // A short FAQ block on every post gives search something structured to pull.
  const faq = [
    {
      question: `Who writes the ${SITE.name} blog?`,
      answer:
        "The lot itself — Tony Marchetti runs the shop, inspects every unit and writes these posts. He's been selling campers in Detroit since 2015.",
    },
    {
      question: "Can I get this kind of advice in person?",
      answer: `Yes. The shop is at ${site.address}, open ${site.hours[0]?.days} ${site.hours[0]?.time}. Call ${site.phone} or come by — no appointment needed.`,
    },
  ];

  return (
    <div className="bg-white">
      <JsonLd data={articleJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title },
        ])}
      />
      <JsonLd data={faqJsonLd(faq)} />
      <JsonLd data={localBusinessJsonLd(site, { average, count })} />

      <article className="section max-w-[820px] pb-6 pt-16 md:pt-24">
        <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-accent">
                Home
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link href="/blog" className="hover:text-accent">
                Blog
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="text-ink">{post.category}</li>
          </ol>
        </nav>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-[14px] text-muted">
          <span className="rounded-pill bg-sky px-3 py-1 font-medium text-accent">
            {post.category}
          </span>
          <span>{shortDate(post.date)}</span>
          <span aria-hidden>·</span>
          <span>{minutes} min read</span>
        </div>

        <h1 className="mt-4 text-balance text-[clamp(2rem,4.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-ink">
          {post.title}
        </h1>
        <p className="mt-4 text-[clamp(1.0625rem,1.6vw,1.1875rem)] leading-relaxed text-muted">
          {post.excerpt}
        </p>
        <div className="mt-6 flex items-center gap-3 border-y border-line-soft py-4 text-[15px]">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-alt text-[14px] font-semibold text-ink-soft">
            {post.author
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </span>
          <div className="leading-tight">
            <p className="font-medium text-ink">{post.author}</p>
            <p className="text-[13px] text-muted">Tony Used Campers, Detroit</p>
          </div>
        </div>
      </article>

      <div className="section max-w-[820px]">
        <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-alt">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 860px) 92vw, 820px"
            className="object-cover"
          />
        </div>
      </div>

      <article className="section max-w-[820px] pb-14 pt-10">
        <PostBody body={post.body} />
      </article>

      {/* CTA */}
      <section className="section max-w-[820px] pb-14">
        <div className="rounded-card bg-alt p-7">
          <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-ink">
            Put the advice to work
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            Every unit on the lot passes a 120-point inspection, and you get the
            report before you pay anything. See what&apos;s in stock today.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-primary">
              Shop used campers
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Talk to a specialist
            </Link>
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="section max-w-[820px] pb-12">
        <ul className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-pill border border-line-soft px-3 py-1.5 text-[13px] text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      </section>

      {related.length ? (
        <section className="section pb-20 md:pb-28">
          <h2 className="text-[clamp(1.375rem,2.5vw,1.75rem)] font-semibold tracking-[-0.015em] text-ink">
            Related posts
          </h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <li key={item.slug}>
                <Reveal delay={i * 60}>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="group flex h-full flex-col rounded-card border border-line-soft p-5 transition-[transform,border-color] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-line"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-box bg-alt">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 92vw, 30vw"
                        className="object-cover transition-transform duration-[500ms] group-hover:scale-[1.04]"
                      />
                    </div>
                    <span className="mt-4 text-[13px] font-medium text-accent">
                      {item.category}
                    </span>
                    <h3 className="mt-1.5 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">
                      {item.excerpt}
                    </p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
