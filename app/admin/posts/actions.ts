"use server";

import { redirect } from "next/navigation";
import { createPost, updatePost, deletePost, type PostInput } from "@/lib/actions/posts";

function parseForm(formData: FormData): PostInput {
  return {
    slug: String(formData.get("slug") ?? ""),
    route: formData.get("route") as PostInput["route"],
    title: String(formData.get("title") ?? ""),
    excerpt: (formData.get("excerpt") as string) || null,
    coverImage: (formData.get("coverImage") as string) || null,
    bodyMarkdown: String(formData.get("bodyMarkdown") ?? ""),
    published: formData.get("published") === "on",
  };
}

export async function createPostAction(formData: FormData) {
  await createPost(parseForm(formData));
  redirect("/admin/posts");
}

export async function updatePostAction(id: string, formData: FormData) {
  await updatePost(id, parseForm(formData));
  redirect("/admin/posts");
}

export async function deletePostAction(id: string) {
  await deletePost(id);
}
