import Link from "next/link";
import { listAdminProducts } from "@/lib/products";
import { money } from "@/lib/format";
import { deleteProductAction } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminProductsPage() {
  const products = await listAdminProducts();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
            Products
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            {products.length} unit{products.length === 1 ? "" : "s"} — live and draft.
            Add, edit and delete inventory here; changes appear on the shop
            immediately.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          Add product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.length === 0 && (
          <div className="rounded-card border border-line-soft bg-white p-6 text-[15px] text-muted sm:col-span-2 xl:col-span-3">
            No inventory yet. Add your first camper.
          </div>
        )}
        {products.map((p) => (
          <article
            key={p.slug}
            className="flex flex-col rounded-card border border-line-soft bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[15px] font-medium leading-snug text-ink">
                {p.title}
              </h3>
              <span
                className={`badge ${
                  p.status === "live"
                    ? "bg-sky text-accent"
                    : "bg-alt text-muted"
                }`}
              >
                {p.status}
              </span>
            </div>

            <p className="mt-1 break-all text-[13px] text-muted">
              {p.brand} {p.model} · {p.stockNumber}
            </p>

            <dl className="mt-4 space-y-1.5 border-t border-line-soft pt-3 text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Type</dt>
                <dd className="m-0 text-ink">{p.type}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Year</dt>
                <dd className="m-0 text-ink">{p.year}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Price</dt>
                <dd className="m-0 font-semibold text-ink">
                  {money(p.price)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-3">
              <a
                href={`/admin/products/${p.slug}`}
                className="text-[14px] text-accent hover:underline"
              >
                Edit
              </a>
              <form action={deleteProductAction}>
                <input type="hidden" name="slug" value={p.slug} />
                <DeleteButton
                  label="Delete"
                  message={`Delete "${p.title}"? This can't be undone.`}
                />
              </form>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}