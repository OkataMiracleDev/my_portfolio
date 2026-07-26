import Link from "next/link";
import { listTestimonials } from "@/lib/actions/testimonials";
import TestimonialsList from "@/components/Admin/Testimonials/TestimonialsList";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const items = await listTestimonials();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
          Testimonials
        </h1>
        <Link
          href="/admin/testimonials/new"
          className="rounded-pill bg-accent-build px-5 py-2.5 text-sm font-semibold text-ink"
        >
          + New
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-ink/50">No testimonials yet.</p>
      ) : (
        <TestimonialsList initialItems={items} />
      )}
    </div>
  );
}
