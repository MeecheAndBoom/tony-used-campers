export default function AdminProductsPage() {
  return (
    <>
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          Products
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Inventory management with Cloudinary image uploads will live here. The
          catalog seeds from src/lib/catalog.ts and syncs to MongoDB when
          configured.
        </p>
      </div>

      <div className="rounded-card bg-white p-6 text-[15px] text-muted">
        This is a starter stub — CRUD (create, update, toggle featured/status,
        Cloudinary upload, specs) can be added next. The Product model is ready.
      </div>
    </>
  );
}
