import { listTestimonials } from "@/lib/actions/testimonials";
import { deleteTestimonialAction, reorderTestimonialsAction } from "./actions";
import SortableList from "@/components/Admin/ui/SortableList";
import { PageHeader, NewButton, EmptyState } from "@/components/Admin/ui/Shell";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const items = await listTestimonials();

  return (
    <div>
      <PageHeader
        eyebrow="Site content"
        title="Testimonials"
        description="Quotes shown on /build and /animate. Each one belongs to a single route."
        action={<NewButton href="/admin/testimonials/new">New testimonial</NewButton>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          description="Check Submissions for quotes clients have sent in themselves."
          action={<NewButton href="/admin/testimonials/new">New testimonial</NewButton>}
        />
      ) : (
        <SortableList
          label="testimonial"
          deleteAction={deleteTestimonialAction}
          reorderAction={reorderTestimonialsAction}
          filters={[
            { value: "all", label: "All" },
            { value: "build", label: "Build" },
            { value: "animate", label: "Animate" },
          ]}
          rows={items.map((item) => ({
            id: item.id,
            title: item.name,
            meta: item.role || item.route,
            badge: { label: item.route, tone: "neutral" as const },
            editHref: `/admin/testimonials/${item.id}`,
            filterValue: item.route,
          }))}
        />
      )}
    </div>
  );
}
