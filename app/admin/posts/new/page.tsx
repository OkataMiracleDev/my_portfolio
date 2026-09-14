import PostForm from "@/components/Admin/Posts/PostForm";
import { createPostAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default function NewPostPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Posts"
        title={<>New Post</>}
        action={<BackLink href="/admin/posts">All posts</BackLink>}
      />
      <PostForm action={createPostAction} />
    </div>
  );
}
