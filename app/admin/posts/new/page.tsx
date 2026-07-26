import PostForm from "@/components/Admin/Posts/PostForm";
import { createPostAction } from "../actions";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        New Post
      </h1>
      <PostForm action={createPostAction} />
    </div>
  );
}
