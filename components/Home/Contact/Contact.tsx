"use client";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !formRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        y: 80, opacity: 0, duration: 1, ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
        body: JSON.stringify({ fullName, email, message }),
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

  return (
    <section id="contact" ref={sectionRef} className="section px-6">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-card bg-base-raised p-8 md:p-12">
          <div className="mb-10 text-center">
            <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-4xl font-bold text-ink mb-4">
              Let&apos;s Work Together
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-ink/70">
              Have a project in mind? I&apos;m always open to discussing new opportunities and creative collaborations.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-ink/70 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent-build"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink/70 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="jane@example.com"
                  className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent-build"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-ink/70 mb-2">
                Your Message
              </label>
              <textarea
                name="message"
                id="message"
                rows={6}
                placeholder="Tell me about your project..."
                className="w-full resize-none rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent-build"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-pill bg-accent-build py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97] ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? "Sending..." : "Send Message"}
                {!loading && <span>→</span>}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
