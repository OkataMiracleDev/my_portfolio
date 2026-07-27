"use client";

import { useState } from "react";
import UploadWidget from "@/components/Admin/UploadWidget";
import BulkUploadWidget from "@/components/Admin/BulkUploadWidget";
import ProcessStepsEditor, { type ProcessStep } from "@/components/Admin/MotionProjects/ProcessStepsEditor";
import type { motionProjects } from "@/lib/db/schema";

type MotionProject = typeof motionProjects.$inferSelect;

interface MotionProjectFormProps {
  project?: MotionProject;
  action: (formData: FormData) => void;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export default function MotionProjectForm({ project, action }: MotionProjectFormProps) {
  const [thumbnail, setThumbnail] = useState(project?.thumbnail ?? "");
  const [thumbnailTouched, setThumbnailTouched] = useState(Boolean(project?.thumbnail));
  const [storyboardImages, setStoryboardImages] = useState<string[]>(project?.storyboardImages ?? []);
  const [videoEmbedUrl, setVideoEmbedUrl] = useState(project?.videoEmbedUrl ?? "");
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(
    project?.processSteps && project.processSteps.length > 0 ? project.processSteps : [{ title: "", body: "" }]
  );
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [storyboardUploading, setStoryboardUploading] = useState(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [processStepsError, setProcessStepsError] = useState<string | null>(null);

  const anyUploading = thumbnailUploading || storyboardUploading;
  const youTubeId = extractYouTubeId(videoEmbedUrl);

  function handleThumbnailChange(url: string) {
    setThumbnail(url);
    setThumbnailTouched(true);
    setThumbnailError(null);
  }

  function handleStoryboardChange(urls: string[]) {
    setStoryboardImages(urls);
    // Auto-fill the thumbnail from the first storyboard shot, but only if
    // the admin hasn't deliberately set one already.
    if (!thumbnailTouched && urls.length > 0) {
      setThumbnail(urls[0]);
    }
  }

  function useYouTubeThumbnail() {
    if (!youTubeId) return;
    handleThumbnailChange(`https://img.youtube.com/vi/${youTubeId}/maxresdefault.jpg`);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    let blocked = false;

    if (!thumbnail) {
      blocked = true;
      setThumbnailError("Add a thumbnail (or a storyboard image) before saving.");
    }

    const hasValidStep = processSteps.some((step) => step.title.trim() && step.body.trim());
    if (!hasValidStep) {
      blocked = true;
      setProcessStepsError("Add at least one process step with a title and body.");
    } else {
      setProcessStepsError(null);
    }

    if (blocked) e.preventDefault();
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <input type="hidden" name="thumbnail" value={thumbnail} />
      {storyboardImages.map((url, i) => (
        <input key={`${url}-${i}`} type="hidden" name="storyboardImages" value={url} />
      ))}
      {processSteps.map((step, i) => (
        <input key={`step-title-${i}`} type="hidden" name="processStepTitle" value={step.title} />
      ))}
      {processSteps.map((step, i) => (
        <input key={`step-body-${i}`} type="hidden" name="processStepBody" value={step.body} />
      ))}

      <Field label="Slug" name="slug" defaultValue={project?.slug} required />
      <Field label="Title" name="title" defaultValue={project?.title} required />
      <TextArea label="Description" name="description" defaultValue={project?.description} required />

      <div>
        <UploadWidget
          label="Thumbnail"
          value={thumbnail}
          onChange={handleThumbnailChange}
          onUploadingChange={setThumbnailUploading}
        />
        {youTubeId && (
          <button
            type="button"
            onClick={useYouTubeThumbnail}
            className="mt-2 rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
          >
            Use YouTube thumbnail
          </button>
        )}
        {thumbnailError && <p className="mt-2 text-sm text-red-600">{thumbnailError}</p>}
      </div>

      <Field label="Tags (comma-separated)" name="tags" defaultValue={project?.tags.join(", ")} required />
      <Field
        label="Video embed URL (optional — leave blank for 'coming soon')"
        name="videoEmbedUrl"
        defaultValue={project?.videoEmbedUrl ?? ""}
        onChange={setVideoEmbedUrl}
      />
      <div>
        <ProcessStepsEditor steps={processSteps} onChange={setProcessSteps} />
        {processStepsError && <p className="mt-2 text-sm text-red-600">{processStepsError}</p>}
      </div>
      <Field label="Tools (comma-separated)" name="tools" defaultValue={project?.tools.join(", ")} required />

      <BulkUploadWidget
        label="Storyboard images"
        values={storyboardImages}
        onChange={handleStoryboardChange}
        onUploadingChange={setStoryboardUploading}
      />

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          name="featuredOnHome"
          defaultChecked={project?.featuredOnHome ?? false}
        />
        Featured on /animate home
      </label>

      <button
        type="submit"
        disabled={anyUploading}
        className={`rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97] ${
          anyUploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {anyUploading ? "Uploading…" : "Save"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  onChange,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
      />
    </div>
  );
}

function TextArea({
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
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        rows={5}
        className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
      />
    </div>
  );
}
