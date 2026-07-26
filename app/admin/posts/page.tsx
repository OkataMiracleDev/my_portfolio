import Link from "next/link";
import { listPosts } from "@/lib/actions/posts";
import PostsList from "@/components/Admin/Posts/PostsList";

export const dynamic = "force-dynamic";

export default async function PostsAdminPage() {
  const items = await listPosts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
          Posts
        </h1>
        <Link
          href="/admin/posts/new"
          className="rounded-pill bg-accent-build px-5 py-2.5 text-sm font-semibold text-ink"
        >
          + New
        </Link>
      </div>
      {items.length === 0 ? <p className="text-ink/50">No posts yet.</p> : <PostsList initialItems={items} />}
    </div>
  );
}
