import type { FaqEntry } from "./structured-data";
import { CONTACT_EMAIL } from "@/lib/site";

/**
 * The questions people actually type when they're looking for a motion
 * designer in Nigeria — rendered visibly on /animate *and* emitted as
 * FAQPage structured data from this one list, so the two can never drift
 * (search engines discard FAQ markup that doesn't match the page).
 *
 * Every answer restates something the site already says elsewhere: the
 * location (hero, contact, footer), the service lines (ServicesBoard), the
 * process (the brief sign-off steps) and the rate card. Nothing here should
 * promise a number that lives in admin and can change — turnaround times
 * and prices are deliberately pointed at, not quoted.
 */
export const ANIMATE_FAQ: FaqEntry[] = [
  {
    question: "Is Okata Studios a motion design studio in Nigeria?",
    answer:
      "Yes. Okata Studios is a motion design studio based in Port Harcourt, Nigeria, run by motion designer Miracle Okata. It makes brand animation, SaaS and product ads, explainer videos and short-form video for brands in Nigeria, across Africa and worldwide.",
  },
  {
    question: "Do you work with clients outside Nigeria?",
    answer:
      "Yes. The work happens remotely, so clients in Lagos, Abuja and the rest of Nigeria — and across Africa, Europe, North America and beyond — all work with the studio the same way: a written brief, async reviews and agreed delivery dates.",
  },
  {
    question: "What kind of motion design do you do?",
    answer:
      "Four main kinds: brand animation (logo reveals, intros and motion identity systems), UI animation and micro-interactions for apps and websites, explainer and short-form social video, and performance ads and launch videos for SaaS and software products.",
  },
  {
    question: "How much does a motion designer cost in Nigeria?",
    answer:
      "It depends on length, style and how many formats you need. Current project and monthly retainer prices are on the rate card at okata.space/animate/rates. Nigerian clients can be quoted in naira and international clients in US dollars.",
  },
  {
    question: "How does a motion design project with you work?",
    answer:
      "You fill in a short project brief. Scope and price are confirmed against the rate card, and a 50% deposit starts the work. You review a first draft, the included revision rounds follow, and final files are delivered in every format and aspect ratio you need, with the balance due on handoff.",
  },
  {
    question: "How do I start a project?",
    answer: `Use the contact form on this page or email ${CONTACT_EMAIL} with what you're making, when you need it and where it will run. You'll get a reply with next steps and the right brief to fill in.`,
  },
];
