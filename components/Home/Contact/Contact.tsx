"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import OkataRing from "@/components/Shared/brand/OkataRing";
import { Meta, Tally } from "@/components/Shared/brand/Hud";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * The /build enquiry form.
 *
 * This used to be shared with /animate behind a `mode` prop. /animate now has
 * its own (components/Animate/AnimateContact.tsx) because the two contact
 * surfaces diverged past the point where one component could serve both
 * without every future change to either having to reason about the other.
 * Both post the same shape to the same endpoint; only `mode` differs.
 */
export default function Contact() {
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-reveal",
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fullName = (form.fullName as HTMLInputElement).value.trim();
    const email = (form.email as HTMLInputElement).value.trim();
    const message = (form.message as HTMLTextAreaElement).value.trim();

    if (!fullName || !email || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, message, mode: "build" }),
      });

      if (res.ok) {
        toast.success("Message sent successfully!");
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

  const fieldClass =
    "w-full rounded-xl border border-ink/12 bg-stage px-4 py-3 text-ink placeholder:text-ink/25 transition-colors duration-200 ease-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent-build";

  const labelClass =
    "mb-2 block font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/40";

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-frame px-6 py-24 md:px-12 md:py-36"
    >
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-accent-build opacity-[0.11] blur-[130px]"
        aria-hidden="true"
      />
      <OkataRing className="okata-ring-drift pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] opacity-[0.05]" />

      <div className="relative mx-auto grid max-w-[84rem] gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Meta className="contact-reveal mb-5 block text-ink/40">Next build</Meta>
          <h2 className="contact-reveal font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.6rem,7vw,5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-ink">
            Let&apos;s build
            <br />
            something good<span className="text-signal">.</span>
          </h2>
          <p className="contact-reveal mt-7 max-w-md text-lg leading-relaxed text-ink/55">
            Tell me what you&apos;re building and roughly when you need it. If
            it&apos;s not a fit I&apos;ll say so quickly, and point you at
            someone it is.
          </p>

          <dl className="contact-reveal mt-10 space-y-5 border-t border-ink/10 pt-8">
            <div className="flex items-baseline justify-between gap-4">
              <dt>
                <Meta className="text-ink/35">Availability</Meta>
              </dt>
              <dd>
                <Tally tone="accent" className="text-ink/70">
                  Open for work
                </Tally>
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt>
                <Meta className="text-ink/35">Based in</Meta>
              </dt>
              <dd className="text-sm text-ink/70">Lagos, Nigeria</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt>
                <Meta className="text-ink/35">Elsewhere</Meta>
              </dt>
              <dd>
                <a
                  href="https://github.com/OkataMiracleDev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink/70 underline decoration-ink/20 underline-offset-4 transition-colors duration-200 ease-out hover:text-ink hover:decoration-ink/50"
                >
                  github.com/OkataMiracleDev
                </a>
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt>
                <Meta className="text-ink/35">Also does</Meta>
              </dt>
              <dd>
                <Link
                  href="/animate"
                  className="text-sm text-ink/70 underline decoration-ink/20 underline-offset-4 transition-colors duration-200 ease-out hover:text-ink hover:decoration-ink/50"
                >
                  Motion design
                </Link>
              </dd>
            </div>
          </dl>
        </div>

        <div className="contact-reveal lg:col-span-7">
          <div className="rounded-[2rem] border border-ink/10 bg-stage/60 p-1.5">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-[calc(2rem-0.375rem)] bg-base/40 p-7 md:p-10"
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="build-name" className={labelClass}>
                    Your name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="build-name"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="build-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="build-email"
                    autoComplete="email"
                    placeholder="jane@example.com"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="build-message" className={labelClass}>
                  The brief
                </label>
                <textarea
                  name="message"
                  id="build-message"
                  rows={7}
                  placeholder="What are we building, who is it for, and when does it need to ship?"
                  className={`${fieldClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`group inline-flex w-full items-center justify-between rounded-pill bg-accent-build py-2 pl-6 pr-2 font-medium text-ink transition-transform duration-200 ease-out ${
                  loading ? "cursor-not-allowed opacity-50" : "active:scale-[0.97]"
                }`}
              >
                <span>{loading ? "Sending..." : "Send it"}</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/15 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-px">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M7 17L17 7M17 7H9M17 7V15"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
