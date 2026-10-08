import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/site/AddToCart";
import { Gallery } from "@/components/site/Gallery";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { money } from "@/lib/format";
import { getProduct, getProducts } from "@/lib/products";
import { SITE } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Camper not found" };
  return {
    title: `${product.title} — ${money(product.price)}`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = (await getProducts({ type: product.type }))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const specs: { label: string; value: string }[] = [
    { label: "Year", value: String(product.year) },
    { label: "Condition", value: product.condition === "new" ? "New" : "Used" },
    { label: "Type", value: product.type },
    { label: "Length", value: product.specs.length },
    { label: "Sleeps", value: product.specs.sleeps },
    { label: "Weight", value: product.specs.weight },
    { label: product.specs.slides === "1" ? "Slide-outs" : "Slides", value: product.specs.slides },
    { label: "Stock #", value: product.stockNumber },
  ];

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="section pt-20 text-[13px] text-muted md:pt-24">
        <Link href="/shop" className="transition-colors hover:text-accent">
          Shop
        </Link>
        <span className="mx-2 text-line">/</span>
        <span className="text-ink">{product.title}</span>
      </div>

      <section className="section grid gap-10 pb-16 pt-6 lg:grid-cols-2 lg:gap-16 lg:pb-24">
        <Gallery images={product.images} title={product.title} />

        <div>
          <h1 className="text-balance text-[clamp(1.875rem,3.5vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-ink">
            {product.title}
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            {product.year} · {product.type} · Stock #{product.stockNumber}
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em] text-ink">
              {money(product.price)}
            </span>
            {product.listPrice && product.listPrice > product.price && (
              <span className="text-[17px] text-muted-light line-through">
                {money(product.listPrice)}
              </span>
            )}
          </div>
          {product.monthlyFrom && (
            <p className="mt-1 text-[14px] text-muted">
              or {money(product.monthlyFrom, true)}/mo. with approved credit —{" "}
              <Link href="/finance" className="text-accent hover:underline">
                see financing
              </Link>
            </p>
          )}

          <p className="mt-6 max-w-[560px] text-[16px] leading-[1.65] text-muted">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          {/* Spec grid */}
          <dl className="mt-10 grid grid-cols-2 gap-x-8 border-t border-line pt-6 sm:grid-cols-4 lg:grid-cols-2">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="border-b border-line-soft py-3"
              >
                <dt className="text-[13px] text-muted">{spec.label}</dt>
                <dd className="m-0 text-[15px] font-medium text-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>

          {/* Trust line */}
          <div className="mt-8 rounded-card bg-alt p-5">
            <p className="text-[14px] leading-relaxed text-muted">
              <strong className="font-semibold text-ink">120-point inspection</strong>{" "}
              included on this unit. Pickup at {SITE.address}, or delivery
              anywhere in the Lower Peninsula.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      {product.features.length > 0 && (
        <section className="bg-alt py-16 md:py-24">
          <div className="section">
            <Reveal>
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.015em]">
                What&apos;s on board.
              </h2>
            </Reveal>
            <ul className="mt-8 grid gap-x-10 gap-y-0 sm:grid-cols-2">
              {product.features.map((feature, i) => (
                <Reveal key={feature} delay={(i % 2) * 60}>
                  <li className="flex items-start gap-3 border-b border-line py-4">
                    <i
                      className="fa-solid fa-check mt-1 text-[13px] text-accent"
                      aria-hidden="true"
                    />
                    <span className="text-[15px] text-ink">{feature}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="section py-16 md:py-24">
          <Reveal>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.015em]">
              Similar campers.
            </h2>
          </Reveal>
          <div className="mt-9 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <Reveal key={item.slug} delay={(i % 3) * 70}>
                <ProductCard product={item} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
