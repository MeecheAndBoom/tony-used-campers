import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { listAdminProducts } from "@/lib/products";
import { updateProductAction } from "@/lib/actions/admin";

type Props = { params: Promise<{ slug: string }> };

export default async function EditProductPage({ params }: Props) {
  const { slug } = await params;
  const products = await listAdminProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
            Edit product
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            {product.title} — change anything and save; the shop updates
            immediately.
          </p>
        </div>
        <a href="/admin/products" className="text-[14px] text-accent hover:underline">
          ← Back to products
        </a>
      </div>
      <ProductForm product={product} action={updateProductAction} />
    </>
  );
}