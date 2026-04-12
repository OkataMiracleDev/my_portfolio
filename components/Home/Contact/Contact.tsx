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
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
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
        <div className="card p-8 md:p-12">
          {/* Heading */}
          <div className="mb-10 text-center">
            <h2 className="heading-2 mb-4">
              Let's Work Together
            </h2>
            <p className="body-large max-w-2xl mx-auto">
              Have a project in mind? I'm always open to discussing new opportunities and creative collaborations.
            </p>
          </div>

          {/* Contact Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2"
                  style={{
                    background: 'oklch(0.25 0.04 285 / 0.5)',
                    border: '1px solid oklch(0.35 0.05 285 / 0.3)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="jane@example.com"
                  className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2"
                  style={{
                    background: 'oklch(0.25 0.04 285 / 0.5)',
                    border: '1px solid oklch(0.35 0.05 285 / 0.3)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Your Message
              </label>
              <textarea
                name="message"
                id="message"
                rows={6}
                placeholder="Tell me about your project..."
                className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 resize-none"
                style={{
                  background: 'oklch(0.25 0.04 285 / 0.5)',
                  border: '1px solid oklch(0.35 0.05 285 / 0.3)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full ${
                loading ? "opacity-50 cursor-not-allowed" : ""
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
