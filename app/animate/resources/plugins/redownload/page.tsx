"use client";

import { useState } from "react";
import Link from "next/link";
import { requestRedownload } from "@/lib/actions/plugin-redownload";

export default function RedownloadPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(formData: FormData) {
    await requestRedownload(formData);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <div className="max-w-md mx-auto rounded-card bg-base-raised p-8 text-center md:p-12">
        <h1 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold text-ink">
          Lost your download link?
        </h1>
        <p className="mb-8 text-ink/70">
          Enter the email you used at checkout and we&apos;ll resend any download links to your inbox.
        </p>
        {submitted ? (
          <p className="text-ink/70">
            If we found a purchase for that email, check your inbox in the next few minutes.
          </p>
        ) : (
          <form action={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
            />
            <button
              type="submit"
              className="rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97]"
            >
              Resend my links
            </button>
          </form>
        )}
        <div className="mt-8">
          <Link href="/animate/resources" className="text-sm text-ink/60 hover:text-ink">
            ← Back to Resources
          </Link>
        </div>
      </div>
    </div>
  );
}
