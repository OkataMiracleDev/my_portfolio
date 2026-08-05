"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function TestimonialForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null)?.value.trim() ?? "";
    const name = get("name");

    if (!name) {
      toast.error("Your name is required.");
      return;
    }

    const payload = {
      name,
      company: get("company"),
      project: get("project"),
      problem: get("problem"),
      process: get("process"),
      result: get("result"),
      quote: get("quote"),
      consent: (form.elements.namedItem("consent") as HTMLInputElement | null)?.checked ?? false,
    };

    try {
      setLoading(true);
      const res = await fetch("/api/testimonial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Thanks — testimonial sent!");
        form.reset();
      } else {
        const data = await res.json();
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Your name" name="name" required />
        <Field label="Company / role" name="company" />
      </div>

      <Field label="What did we work on?" hint="Project name and what it was for." name="project" />

      <TextArea label="What was the problem going in?" hint="What did you need, and why?" name="problem" />

      <TextArea
        label="What was it actually like working together?"
        hint="Communication, turnaround, how it felt to collaborate — be honest, this is the useful part."
        name="process"
      />

      <TextArea label="What changed because of the final work?" hint="A result, a reaction, a number — whatever's true." name="result" />

      <TextArea
        label="If you had to sum it up in one line?"
        hint="Optional — this is often the line that gets pulled out and featured."
        name="quote"
        rows={3}
      />

      <label className="flex items-start gap-3 rounded-xl border border-ink/15 bg-base-raised p-4">
        <input type="checkbox" name="consent" defaultChecked className="mt-1" />
        <span className="text-sm text-ink/60">
          It&apos;s okay to use my name, company, and these quotes publicly on the Mimi Studios site and social pages.
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-pill bg-accent-animate py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97] ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5"
        }`}
      >
        {loading ? "Sending…" : "Send it over →"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  hint,
  required,
}: {
  label: string;
  name: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>
      {hint && <p className="mb-2 text-xs text-ink/50">{hint}</p>}
      <input
        id={name}
        name={name}
        required={required}
        className="w-full rounded-xl border border-ink/15 bg-base-raised px-4 py-3 text-ink transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent-animate"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  hint,
  rows = 4,
}: {
  label: string;
  name: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>
      {hint && <p className="mb-2 text-xs text-ink/50">{hint}</p>}
      <textarea
        id={name}
        name={name}
        rows={rows}
        className="w-full resize-none rounded-xl border border-ink/15 bg-base-raised px-4 py-3 text-ink transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent-animate"
      />
    </div>
  );
}
