"use client";

import { useState } from "react";
import Link from "next/link";
import { markTestimonialSubmissionStatus } from "@/lib/actions/testimonial-submissions";
import type { testimonialSubmissions } from "@/lib/db/schema";

type Submission = typeof testimonialSubmissions.$inferSelect;

const STATUS_LABELS: Record<Submission["status"], string> = {
  new: "New",
  promoted: "Promoted",
  archived: "Archived",
};

export default function SubmissionsList({ initialItems }: { initialItems: Submission[] }) {
  const [items, setItems] = useState(initialItems);

  async function handleArchive(id: string) {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, status: "archived" } : s)));
    await markTestimonialSubmissionStatus(id, "archived");
  }

  if (items.length === 0) {
    return <p className="text-ink/50">No submissions yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {items.map((submission) => (
        <li key={submission.id} className="rounded-card border border-ink/10 bg-base-raised p-6">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-ink">
                {submission.name}
                {submission.company && <span className="text-ink/50"> — {submission.company}</span>}
              </p>
              <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-ink/40">
                {new Date(submission.createdAt).toLocaleDateString()} · {STATUS_LABELS[submission.status]}
                {!submission.consent && " · did not consent to public use"}
              </p>
            </div>
            {submission.status === "new" && (
              <div className="flex gap-2">
                <Link
                  href={`/admin/testimonials/new?fromSubmission=${submission.id}`}
                  className="rounded-pill bg-accent-build px-4 py-2 text-xs font-semibold text-ink"
                >
                  Promote
                </Link>
                <button
                  onClick={() => handleArchive(submission.id)}
                  className="rounded-pill border border-ink/15 px-4 py-2 text-xs font-medium text-ink hover:bg-ink/5"
                >
                  Archive
                </button>
              </div>
            )}
          </div>

          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            {submission.project && (
              <div>
                <dt className="text-xs uppercase tracking-[0.06em] text-ink/40">Project</dt>
                <dd className="text-ink/80">{submission.project}</dd>
              </div>
            )}
            {submission.quote && (
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-[0.06em] text-ink/40">One-line summary</dt>
                <dd className="text-ink/80">&ldquo;{submission.quote}&rdquo;</dd>
              </div>
            )}
            {submission.problem && (
              <div>
                <dt className="text-xs uppercase tracking-[0.06em] text-ink/40">Problem going in</dt>
                <dd className="text-ink/70">{submission.problem}</dd>
              </div>
            )}
            {submission.process && (
              <div>
                <dt className="text-xs uppercase tracking-[0.06em] text-ink/40">Working together</dt>
                <dd className="text-ink/70">{submission.process}</dd>
              </div>
            )}
            {submission.result && (
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-[0.06em] text-ink/40">What changed</dt>
                <dd className="text-ink/70">{submission.result}</dd>
              </div>
            )}
          </dl>
        </li>
      ))}
    </ul>
  );
}
