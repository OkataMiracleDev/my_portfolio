import Link from "next/link";
import { listTestimonialSubmissions } from "@/lib/actions/testimonial-submissions";
import SubmissionsList from "@/components/Admin/Testimonials/SubmissionsList";

export const dynamic = "force-dynamic";

export default async function TestimonialSubmissionsPage() {
  const items = await listTestimonialSubmissions();

  return (
    <div>
      <Link href="/admin/testimonials" className="mb-4 inline-block text-sm text-ink/50 hover:text-ink">
        ← Testimonials
      </Link>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        Testimonial Submissions
      </h1>
      <SubmissionsList initialItems={items} />
    </div>
  );
}
