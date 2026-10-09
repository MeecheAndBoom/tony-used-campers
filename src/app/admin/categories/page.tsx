import Image from "next/image";
import { getCategories } from "@/lib/categories";
import { deleteCategoryAction, createCategoryAction, updateCategoryAction } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/DeleteButton";

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
        <form action={createCategoryAction} className="mt-5 grid gap-5 sm:grid-cols-[1fr_1fr_auto]">
          <div>
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
          <div>
            <label htmlFor="image" className={LABEL}>
              Image path
            </label>
            <input
              id="image"
              name="image"
              placeholder="/images/carav-cat/Truck Camper.png"
              className={FIELD}
            />
          </div>
          <div className="sm:self-end">
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
            <li
              key={category.id}
              className="rounded-box border border-line-soft p-4 md:grid md:grid-cols-[96px_1fr] md:gap-5"
            >
              <div>
                <p className="mb-1.5 text-[12px] font-medium text-muted">
                  Preview
                </p>
                <div className="relative aspect-square w-24 overflow-hidden border border-line bg-alt">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <form
                  action={updateCategoryAction}
                  className="grid gap-4 sm:grid-cols-[1fr_1.4fr_auto]"
                >
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
                  <div>
                    <label htmlFor={`image-${category.id}`} className={LABEL}>
                      Image path
                    </label>
                    <input
                      id={`image-${category.id}`}
                      name="image"
                      defaultValue={category.image}
                      className={FIELD}
                    />
                  </div>
                  <div className="flex items-end">
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