"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { ResourceContent, StudioPluginContent } from "@/types/content";
import PlaygroundConfettiButton from "./Playground/PlaygroundConfettiButton";
import { usePlaygroundReveal } from "./Playground/PlaygroundRevealContext";

gsap.registerPlugin(ScrollTrigger);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ResourcesTeaser({
  resources,
  studioPlugins,
}: {
  resources: ResourceContent[];
  studioPlugins: StudioPluginContent[];
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const pluginsListRef = useRef<HTMLUListElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { revealed } = usePlaygroundReveal();
  const latest = resources.slice(0, 3);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (listRef.current) {
        gsap.fromTo(
          listRef.current.querySelectorAll("li"),
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power4.out",
            stagger: 0.06,
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 78%",
            },
          }
        );
      }
      if (pluginsListRef.current) {
        gsap.fromTo(
          pluginsListRef.current.querySelectorAll("li"),
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power4.out",
            stagger: 0.06,
            scrollTrigger: {
              trigger: pluginsListRef.current,
              start: "top 85%",
            },
          }
        );
      }
    });

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
    <section className="section relative px-6 md:px-12">
      <div
        className={`absolute bottom-10 right-4 -rotate-3 transition-all duration-500 ease-out md:right-10 ${
          revealed ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <PlaygroundConfettiButton />
      </div>
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-ink/50">
              Downloads and notes
            </p>
            <h2 className="max-w-md font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold leading-[0.95] text-ink md:text-6xl">
              Free{" "}
              <span className="text-accent-animate">
                resources.
              </span>
            </h2>
          </div>
          <p className="max-w-xs text-ink/65">LUTs, breakdowns, and tools. Free, no email required.</p>
        </div>

        {studioPlugins.length > 0 && (
          <div className="mb-14">
            <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-ink/50">
              Mimi Studio
            </p>
            <ul ref={pluginsListRef} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {studioPlugins.slice(0, 3).map((plugin) => (
                <li key={plugin.id}>
                  <Link
                    href={`/animate/resources/plugins/${plugin.slug}`}
                    className="group block rounded-card bg-base-raised p-5 transition-transform duration-200 ease-out hover:-translate-y-1"
                  >
                    <span className="block font-[family-name:var(--font-cabinet-grotesk)] font-bold text-ink transition-colors duration-200 ease-out group-hover:text-accent-animate">
                      {plugin.title}
                    </span>
                    <span className="mt-1 block text-sm text-ink/60">
                      {plugin.pwywEnabled ? "Pay what you want" : `₦${plugin.priceAmount.toLocaleString()}`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul ref={listRef} className="divide-y divide-ink/10 border-y border-ink/10">
          {latest.map((resource, i) => (
            <li key={resource.id}>
              <Link
                href={`/animate/resources/${resource.slug}`}
                className="group flex items-center justify-between gap-6 py-6"
              >
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-ink/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="block font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-accent-animate">
                    {resource.type}
                  </span>
                  <span className="mt-1 block font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold text-ink transition-colors duration-200 ease-out group-hover:text-accent-animate md:text-2xl">
                    {resource.title}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-2xl text-ink/30 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-accent-animate"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-12 flex max-w-md flex-col gap-3 sm:flex-row sm:items-center md:mx-auto"
        >
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
        {error && <p className="mt-3 text-left text-sm text-red-600 md:text-center">{error}</p>}
        {submitted && (
          <p className="mt-3 text-left text-sm text-ink/70 md:text-center">
            Thanks, the newsletter is launching soon and I&apos;ll let you know.
          </p>
        )}
      </div>
    </section>
  );
}
