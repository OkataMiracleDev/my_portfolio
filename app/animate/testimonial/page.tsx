import type { Metadata } from "next";
import TestimonialForm from "@/components/Animate/TestimonialForm";

export const metadata: Metadata = {
  title: "Share a testimonial | Mimi Studios",
  description: "Worked with Mimi Studios? Share a quick testimonial about the project.",
};

export default function TestimonialSubmitPage() {
  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <div className="mx-auto max-w-2xl">
        <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-ink/50">
          Client feedback — 3 min
        </p>
        <h1 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold leading-[0.95] text-ink md:text-5xl">
          Quick thoughts on working together?
        </h1>
        <p className="mb-12 max-w-lg text-lg text-ink/70">
          This helps future clients know what to expect, and helps me too. Answer whatever&apos;s
          relevant, skip the rest.
        </p>

        <TestimonialForm />
      </div>
    </div>
  );
}
