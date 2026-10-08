import { getProducts } from "@/lib/products";
import { money } from "@/lib/format";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <>
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          Products
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Live inventory on the shop, {products.length} unit
          {products.length === 1 ? "" : "s"}.
        </p>
      </div>

      <div className="overflow-hidden rounded-card bg-white">
        {products.length === 0 ? (
          <p className="p-6 text-[15px] text-muted">No live inventory yet.</p>
        ) : (
          <table className="w-full text-left text-[15px]">
            <thead className="border-b border-line text-[13px] text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Unit</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Year</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock #</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.slug}
                  className="border-b border-line-soft last:border-0"
                >
                  <td className="px-5 py-3 font-medium text-ink">{p.title}</td>
                  <td className="px-5 py-3 text-muted">{p.type}</td>
                  <td className="px-5 py-3 text-muted">{p.year}</td>
                  <td className="px-5 py-3 text-ink">{money(p.price)}</td>
                  <td className="px-5 py-3 text-muted">{p.stockNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}