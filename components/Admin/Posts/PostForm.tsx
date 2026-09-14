"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import UploadWidget from "@/components/Admin/UploadWidget";
import type { posts } from "@/lib/db/schema";
import SubmitButton from "@/components/Admin/SubmitButton";
import { Field, FormShell, Select, Checkbox } from "@/components/Admin/ui/Fields";

type Post = typeof posts.$inferSelect;

interface PostFormProps {
  post?: Post;
  action: (formData: FormData) => void;
}

export default function PostForm({ post, action }: PostFormProps) {
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [bodyMarkdown, setBodyMarkdown] = useState(post?.bodyMarkdown ?? "");

  return (
    <FormShell action={action}>
      <input type="hidden" name="coverImage" value={coverImage ?? ""} />

      <Field
        label="Slug"
        name="slug"
        defaultValue={post?.slug}
        required
        pattern="[a-z0-9-]+"
        patternTitle="Lowercase letters, numbers, and hyphens only"
      />
      <Field label="Title" name="title" defaultValue={post?.title} required />

      <Select
        label="Route"
        name="route"
        defaultValue={post?.route ?? "general"}
        options={[
          { value: "build", label: "Build" },
          { value: "animate", label: "Animate" },
          { value: "general", label: "General" },
        ]}
        hint="Which blog index this shows up in. General appears on /build/blog too."
      />

      <Field label="Excerpt (optional)" name="excerpt" defaultValue={post?.excerpt ?? ""} />
      <UploadWidget label="Cover image (optional)" value={coverImage} onChange={setCoverImage} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45">Body (Markdown)</label>
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
          <p className="mb-2 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45">Preview</p>
          <div className="prose prose-sm max-w-none rounded-xl border border-ink/15 bg-frame p-4">
            <ReactMarkdown>{bodyMarkdown || "*Nothing to preview yet.*"}</ReactMarkdown>
          </div>
        </div>
      </div>

      <Checkbox
        label="Published"
        name="published"
        defaultChecked={post?.published ?? false}
        hint="Drafts stay invisible to the public site."
      />

      <SubmitButton accent="build" />
    </FormShell>
  );
}
