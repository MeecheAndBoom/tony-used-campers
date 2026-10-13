import { getCategories } from "@/lib/categories";
import { deleteCategoryAction, createCategoryAction, updateCategoryAction } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Props = {
  searchParams: Promise<{ saved?: string }>;
};

const FIELD =
  "w-full rounded-box border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-light focus:border-accent focus:ring-2 focus:ring-sky";
const LABEL = "field-label block";

export default async function AdminCategoriesPage({ searchParams }: Props) {
  const { saved } = await searchParams;
  const categories = await getCategories();

  return (
    <>
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          Categories
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Shop-by-category tiles on the homepage. Add, rename or delete a
          category and swap its image — changes go live immediately.
        </p>
      </div>

      {saved === "1" && (
        <div className="rounded-box bg-success/10 px-4 py-3 text-[14px] text-success">
          Category saved and live on the site.
        </div>
      )}

      <section className="rounded-card bg-white p-6">
        <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
          Add a category
        </h2>
        <form action={createCategoryAction} className="mt-5 space-y-5">
          <div className="max-w-md">
            <label htmlFor="name" className={LABEL}>
              Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="e.g. Truck Camper"
              className={FIELD}
              required
            />
          </div>
          <ImageUploader
            name="image"
            label="Category image"
            folder="tuc/uploads/categories"
            hint="Square images look best — shown on the homepage tiles."
          />
          <div>
            <button type="submit" className="btn btn-primary btn-sm">
              Add category
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-card bg-white p-6">
        <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
          Current categories ({categories.length})
        </h2>
        <ul className="mt-5 space-y-5">
          {categories.map((category) => (
            <li key={category.id} className="rounded-box border border-line-soft p-4">
              <div className="flex flex-col gap-4">
                <form action={updateCategoryAction} className="grid gap-4 sm:grid-cols-2">
                  <input type="hidden" name="id" value={category.id} />
                  <div>
                    <label htmlFor={`name-${category.id}`} className={LABEL}>
                      Name
                    </label>
                    <input
                      id={`name-${category.id}`}
                      name="name"
                      defaultValue={category.name}
                      className={FIELD}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <ImageUploader
                      name="image"
                      defaultValue={category.image ? [category.image] : []}
                      label="Category image"
                      folder="tuc/uploads/categories"
                      hint="Square images look best — shown on the homepage tiles."
                    />
                  </div>
                  <div className="flex items-end sm:col-span-2">
                    <button type="submit" className="btn btn-secondary btn-sm">
                      Save changes
                    </button>
                  </div>
                </form>

                <form
                  action={deleteCategoryAction}
                  className="flex justify-end border-t border-line-soft pt-3"
                >
                  <input type="hidden" name="id" value={category.id} />
                  <DeleteButton
                    label="Delete category"
                    message={`Delete the ${category.name} category?`}
                  />
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}