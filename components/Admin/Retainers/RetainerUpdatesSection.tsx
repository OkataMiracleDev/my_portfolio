"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import BulkUploadWidget from "@/components/Admin/BulkUploadWidget";
import ConfirmButton from "@/components/Admin/ui/ConfirmButton";
import { Meta } from "@/components/Shared/brand/Hud";
import { PhaseBadge } from "@/components/Shared/PhaseTrack";
import { RETAINER_PHASES, RETAINER_PHASE_LABELS } from "@/lib/constants/retainer-phases";
import {
  createRetainerUpdateAction,
  deleteRetainerUpdateAction,
} from "@/app/admin/retainers/actions";
import type { retainerUpdates } from "@/lib/db/schema";

type Update = typeof retainerUpdates.$inferSelect;

const CONTROL =
  "w-full rounded-xl border border-ink/12 bg-stage px-4 py-2.5 text-ink placeholder:text-ink/25 transition-colors duration-200 ease-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent-animate";
const LABEL =
  "mb-2 block font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45";

/**
 * Compose a progress update, and the feed of what has already been posted.
 *
 * The phase selector defaults to whatever phase the project is currently on,
 * because the overwhelmingly common case is posting about the work in front of
 * you. Picking a later phase here moves the project forward as a side effect
 * (see createRetainerUpdate) so the header and the timeline cannot disagree.
 */
export default function RetainerUpdatesSection({
  projectId,
  currentPhase,
  initialItems,
}: {
  projectId: string;
  currentPhase: string;
  initialItems: Update[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  // A ref, not the `pending` state: state updates are not synchronous, so two
  // clicks landing in the same tick both see pending === false and both fire.
  const submittingRef = useRef(false);
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState(false);

  // router.refresh() re-runs the server component and sends a fresh list;
  // adopt it rather than keeping the optimistically prepended copy, which
  // would otherwise show the new update twice.
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    const formData = new FormData(event.currentTarget);
    setPending(true);
    try {
      const created = await createRetainerUpdateAction(formData);
      if (created) setItems((current) => [created, ...current]);
      formRef.current?.reset();
      setImages([]);
      toast.success("Update posted");
      // The project's phase may have advanced as a side effect, so the header
      // above this section needs to re-render too.
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Could not post that update.");
    } finally {
      submittingRef.current = false;
      setPending(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-ink/10 bg-frame p-6"
      >
        <input type="hidden" name="retainerProjectId" value={projectId} />
        {images.map((url, i) => (
          <input key={`${url}-${i}`} type="hidden" name="images" value={url} />
        ))}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
          <div>
            <label htmlFor="update-title" className={LABEL}>
              Update title
            </label>
            <input
              id="update-title"
              name="title"
              required
              placeholder="e.g. Storyboards ready for review"
              className={CONTROL}
            />
          </div>

          <div>
            <label htmlFor="update-phase" className={LABEL}>
              Phase
            </label>
            <select id="update-phase" name="phase" defaultValue={currentPhase} className={CONTROL}>
              {RETAINER_PHASES.map((phase) => (
                <option key={phase} value={phase}>
                  {RETAINER_PHASE_LABELS[phase]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="update-body" className={LABEL}>
            Details
          </label>
          <textarea id="update-body" name="body" rows={3} className={`${CONTROL} resize-y`} />
        </div>

        <div>
          <label htmlFor="update-video" className={LABEL}>
            YouTube embed URL
          </label>
          <input
            id="update-video"
            name="videoEmbedUrl"
            type="url"
            placeholder="https://www.youtube.com/embed/..."
            className={CONTROL}
          />
          <p className="mt-2 text-xs leading-relaxed text-ink/35">
            Use the <span className="text-ink/55">/embed/</span> form of the URL. Unlisted videos
            work and are the right choice for work in progress.
          </p>
        </div>

        <BulkUploadWidget
          label="Images"
          values={images}
          onChange={setImages}
          onUploadingChange={setUploading}
        />

        <button
          type="submit"
          disabled={pending || uploading}
          className={`rounded-pill bg-accent-animate px-6 py-2.5 font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97] ${
            pending || uploading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {uploading ? "Uploading…" : pending ? "Posting…" : "Post update"}
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-ink/40">
          Nothing posted yet. The client sees an empty timeline until you do.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((update) => (
            <li key={update.id} className="rounded-2xl border border-ink/10 bg-frame p-5">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2.5">
                    <PhaseBadge phase={update.phase} />
                    <Meta className="text-ink/30">
                      {new Date(update.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Meta>
                  </div>
                  <p className="font-medium text-ink">{update.title}</p>
                </div>

                <ConfirmButton
                  onConfirm={async () => {
                    try {
                      await deleteRetainerUpdateAction(update.id, projectId);
                      setItems((current) => current.filter((item) => item.id !== update.id));
                      toast.success("Update deleted");
                    } catch (error) {
                      console.error(error);
                      toast.error("Could not delete that update.");
                    }
                  }}
                  confirmLabel="Delete"
                  pendingLabel="Deleting"
                >
                  Delete
                </ConfirmButton>
              </div>

              {update.body && <p className="text-sm leading-relaxed text-ink/60">{update.body}</p>}

              {update.videoEmbedUrl && (
                <Meta className="mt-3 block text-accent-animate">+ video attached</Meta>
              )}

              {update.images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {update.images.map((url, i) => (
                    <div
                      key={`${url}-${i}`}
                      className="relative h-16 w-16 overflow-hidden rounded-lg bg-stage"
                    >
                      <Image src={url} alt="" fill sizes="64px" quality={75} className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
