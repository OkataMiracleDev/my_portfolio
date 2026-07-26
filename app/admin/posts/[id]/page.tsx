import { notFound } from "next/navigation";
import { getPost } from "@/lib/actions/posts";
import PostForm from "@/components/Admin/Posts/PostForm";
import { updatePostAction } from "../actions";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const boundAction = updatePostAction.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        Edit {post.title}
      </h1>
      <PostForm post={post} action={boundAction} />
    </div>
  );
}
