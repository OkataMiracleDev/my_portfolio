"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { ResourceContent, StudioPluginContent } from "@/types/content";
import PluginCard from "./PluginCard";
import { Meta } from "./brand/Hud";

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
  const latest = resources.slice(0, 3);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      [listRef.current, pluginsListRef.current].forEach((node, index) => {
        if (!node) return;
        gsap.fromTo(
          node.querySelectorAll("li"),
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power4.out",
            stagger: 0.06,
            scrollTrigger: { trigger: node, start: index === 0 ? "top 78%" : "top 85%" },
          }
        );
      });
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
    <section className="section px-6 md:px-12">
      <div className="mx-auto max-w-[84rem]">
        <div className="mb-14 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <Meta className="mb-5 block text-ink/40">Open files</Meta>
            <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-ink">
              Stuff I give away<span className="text-signal">.</span>
            </h2>
          </div>
          <p className="max-w-xs text-ink/55 md:text-right">
            LUTs, breakdowns, and the tools I actually keep open. Free, because
            I learned this way too.
          </p>
        </div>

        {studioPlugins.length > 0 && (
          <div className="mb-16">
            <Meta className="mb-5 block text-ink/35">From the studio</Meta>
            <ul ref={pluginsListRef} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {studioPlugins.slice(0, 3).map((plugin) => (
                <li key={plugin.id}>
                  <PluginCard plugin={plugin} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul ref={listRef} className="border-t border-ink/10">
          {latest.map((resource, i) => (
            <li key={resource.id}>
              <Link
                href={`/animate/resources/${resource.slug}`}
                className="group flex items-center gap-5 border-b border-ink/10 py-7 md:gap-8 md:py-8"
              >
                <Meta className="shrink-0 text-ink/25">
                  {String(i + 1).padStart(2, "0")}
                </Meta>
                <span className="min-w-0 flex-1">
                  <Meta className="block text-accent-animate">{resource.type}</Meta>
                  <span className="mt-1.5 block font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold leading-tight tracking-tight text-ink transition-colors duration-200 ease-out group-hover:text-ink/70 md:text-3xl">
                    {resource.title}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-ink/25 transition-transform duration-200 ease-out group-hover:translate-x-1"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 17L17 7M17 7H9M17 7V15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Newsletter. noValidate is load-bearing: without it the browser's own
            type="email" constraint check swallows the submit event before the
            component's handler (and its tests) ever run. */}
        <div className="mt-14 rounded-[1.75rem] border border-ink/10 bg-frame/50 p-7 md:p-10">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold tracking-tight text-ink md:text-3xl">
                Get the next one first
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/45">
                No schedule, no funnel. It goes out when there is something
                worth sending.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto"
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
                className="w-full rounded-pill border border-ink/15 bg-stage px-5 py-3 text-ink placeholder:text-ink/25 transition-colors duration-200 ease-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent-animate sm:w-64"
              />
              <button
                type="submit"
                className="w-full shrink-0 whitespace-nowrap rounded-pill bg-accent-animate px-6 py-3 font-medium text-ink transition-transform duration-200 ease-out active:scale-[0.97] sm:w-auto"
              >
                Notify me
              </button>
            </form>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm text-signal">
              {error}
            </p>
          )}
          {submitted && (
            <p className="mt-4 text-sm text-ink/60">
              Thanks &mdash; the newsletter is launching soon and I&apos;ll let
              you know.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
