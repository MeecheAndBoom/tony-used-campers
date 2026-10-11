import Link from "next/link";
import { listAdminBlogPosts, readingMinutes } from "@/lib/blog";
import { shortDate } from "@/lib/format";
import { deleteBlogPostAction } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminBlogPage() {
  const posts = await listAdminBlogPosts();
  const live = posts.filter((p) => p.status === "live").length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
            Blog
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            {posts.length} post{posts.length === 1 ? "" : "s"} — {live} live,{" "}
            {posts.length - live} draft. Published posts appear on{" "}
            <Link href="/blog" className="text-accent hover:underline">
              /blog
            </Link>{" "}
            immediately.
          </p>
        </div>
        <Link href="/admin/blog/new" className="btn btn-primary">
          New post
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {posts.length === 0 ? (
          <div className="rounded-card border border-line-soft bg-white p-6 text-[15px] text-muted sm:col-span-2 xl:col-span-3">
            No posts yet. Write your first one.
          </div>
        ) : (
          posts.map((p) => (
            <article
              key={p.slug}
              className="flex flex-col rounded-card border border-line-soft bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[15px] font-medium leading-snug text-ink">
                  {p.featured ? "★ " : ""}
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
                /blog/{p.slug} · {p.author}
              </p>

              <dl className="mt-4 space-y-1.5 border-t border-line-soft pt-3 text-[13px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Category</dt>
                  <dd className="m-0 text-ink">{p.category}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Date</dt>
                  <dd className="m-0 text-ink">{shortDate(p.date)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Read</dt>
                  <dd className="m-0 text-ink">
                    {p.readMinutes ?? readingMinutes(p.body)} min
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line-soft pt-3">
                {p.status === "live" ? (
                  <a
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[14px] text-muted hover:underline"
                  >
                    View
                  </a>
                ) : null}
                <a
                  href={`/admin/blog/${p.slug}`}
                  className="text-[14px] text-accent hover:underline"
                >
                  Edit
                </a>
                <form action={deleteBlogPostAction} className="ml-auto">
                  <input type="hidden" name="slug" value={p.slug} />
                  <DeleteButton
                    label="Delete"
                    message={`Delete "${p.title}"? This can't be undone.`}
                  />
                </form>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}
