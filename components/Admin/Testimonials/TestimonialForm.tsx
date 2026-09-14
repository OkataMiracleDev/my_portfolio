"use client";

import { useState } from "react";
import UploadWidget from "@/components/Admin/UploadWidget";
import type { testimonials } from "@/lib/db/schema";
import SubmitButton from "@/components/Admin/SubmitButton";
import { Field, TextArea, FormShell, Select } from "@/components/Admin/ui/Fields";

type Testimonial = typeof testimonials.$inferSelect;

interface TestimonialFormProps {
  testimonial?: Testimonial;
  defaultValues?: { name?: string; quote?: string; fromSubmissionId?: string };
  action: (formData: FormData) => void;
}

export default function TestimonialForm({ testimonial, defaultValues, action }: TestimonialFormProps) {
  const [avatar, setAvatar] = useState(testimonial?.avatar ?? "");

  return (
    <FormShell action={action}>
      <input type="hidden" name="avatar" value={avatar} />
      {defaultValues?.fromSubmissionId && (
        <input type="hidden" name="fromSubmissionId" value={defaultValues.fromSubmissionId} />
      )}

      <Select
        label="Route"
        name="route"
        defaultValue={testimonial?.route ?? "build"}
        options={[
          { value: "build", label: "Build" },
          { value: "animate", label: "Animate" },
        ]}
        hint="A testimonial shows on one route only."
      />

      <Field label="Name" name="name" defaultValue={testimonial?.name ?? defaultValues?.name} required />
      <Field label="Role (optional)" name="role" defaultValue={testimonial?.role ?? ""} />
      <TextArea label="Quote" name="quote" defaultValue={testimonial?.quote ?? defaultValues?.quote} required />
      <UploadWidget label="Avatar" value={avatar} onChange={setAvatar} />

      <SubmitButton accent="build" />
    </FormShell>
  );
}
