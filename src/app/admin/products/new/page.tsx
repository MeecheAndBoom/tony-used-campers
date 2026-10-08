import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "@/lib/actions/admin";

export default function NewProductPage() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
            New product
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Add a camper to the lot. Leave slug blank to auto-generate it.
          </p>
        </div>
        <a href="/admin/products" className="text-[14px] text-accent hover:underline">
          ← Back to products
        </a>
      </div>
      <ProductForm action={createProductAction} />
    </>
  );
}