"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { resourcesData } from "@/data/resources";

gsap.registerPlugin(ScrollTrigger);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ResourcesTeaser() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const latest = resourcesData.slice(0, 3);

  useEffect(() => {
    if (prefersReducedMotion || !listRef.current) return;

    const items = listRef.current.querySelectorAll("li");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: "power4.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 78%",
          },
        }
      );
    }, listRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setError("Please enter a valid email address.");
      setSubmitted(false);
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <section className="section px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.08em] text-ink/50">
            Downloads and notes
          </p>
          <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-black leading-none text-ink md:text-6xl">
            Free resources
          </h2>
          <p className="mt-3 text-ink/70">LUTs, breakdowns, and tools. Free, no email required.</p>
        </div>

        <ul ref={listRef} className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {latest.map((resource) => (
            <li key={resource.id}>
              <Link
                href={`/animate/resources/${resource.slug}`}
                className="block rounded-card bg-base-raised p-6 transition-transform duration-200 ease-out hover:-translate-y-1"
              >
                <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.08em] text-accent-animate">
                  {resource.type}
                </p>
                <p className="mt-2 font-semibold text-ink">{resource.title}</p>
              </Link>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} noValidate className="mx-auto flex max-w-md flex-col items-center gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full flex-1 rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent-animate"
          />
          <button
            type="submit"
            className="w-full whitespace-nowrap rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97] sm:w-auto"
          >
            Notify me
          </button>
        </form>
        {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
        {submitted && (
          <p className="mt-3 text-center text-sm text-ink/70">
            Thanks, the newsletter is launching soon and I&apos;ll let you know.
          </p>
        )}
      </div>
    </section>
  );
}
