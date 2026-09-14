import { notFound } from "next/navigation";
import { getPost } from "@/lib/actions/posts";
import PostForm from "@/components/Admin/Posts/PostForm";
import { updatePostAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const boundAction = updatePostAction.bind(null, id);

  return (
    <div>
      <PageHeader
        eyebrow="Posts"
        title={<>Edit {post.title}</>}
        action={<BackLink href="/admin/posts">All posts</BackLink>}
      />
      <PostForm post={post} action={boundAction} />
    </div>
  );
}
