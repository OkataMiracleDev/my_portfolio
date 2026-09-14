import { listTestimonialSubmissions } from "@/lib/actions/testimonial-submissions";
import SubmissionsList from "@/components/Admin/Testimonials/SubmissionsList";
import { PageHeader, BackLink, EmptyState } from "@/components/Admin/ui/Shell";

export const dynamic = "force-dynamic";

export default async function TestimonialSubmissionsPage() {
  const items = await listTestimonialSubmissions();

  return (
    <div>
      <PageHeader
        eyebrow="Site content"
        title="Submissions"
        description="Quotes clients sent in through the public form. Promote one to turn it into a testimonial."
        action={<BackLink href="/admin/testimonials">All testimonials</BackLink>}
      />
      {items.length === 0 ? (
        <EmptyState
          title="Nothing submitted yet"
          description="The form lives at /animate/testimonial."
        />
      ) : (
        <SubmissionsList initialItems={items} />
      )}
    </div>
  );
}
