"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

const SectionHeading = ({ heading }: { heading: string }) => {
  return (
    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
      {heading}
    </h2>
  );
};

const Contact = () => {
  const [loading, setLoading] = useState(false);

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
    <div id="contact" data-aos="fade-up"  className="ml-[4%] md:ml-[4%] lg:ml-[14%] w-full mt-[7rem] md:mt-[9rem] lg:mt-[10rem] 2xl:mt-[9rem] transition-all duration-400">
      <div className="flex flex-col flex-wrap justify-center">
        {/* Introduction Text */}
        <div data-aos="fade-up"  className="text-left max-w-[340px] md:max-w-[600px]">
          <SectionHeading heading="Get in touch" />
          <p data-aos="fade-up"  className="text-gray-700 leading-relaxed mt-4">
            Ready to build the future? I&apos;m keen to connect with product
            teams and like-minded innovators to discuss challenging projects. If
            you&apos;re looking for a developer who delivers record-time results
            and drives measurable impact, feel free to book a discovery call or
            send an email to discuss your vision.
          </p>
        </div>

        {/* Contact Form */}
        <form data-aos="fade-right"  onSubmit={handleSubmit} className="mt-8 w-full gap-[2rem] flex flex-col">
          {/* Name and Email Fields */}
          <div className="flex flex-col md:flex-row gap-[2rem] w-full">
            {/* Full Name */}
            <div className="w-1/2 md:w-1/3">
              <label
                htmlFor="fullName"
                className="block text-sm md:text-lg font-medium text-gray-500"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  autoComplete="name"
                  placeholder="e.g., Jane Doe"
                  className="block w-full rounded-md border-2 border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 md:text-lg sm:text-sm p-2"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="w-2/3 md:w-3/6 lg:w-2/5">
              <label
                htmlFor="email"
                className="block text-sm md:text-lg font-medium text-gray-500"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="e.g., test@gmail.com"
                  className="block w-full rounded-md border-2 border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 md:text-lg sm:text-sm p-2"
                />
              </div>
            </div>
          </div>

          {/* Message Area */}
          <div className="w-[90%] md:w-[87%] lg:w-[77%]">
            <label
              htmlFor="message"
              className="block text-sm md:text-lg font-medium text-gray-500"
            >
              Write Your Message
            </label>
            <div className="mt-1">
              <textarea
                name="message"
                id="message"
                rows={4}
                placeholder="Let me know how I can help you with your project..."
                className="block w-full rounded-md border-2 border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 md:text-lg sm:text-sm p-2"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 w-full">
            <button
              type="submit"
              disabled={loading}
              className={`w-[90%] md:w-[87%] lg:w-[77%] font-bold py-3 px-6 rounded-md shadow-lg transition-all duration-300 ease-in-out ${
                loading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-black text-white hover:bg-blue-200 hover:text-gray-700"
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
