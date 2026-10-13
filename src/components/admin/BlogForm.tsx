import Link from "next/link";
import { BLOG_CATEGORIES } from "@/lib/blog";
import type { BlogPost as BlogPostRecord } from "@/lib/types";
import { ImageUploader } from "@/components/admin/ImageUploader";

const FIELD =
  "w-full rounded-box border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-light focus:border-accent focus:ring-2 focus:ring-sky";
const LABEL = "field-label block";
const SECTION = "grid gap-5 rounded-card bg-white p-6 sm:grid-cols-2";

function Input({
  name,
  label,
  defaultValue,
  type = "text",
  placeholder,
  cols,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  type?: string;
  placeholder?: string;
  cols?: number;
}) {
  return (
    <div className={cols === 2 ? "sm:col-span-2" : ""}>
      <label htmlFor={name} className={LABEL}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
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
        className={name === "body" ? `${FIELD} font-mono text-[14px] leading-relaxed` : FIELD}
      />
      {hint ? <p className="mt-1.5 text-[12px] text-muted">{hint}</p> : null}
    </div>
  );
}

export function BlogForm({
  post,
  action,
}: {
  /** When provided the form edits; otherwise it creates. */
  post?: BlogPostRecord;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="space-y-6">
      <div className={SECTION}>
        <h2 className="col-span-full text-[18px] font-semibold tracking-[-0.01em]">
          Post
        </h2>
        <Input
          name="slug"
          label="Slug (URL)"
          defaultValue={post?.slug}
          placeholder="used-rv-inspection-checklist"
        />
        <Input name="date" label="Publish date" type="date" defaultValue={post?.date} />
        <Input
          name="title"
          label="Title"
          defaultValue={post?.title}
          placeholder="The Used RV Inspection Checklist We Run on Every Unit"
          cols={2}
        />
        <div>
          <label htmlFor="category" className={LABEL}>
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={post?.category ?? BLOG_CATEGORIES[0]}
            className={FIELD}
          >
            {BLOG_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <Input
          name="author"
          label="Author"
          defaultValue={post?.author}
          placeholder="Tony Marchetti"
        />
        <div>
          <label htmlFor="status" className={LABEL}>
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={post?.status ?? "live"}
            className={FIELD}
          >
            <option value="live">Live</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="flex items-center gap-3 self-end pb-2">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={post?.featured ?? false}
            className="h-4 w-4 accent-[#0071e3]"
          />
          <label htmlFor="featured" className="text-[15px] text-ink">
            Feature at the top of the blog
          </label>
        </div>
      </div>

      <div className={SECTION}>
        <h2 className="col-span-full text-[18px] font-semibold tracking-[-0.01em]">
          Summary & search
        </h2>
        <TextArea
          name="excerpt"
          label="Excerpt (meta description + card summary)"
          defaultValue={post?.excerpt}
          rows={3}
          hint="Aim for 140–160 characters — this is what Google and the card show."
        />
        <Input
          name="readMinutes"
          label="Read minutes (blank = auto)"
          type="number"
          defaultValue={post?.readMinutes}
        />
        <TextArea
          name="tags"
          label="Tags / keywords (one per line)"
          defaultValue={post?.tags.join("\n")}
          rows={4}
          hint="Long-tail phrases people actually search, e.g. “winterize an RV”."
        />
      </div>

      <div className={SECTION}>
        <h2 className="col-span-full text-[18px] font-semibold tracking-[-0.01em]">
          Body
        </h2>
        <TextArea
          name="body"
          label="Body (lightweight Markdown)"
          defaultValue={post?.body}
          rows={22}
          hint="Blank line between paragraphs. ## Heading, ### Subheading, - bullet, 1. numbered, > quote, **bold**, [text](/link)."
        />
      </div>

      <div className={SECTION}>
        <h2 className="col-span-full text-[18px] font-semibold tracking-[-0.01em]">
          Hero image
        </h2>
        <div className="sm:col-span-2">
          <ImageUploader
            name="image"
            defaultValue={post?.image ? [post.image] : []}
            label="Hero image"
            folder="tuc/uploads/blog"
            hint="Shown at the top of the post and on the blog card."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/blog" className="btn btn-ghost">
          Cancel
        </Link>
        <button type="submit" className="btn btn-primary">
          {post ? "Save changes" : "Publish post"}
        </button>
      </div>
    </form>
  );
}
