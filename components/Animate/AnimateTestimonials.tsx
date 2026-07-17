import Image from "next/image";
import { motionTestimonialsData } from "@/data/motion-testimonials";

export default function AnimateTestimonials() {
  return (
    <section className="section px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="mb-12 text-center font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-4xl font-bold text-ink">
          What clients say
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {motionTestimonialsData.map((testimonial) => (
            <div key={testimonial.id} className="rounded-card bg-base-raised p-8">
              <p className="mb-6 text-ink/70">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-ink">{testimonial.name}</p>
                  <p className="text-sm text-ink/60">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
