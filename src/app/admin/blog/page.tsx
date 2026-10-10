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

      <div className="overflow-hidden rounded-card bg-white">
        {posts.length === 0 ? (
          <p className="p-6 text-[15px] text-muted">
            No posts yet. Write your first one.
          </p>
        ) : (
          <table className="w-full text-left text-[15px]">
            <thead className="border-b border-line text-[13px] text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Post</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Read</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.slug} className="border-b border-line-soft last:border-0">
                  <td className="px-5 py-3">
                    <span className="block font-medium text-ink">
                      {p.featured ? "★ " : ""}
                      {p.title}
                    </span>
                    <span className="text-[13px] text-muted">
                      /blog/{p.slug} · {p.author}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">{p.category}</td>
                  <td className="px-5 py-3 text-muted">{shortDate(p.date)}</td>
                  <td className="px-5 py-3 text-muted">
                    {p.readMinutes ?? readingMinutes(p.body)} min
                  </td>
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
                      <form action={deleteBlogPostAction}>
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
