import Link from "next/link";
import { BlogForm } from "@/components/admin/BlogForm";
import { createBlogPostAction } from "@/lib/actions/admin";

export default function NewBlogPostPage() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
            New post
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Write it once — the excerpt becomes the meta description, the tags
            become the page keywords. Leave slug blank to auto-generate.
          </p>
        </div>
        <Link href="/admin/blog" className="text-[14px] text-accent hover:underline">
          ← Back to blog
        </Link>
      </div>
      <BlogForm action={createBlogPostAction} />
    </>
  );
}
