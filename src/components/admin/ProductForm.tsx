import { PRODUCT_TYPES } from "@/lib/constants";
import type { Product as ProductRecord } from "@/lib/types";
import { ImageUploader } from "@/components/admin/ImageUploader";

const FIELD =
  "w-full rounded-box border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-light focus:border-accent focus:ring-2 focus:ring-sky";
const LABEL = "field-label block";
const SECTION =
  "grid gap-5 rounded-card bg-white p-6 sm:grid-cols-2";

function Input({
  name,
  label,
  defaultValue,
  type = "text",
  placeholder,
  step,
  cols,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  type?: string;
  placeholder?: string;
  step?: string;
  cols?: number;
}) {
  return (
    <div className={cols === 1 ? "sm:col-span-1" : cols === 2 ? "sm:col-span-2" : ""}>
      <label htmlFor={name} className={LABEL}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={FIELD}
      />
    </div>
  );
}

function TextArea({
  name,
  label,
  defaultValue,
  rows = 4,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <div className="sm:col-span-2">
      <label htmlFor={name} className={LABEL}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className={FIELD}
      />
      {hint ? <p className="mt-1.5 text-[12px] text-muted">{hint}</p> : null}
    </div>
  );
}

export function ProductForm({
  product,
  action,
}: {
  /** When provided the form edits; otherwise it creates. */
  product?: ProductRecord;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const spec = product?.specs ?? { length: "", sleeps: "", weight: "", axles: "", slides: "" };
  return (
    <form action={action} className="space-y-6">
      <div className={SECTION}>
        <h2 className="col-span-full text-[18px] font-semibold tracking-[-0.01em]">
          Basics
        </h2>
        <Input
          name="slug"
          label="Slug (URL)"
          defaultValue={product?.slug}
          placeholder="2022-jayco-jay-flight"
        />
        <Input
          name="stockNumber"
          label="Stock number"
          defaultValue={product?.stockNumber}
          placeholder="TUC-22-JF245"
        />
        <Input
          name="title"
          label="Title"
          defaultValue={product?.title}
          placeholder="Jayco Jay Flight SLX 245"
          cols={2}
        />
        <Input name="brand" label="Brand" defaultValue={product?.brand} placeholder="Jayco" />
        <Input name="model" label="Model" defaultValue={product?.model} placeholder="Jay Flight SLX 245BHS" />
        <Input name="year" label="Year" type="number" defaultValue={product?.year} placeholder="2022" />
        <div>
          <label htmlFor="condition" className={LABEL}>
            Condition
          </label>
          <select id="condition" name="condition" defaultValue={product?.condition ?? "used"} className={FIELD}>
            <option value="used">Used</option>
            <option value="new">New</option>
          </select>
        </div>
        <div>
          <label htmlFor="type" className={LABEL}>
            Type
          </label>
          <select id="type" name="type" defaultValue={product?.type ?? "Travel Trailer"} className={FIELD}>
            {PRODUCT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className={LABEL}>
            Status
          </label>
          <select id="status" name="status" defaultValue={product?.status ?? "live"} className={FIELD}>
            <option value="live">Live</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="flex items-center gap-3 self-end pb-2">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={product?.featured ?? false}
            className="h-4 w-4 accent-[#0071e3]"
          />
          <label htmlFor="featured" className="text-[15px] text-ink">
            Featured on homepage
          </label>
        </div>
      </div>

      <div className={SECTION}>
        <h2 className="col-span-full text-[18px] font-semibold tracking-[-0.01em]">
          Pricing
        </h2>
        <Input name="price" label="Price (whole dollars)" type="number" step="1" defaultValue={product?.price} />
        <Input name="listPrice" label="List price (optional)" type="number" step="1" defaultValue={product?.listPrice} />
        <Input name="monthlyFrom" label="Monthly from (optional)" type="number" step="1" defaultValue={product?.monthlyFrom} />
      </div>

      <div className={SECTION}>
        <h2 className="col-span-full text-[18px] font-semibold tracking-[-0.01em]">
          Specs
        </h2>
        <Input name="specsLength" label="Length" defaultValue={spec.length} placeholder={'28\' 4"'} />
        <Input name="specsSleeps" label="Sleeps" defaultValue={spec.sleeps} placeholder="6" />
        <Input name="specsWeight" label="Weight" defaultValue={spec.weight} placeholder="5,290 lb" />
        <Input name="specsAxles" label="Axles" defaultValue={spec.axles} placeholder="2" />
        <Input name="specsSlides" label="Slides" defaultValue={spec.slides} placeholder="0" />
      </div>

      <div className={SECTION}>
        <h2 className="col-span-full text-[18px] font-semibold tracking-[-0.01em]">
          Description & features
        </h2>
        <TextArea name="description" label="Description" defaultValue={product?.description} rows={5} />
        <TextArea
          name="features"
          label="Features (one per line)"
          defaultValue={product?.features.join("\n")}
          rows={6}
          hint="Each line becomes a bullet on the listing."
        />
      </div>

      <div className={SECTION}>
        <h2 className="col-span-full text-[18px] font-semibold tracking-[-0.01em]">
          Images
        </h2>
        <div className="sm:col-span-2">
          <ImageUploader
            name="images"
            multiple
            defaultValue={product?.images}
            label="Product photos"
            folder="tuc/uploads/products"
            hint="Upload photos or paste image URLs. The first image is the cover shown on cards and search results."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <a href="/admin/products" className="btn btn-ghost">
          Cancel
        </a>
        <button type="submit" className="btn btn-primary">
          {product ? "Save changes" : "Add product"}
        </button>
      </div>
    </form>
  );
}