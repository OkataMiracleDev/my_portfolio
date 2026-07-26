import { notFound } from "next/navigation";
import { getTestimonial } from "@/lib/actions/testimonials";
import TestimonialForm from "@/components/Admin/Testimonials/TestimonialForm";
import { updateTestimonialAction } from "../actions";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await getTestimonial(id);
  if (!testimonial) notFound();

  const boundAction = updateTestimonialAction.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        Edit {testimonial.name}
      </h1>
      <TestimonialForm testimonial={testimonial} action={boundAction} />
    </div>
  );
}
