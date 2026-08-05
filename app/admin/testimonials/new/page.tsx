import TestimonialForm from "@/components/Admin/Testimonials/TestimonialForm";
import { getTestimonialSubmission } from "@/lib/actions/testimonial-submissions";
import { createTestimonialAction } from "../actions";

export default async function NewTestimonialPage({
  searchParams,
}: {
  searchParams: Promise<{ fromSubmission?: string }>;
}) {
  const { fromSubmission } = await searchParams;
  const submission = fromSubmission ? await getTestimonialSubmission(fromSubmission) : null;

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        New Testimonial
      </h1>
      {submission && (
        <p className="mb-6 max-w-2xl rounded-xl border border-accent-build/30 bg-accent-build/[0.06] px-4 py-3 text-sm text-ink/70">
          Pre-filled from {submission.name}&apos;s submission — trim the quote and add an avatar before saving.
        </p>
      )}
      <TestimonialForm
        action={createTestimonialAction}
        defaultValues={
          submission
            ? { name: submission.name, quote: submission.quote ?? "", fromSubmissionId: submission.id }
            : undefined
        }
      />
    </div>
  );
}
