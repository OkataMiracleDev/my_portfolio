import { notFound } from "next/navigation";
import { getTestimonial } from "@/lib/actions/testimonials";
import TestimonialForm from "@/components/Admin/Testimonials/TestimonialForm";
import { updateTestimonialAction } from "../actions";
import { PageHeader, BackLink } from "@/components/Admin/ui/Shell";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await getTestimonial(id);
  if (!testimonial) notFound();

  const boundAction = updateTestimonialAction.bind(null, id);

  return (
    <div>
      <PageHeader
        eyebrow="Testimonials"
        title={<>Edit {testimonial.name}</>}
        action={<BackLink href="/admin/testimonials">All testimonials</BackLink>}
      />
      <TestimonialForm testimonial={testimonial} action={boundAction} />
    </div>
  );
}
