import TestimonialForm from "@/components/Admin/Testimonials/TestimonialForm";
import { createTestimonialAction } from "../actions";

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold">
        New Testimonial
      </h1>
      <TestimonialForm action={createTestimonialAction} />
    </div>
  );
}
