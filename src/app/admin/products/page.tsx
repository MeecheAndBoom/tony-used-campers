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
        <a href="/admin/products/new" className="btn btn-primary">
          Add product
        </a>
      </div>

      <div className="overflow-hidden rounded-card bg-white">
        {products.length === 0 ? (
          <p className="p-6 text-[15px] text-muted">
            No inventory yet. Add your first camper.
          </p>
        ) : (
          <table className="w-full text-left text-[15px]">
            <thead className="border-b border-line text-[13px] text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Unit</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Year</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.slug} className="border-b border-line-soft last:border-0">
                  <td className="px-5 py-3">
                    <span className="block font-medium text-ink">{p.title}</span>
                    <span className="text-[13px] text-muted">
                      {p.brand} {p.model} · {p.stockNumber}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">{p.type}</td>
                  <td className="px-5 py-3 text-muted">{p.year}</td>
                  <td className="px-5 py-3 text-ink">{money(p.price)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`badge ${
                        p.status === "live"
                          ? "bg-sky text-accent"
                          : "bg-alt text-muted"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-4">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}