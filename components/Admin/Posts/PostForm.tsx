"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import UploadWidget from "@/components/Admin/UploadWidget";
import type { posts } from "@/lib/db/schema";

type Post = typeof posts.$inferSelect;

interface PostFormProps {
  post?: Post;
  action: (formData: FormData) => void;
}

export default function PostForm({ post, action }: PostFormProps) {
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [bodyMarkdown, setBodyMarkdown] = useState(post?.bodyMarkdown ?? "");

  return (
    <form action={action} className="max-w-4xl space-y-5">
      <input type="hidden" name="coverImage" value={coverImage ?? ""} />

      <Field label="Slug" name="slug" defaultValue={post?.slug} required />
      <Field label="Title" name="title" defaultValue={post?.title} required />

      <div>
        <label className="mb-2 block text-sm font-medium text-ink/70">Route</label>
        <select
          name="route"
          defaultValue={post?.route ?? "general"}
          className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink"
        >
          <option value="build">Build</option>
          <option value="animate">Animate</option>
          <option value="general">General</option>
        </select>
      </div>

      <Field label="Excerpt (optional)" name="excerpt" defaultValue={post?.excerpt ?? ""} />
      <UploadWidget label="Cover image (optional)" value={coverImage} onChange={setCoverImage} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink/70">Body (Markdown)</label>
          <textarea
            name="bodyMarkdown"
            value={bodyMarkdown}
            onChange={(e) => setBodyMarkdown(e.target.value)}
            required
            rows={16}
            className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 font-mono text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent-build"
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-ink/70">Preview</p>
          <div className="prose prose-sm max-w-none rounded-xl border border-ink/15 bg-base-raised p-4">
            <ReactMarkdown>{bodyMarkdown || "*Nothing to preview yet.*"}</ReactMarkdown>
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? false} />
        Published
      </label>

      <button
        type="submit"
        className="rounded-pill bg-accent-build px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
      >
        Save
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-build"
      />
    </div>
  );
}
