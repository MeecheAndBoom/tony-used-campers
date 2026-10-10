import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogForm } from "@/components/admin/BlogForm";
import { listAdminBlogPosts } from "@/lib/blog";
import { updateBlogPostAction } from "@/lib/actions/admin";

type Props = { params: Promise<{ slug: string }> };

export default async function EditBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const posts = await listAdminBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
            Edit post
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            {post.title} — change anything and save; the blog updates
            immediately.
          </p>
        </div>
        <Link href="/admin/blog" className="text-[14px] text-accent hover:underline">
          ← Back to blog
        </Link>
      </div>
      <BlogForm post={post} action={updateBlogPostAction} />
    </>
  );
}
