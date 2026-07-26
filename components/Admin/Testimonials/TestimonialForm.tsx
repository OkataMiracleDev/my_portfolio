"use client";

import { useState } from "react";
import UploadWidget from "@/components/Admin/UploadWidget";
import type { testimonials } from "@/lib/db/schema";

type Testimonial = typeof testimonials.$inferSelect;

interface TestimonialFormProps {
  testimonial?: Testimonial;
  action: (formData: FormData) => void;
}

export default function TestimonialForm({ testimonial, action }: TestimonialFormProps) {
  const [avatar, setAvatar] = useState(testimonial?.avatar ?? "");

  return (
    <form action={action} className="max-w-2xl space-y-5">
      <input type="hidden" name="avatar" value={avatar} />

      <div>
        <label className="mb-2 block text-sm font-medium text-ink/70">Route</label>
        <select
          name="route"
          defaultValue={testimonial?.route ?? "build"}
          className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink"
        >
          <option value="build">Build</option>
          <option value="animate">Animate</option>
        </select>
      </div>

      <Field label="Name" name="name" defaultValue={testimonial?.name} required />
      <Field label="Role (optional)" name="role" defaultValue={testimonial?.role ?? ""} />
      <TextArea label="Quote" name="quote" defaultValue={testimonial?.quote} required />
      <UploadWidget label="Avatar" value={avatar} onChange={setAvatar} />

      <button
        type="submit"
        className="rounded-pill bg-accent-build px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
      >
        Save
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-build"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        rows={4}
        className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-build"
      />
    </div>
  );
}
