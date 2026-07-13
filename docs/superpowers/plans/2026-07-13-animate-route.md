# /animate Route Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the entirely-new motion design route — home page (hero, interactive playground, capabilities, featured work, testimonials, resources teaser, hire CTA), project case studies, and the public resources hub — per spec §11, launching with clearly-labeled placeholder content per spec §12 (real motion work isn't ready yet).

**Architecture:** Depends on Plan 1 (tokens, fonts, `ProjectCard`, motion tokens) and Plan 2 (`/animate` href already wired on the landing page, currently 404ing). Mirrors `/build`'s shell pattern from Plan 3 — its own `app/animate/layout.tsx` with its own nav, themed in the violet `accent-animate` instead of amber. Every placeholder value (project thumbnails, testimonials, resource files) is clearly labeled as such in code comments and uses the codebase's existing `null-project.jpg` placeholder-image convention — never a real client's asset repurposed as filler. Optional fields (`videoEmbedUrl`, resource `fileUrl`) are left `undefined` on placeholder entries, and every component that reads them renders an honest "coming soon" state rather than a broken link or a lie.

**Tech Stack:** Same as Plan 1-3 — Next.js 15, React 19, TypeScript, Tailwind v4, GSAP + Lenis (already wired). The interactive playground uses plain React state + CSS transitions (no new animation dependency) rather than GSAP Draggable/Inertia — simpler to verify correctly on the first pass; upgrading specific toys to GSAP's drag/inertia plugins later is a reasonable follow-up, not required here.

**On testing:** The playground toys and the resource-type filter have real conditional logic worth TDD coverage (same bar as Plan 1's `ProjectCard`/Plan 2's `RouteChoiceCard`). Purely presentational sections (hero, capabilities, footer, etc.) are verified by build + manual browser check, consistent with every prior plan.

---

## File Structure

| File | Change | Task |
|---|---|---|
| `types/content.ts` | Modify (extend) | 1 |
| `data/motion-projects.ts` | Create | 1 |
| `data/resources.ts` | Create | 1 |
| `data/motion-testimonials.ts` | Create | 1 |
| `app/animate/layout.tsx` | Create | 2 |
| `components/Animate/AnimateNav.tsx` | Create | 2 |
| `components/Animate/AnimateHero.tsx` | Create | 3 |
| `components/Animate/Playground/PlaygroundToggle.tsx` | Create | 4 |
| `components/Animate/Playground/PlaygroundSlider.tsx` | Create | 4 |
| `components/Animate/Playground/PlaygroundMagneticButton.tsx` | Create | 4 |
| `components/Animate/Playground/PlaygroundShapeMorph.tsx` | Create | 4 |
| `components/Animate/Playground/InteractivePlayground.tsx` | Create | 4 |
| `components/Animate/Playground/__tests__/*.test.tsx` | Create | 4 |
| `components/Animate/CapabilitiesStrip.tsx` | Create | 5 |
| `components/Animate/FeaturedWork.tsx` | Create | 6 |
| `components/Animate/AnimateTestimonials.tsx` | Create | 7 |
| `components/Animate/ResourcesTeaser.tsx` | Create | 8 |
| `components/Animate/__tests__/ResourcesTeaser.test.tsx` | Create | 8 |
| `components/Animate/HireCta.tsx` | Create | 9 |
| `components/Animate/AnimateFooter.tsx` | Create | 9 |
| `app/animate/page.tsx` | Create | 9 |
| `app/animate/projects/page.tsx` | Create | 10 |
| `app/animate/projects/[slug]/page.tsx` | Create | 11 |
| `app/animate/resources/page.tsx` | Create | 12 |
| `components/Animate/ResourceFilter.tsx` | Create | 12 |
| `components/Animate/__tests__/ResourceFilter.test.tsx` | Create | 12 |
| `app/animate/resources/[slug]/page.tsx` | Create | 13 |
| `next-sitemap.config.js` | Modify | 14 |

---

### Task 1: Extend content types + placeholder data files

- [ ] **Step 1:** Append to `types/content.ts` (keep everything already in the file, just add this at the end):

```ts

export interface MotionProjectContent extends ProjectContent {
  videoEmbedUrl?: string;
  process: string;
  tools: string[];
}
```

- [ ] **Step 2:** Create `data/motion-projects.ts`:

```ts
import type { MotionProjectContent } from "@/types/content";

// Placeholder case studies — swap in real reels before launch. Thumbnails
// use the codebase's existing /images/null-project.jpg placeholder
// convention (see data/data.ts) rather than any real client's imagery.
// videoEmbedUrl is left undefined until a real reel is embedded; the case
// study page shows a "coming soon" state instead of a broken player.
export const motionProjectsData: MotionProjectContent[] = [
  {
    id: "1",
    slug: "brand-launch-reel",
    title: "Brand Launch Reel",
    description: "Placeholder case study — swap in a real brand animation reel before launch.",
    thumbnail: "/images/null-project.jpg",
    tags: ["Brand Animation", "After Effects"],
    href: "/animate/projects/brand-launch-reel",
    process: "Placeholder process breakdown — replace with the real concept-to-delivery writeup for this project.",
    tools: ["After Effects", "Illustrator"],
  },
  {
    id: "2",
    slug: "ui-microinteractions",
    title: "UI Micro-interactions",
    description: "Placeholder case study — swap in a real interface motion reel before launch.",
    thumbnail: "/images/null-project.jpg",
    tags: ["UI Motion", "Figma", "GSAP"],
    href: "/animate/projects/ui-microinteractions",
    process: "Placeholder process breakdown — replace with the real concept-to-delivery writeup for this project.",
    tools: ["Figma", "GSAP", "Principle"],
  },
  {
    id: "3",
    slug: "social-explainer",
    title: "Social Explainer",
    description: "Placeholder case study — swap in a real short-form explainer reel before launch.",
    thumbnail: "/images/null-project.jpg",
    tags: ["Explainer", "Premiere Pro"],
    href: "/animate/projects/social-explainer",
    process: "Placeholder process breakdown — replace with the real concept-to-delivery writeup for this project.",
    tools: ["Premiere Pro", "After Effects"],
  },
];
```

- [ ] **Step 3:** Create `data/resources.ts`:

```ts
import type { ResourceContent } from "@/types/content";

// Placeholder resources — replace with real downloads/tutorials/tool links
// before launch. Downloads are free and instant (no email gate). Entries
// with no fileUrl/externalUrl render a "coming soon" state rather than a
// dead link.
export const resourcesData: ResourceContent[] = [
  {
    id: "1",
    slug: "starter-lut-pack",
    type: "download",
    title: "Starter LUT Pack",
    description: "A small set of color-grading LUTs. Placeholder — real download file not uploaded yet.",
    tags: ["LUTs", "Color Grading"],
    publishedAt: "2026-07-13",
  },
  {
    id: "2",
    slug: "breaking-down-a-brand-reel",
    type: "tutorial",
    title: "Breaking Down a Brand Reel",
    description: "A short process writeup. Placeholder — replace with real tutorial content.",
    tags: ["Process", "Brand Animation"],
    publishedAt: "2026-07-13",
  },
  {
    id: "3",
    slug: "tools-i-use",
    type: "tool-link",
    title: "Tools I Use",
    description: "A curated list of plugins and tools. Placeholder — replace with real recommendations.",
    externalUrl: "https://www.aescripts.com/",
    tags: ["Tools"],
    publishedAt: "2026-07-13",
  },
];
```

- [ ] **Step 4:** Create `data/motion-testimonials.ts`:

```ts
import type { TestimonialContent } from "@/types/content";

// Placeholder testimonials — replace with real motion-client quotes once
// available (spec §12: motion content isn't ready at launch).
export const motionTestimonialsData: TestimonialContent[] = [
  {
    id: "1",
    name: "Placeholder Client",
    role: "Placeholder Role, Placeholder Company",
    quote: "Placeholder quote — replace with a real client testimonial before launch.",
    avatar: "/images/null-project.jpg",
  },
  {
    id: "2",
    name: "Placeholder Client",
    role: "Placeholder Role, Placeholder Company",
    quote: "Placeholder quote — replace with a real client testimonial before launch.",
    avatar: "/images/null-project.jpg",
  },
];
```

- [ ] **Step 5:** Run `npm run build` — expect success (pure data/type files, no runtime logic to test).

- [ ] **Step 6:** Commit: `git add types/content.ts data/motion-projects.ts data/resources.ts data/motion-testimonials.ts && git commit -m "feat: add /animate placeholder content data"`

---

### Task 2: `/animate` shell + nav

Mirrors `/build`'s shell pattern (Plan 3, Task 1): its own layout establishing base tokens/font, its own nav. Themed in the violet `accent-animate`, with a playful per-icon hover wiggle instead of a plain color change, and persistent links back to `/` and across to `/build` (spec §4's cross-linking requirement).

- [ ] **Step 1:** Create `components/Animate/AnimateNav.tsx`:

```tsx
"use client";
import Link from "next/link";

const links = [
  { id: "home", label: "Home", href: "/animate" },
  { id: "projects", label: "Projects", href: "/animate/projects" },
  { id: "resources", label: "Resources", href: "/animate/resources" },
];

const AnimateNav = () => {
  return (
    <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[10000] rounded-pill bg-base-raised px-4 py-3 shadow-[0_4px_24px_rgb(0_0_0_/_0.08)]">
      <div className="flex items-center justify-center gap-4 md:gap-8">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="text-sm md:text-base font-medium text-ink transition-transform duration-200 ease-out hover:-rotate-3 hover:scale-110 inline-block"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/"
          className="rounded-pill bg-accent-animate px-3 md:px-4 py-1.5 md:py-2 font-medium text-sm text-ink transition-transform duration-200 ease-out hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          Switch mode
        </Link>
      </div>
    </nav>
  );
};

export default AnimateNav;
```

("Switch mode" → `/` covers the landing-page cross-link; the `/build` cross-link lives in the footer, added in Task 9, since it's a less frequent action than "go back to the mode chooser.")

- [ ] **Step 2:** Create `app/animate/layout.tsx`:

```tsx
import AnimateNav from "@/components/Animate/AnimateNav";

export default function AnimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base font-[family-name:var(--font-general-sans)] text-ink">
      <AnimateNav />
      {children}
    </div>
  );
}
```

- [ ] **Step 3:** Run `npm run build` — expect success (no page exists at `/animate` yet, so nothing renders this layout until Task 9 adds `app/animate/page.tsx` — that's fine, Next.js doesn't error on an unused layout).

- [ ] **Step 4:** Commit: `git add components/Animate/AnimateNav.tsx app/animate/layout.tsx && git commit -m "feat: add /animate shell and nav"`

---

### Task 3: Hero

Oversized headline, drifting animated SVG shapes, and a spring-based cursor-follow flourish — the first three seconds have to demonstrate motion craft (spec §11). The cursor-follow uses a CSS `transition` on `transform` (a lightweight spring approximation) rather than pulling in a new physics library.

- [ ] **Step 1:** Create `components/Animate/AnimateHero.tsx`:

```tsx
"use client";
import React, { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const AnimateHero = () => {
  const shapeRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !shapeRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    shapeRef.current.style.transform = `translate(${relX * 40}px, ${relY * 40}px)`;
  };

  const handleMouseLeave = () => {
    if (!shapeRef.current) return;
    shapeRef.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <section
      className="relative flex min-h-[90vh] items-center overflow-hidden px-6"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={shapeRef}
        className={`absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-accent-animate opacity-20 blur-3xl md:h-96 md:w-96 ${
          prefersReducedMotion ? "" : "transition-transform duration-500 ease-out"
        }`}
        aria-hidden="true"
      />
      <div
        className={`absolute left-10 bottom-10 h-40 w-40 rounded-[40%_60%_60%_40%/40%_40%_60%_60%] bg-accent-animate opacity-10 blur-2xl ${
          prefersReducedMotion ? "" : "animate-[spin_18s_linear_infinite]"
        }`}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl">
        <p className="mb-4 inline-flex items-center gap-2 rounded-pill border border-ink/15 px-4 py-1.5 text-sm font-medium text-ink/70">
          <span className="h-2 w-2 rounded-full bg-accent-animate" aria-hidden="true" />
          Motion Designer
        </p>
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-6xl font-bold leading-[0.95] tracking-tight text-ink md:text-8xl">
          Motion that means something.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink/70">
          Brand animation, UI micro-interactions, and short-form video — built to hold attention and say something while it does.
        </p>
      </div>
    </section>
  );
};

export default AnimateHero;
```

- [ ] **Step 2:** Run `npm run build` — expect success.

- [ ] **Step 3:** Manual check (once `app/animate/page.tsx` exists after Task 9 — note this and come back to verify then): moving the mouse over the hero drifts the large blurred circle toward the cursor; the smaller blob spins continuously; with "prefers-reduced-motion: reduce" emulated in DevTools, neither moves.

- [ ] **Step 4:** Commit: `git add components/Animate/AnimateHero.tsx && git commit -m "feat: add /animate hero"`

---

### Task 4: Interactive Playground

The literal "dummy buttons" ask (spec §7/§11). Four toys, each a **real, satisfying, accessible interaction with no backend** — not a dead control. Each gets its own small component plus a test, since this is the single most important "fun" showcase on the route.

- [ ] **Step 1: Write failing tests for the toggle**

Create `components/Animate/Playground/__tests__/PlaygroundToggle.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlaygroundToggle from "../PlaygroundToggle";

describe("PlaygroundToggle", () => {
  it("starts unchecked", () => {
    render(<PlaygroundToggle />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<PlaygroundToggle />);
    const toggle = screen.getByRole("switch");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("toggles on keyboard activation", async () => {
    const user = userEvent.setup();
    render(<PlaygroundToggle />);
    const toggle = screen.getByRole("switch");
    toggle.focus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });
});
```

This test file needs `@testing-library/user-event`, which isn't installed yet.

- [ ] **Step 2:** Install it: `npm install -D @testing-library/user-event`

- [ ] **Step 3:** Run the test, confirm it fails on `Cannot find module '../PlaygroundToggle'`.

- [ ] **Step 4:** Create `components/Animate/Playground/PlaygroundToggle.tsx`:

```tsx
"use client";
import { useState } from "react";

export default function PlaygroundToggle() {
  const [checked, setChecked] = useState(false);

  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label="Demo toggle — for fun, no data is saved"
      onClick={() => setChecked((c) => !c)}
      className={`relative h-8 w-14 rounded-pill transition-colors duration-200 ease-out ${
        checked ? "bg-accent-animate" : "bg-ink/15"
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-base-raised transition-transform duration-200 ease-out ${
          checked ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}
```

- [ ] **Step 5:** Run the test — expect PASS, 3/3.

- [ ] **Step 6: Write failing tests for the slider**

Create `components/Animate/Playground/__tests__/PlaygroundSlider.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PlaygroundSlider from "../PlaygroundSlider";

describe("PlaygroundSlider", () => {
  it("starts at the default value and shows it", () => {
    render(<PlaygroundSlider />);
    expect(screen.getByRole("slider")).toHaveValue("50");
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("shows the label attached to a real accessible name", () => {
    render(<PlaygroundSlider />);
    expect(screen.getByRole("slider")).toHaveAccessibleName(/demo slider/i);
  });
});
```

- [ ] **Step 7:** Run it, confirm it fails on module-not-found.

- [ ] **Step 8:** Create `components/Animate/Playground/PlaygroundSlider.tsx`:

```tsx
"use client";
import { useState } from "react";

export default function PlaygroundSlider() {
  const [value, setValue] = useState(50);

  return (
    <div className="flex items-center gap-4">
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label="Demo slider — for fun, no data is saved"
        className="h-2 flex-1 cursor-pointer appearance-none rounded-pill bg-ink/15 accent-accent-animate"
      />
      <span className="w-8 text-right font-[family-name:var(--font-jetbrains-mono)] text-sm text-ink">
        {value}
      </span>
    </div>
  );
}
```

- [ ] **Step 9:** Run the test — expect PASS, 2/2.

- [ ] **Step 10: Write failing tests for the magnetic button**

Create `components/Animate/Playground/__tests__/PlaygroundMagneticButton.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlaygroundMagneticButton from "../PlaygroundMagneticButton";

describe("PlaygroundMagneticButton", () => {
  it("renders as a real, labeled button", () => {
    render(<PlaygroundMagneticButton />);
    expect(
      screen.getByRole("button", { name: /demo magnetic button/i })
    ).toBeInTheDocument();
  });

  it("is clickable without throwing", async () => {
    const user = userEvent.setup();
    render(<PlaygroundMagneticButton />);
    await user.click(screen.getByRole("button", { name: /demo magnetic button/i }));
  });
});
```

- [ ] **Step 11:** Run it, confirm it fails on module-not-found.

- [ ] **Step 12:** Create `components/Animate/Playground/PlaygroundMagneticButton.tsx`:

```tsx
"use client";
import { useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function PlaygroundMagneticButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [pressed, setPressed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || !buttonRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    buttonRef.current.style.transform = `translate(${relX * 0.3}px, ${relY * 0.3}px)`;
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    buttonRef.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <button
      ref={buttonRef}
      aria-label="Demo magnetic button — for fun, no data is saved"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className={`rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out ${
        pressed ? "scale-95" : ""
      }`}
    >
      Try me
    </button>
  );
}
```

- [ ] **Step 13:** Run the test — expect PASS, 2/2.

- [ ] **Step 14: Write failing tests for the shape-morph trigger**

Create `components/Animate/Playground/__tests__/PlaygroundShapeMorph.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlaygroundShapeMorph from "../PlaygroundShapeMorph";

describe("PlaygroundShapeMorph", () => {
  it("renders the trigger button and a shape", () => {
    render(<PlaygroundShapeMorph />);
    expect(screen.getByRole("button", { name: /morph shape/i })).toBeInTheDocument();
    expect(screen.getByTestId("morph-shape")).toBeInTheDocument();
  });

  it("changes the shape's data-morphed state when clicked", async () => {
    const user = userEvent.setup();
    render(<PlaygroundShapeMorph />);
    const shape = screen.getByTestId("morph-shape");
    expect(shape).toHaveAttribute("data-morphed", "false");
    await user.click(screen.getByRole("button", { name: /morph shape/i }));
    expect(shape).toHaveAttribute("data-morphed", "true");
  });
});
```

- [ ] **Step 15:** Run it, confirm it fails on module-not-found.

- [ ] **Step 16:** Create `components/Animate/Playground/PlaygroundShapeMorph.tsx`:

```tsx
"use client";
import { useState } from "react";

export default function PlaygroundShapeMorph() {
  const [morphed, setMorphed] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        data-testid="morph-shape"
        data-morphed={morphed}
        className={`h-16 w-16 bg-accent-animate transition-all duration-500 ease-in-out ${
          morphed ? "rounded-full rotate-45" : "rounded-lg rotate-0"
        }`}
        aria-hidden="true"
      />
      <button
        onClick={() => setMorphed((m) => !m)}
        className="rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
      >
        Morph shape
      </button>
    </div>
  );
}
```

- [ ] **Step 17:** Run the test — expect PASS, 2/2.

- [ ] **Step 18: Compose the playground section**

Create `components/Animate/Playground/InteractivePlayground.tsx`:

```tsx
import PlaygroundToggle from "./PlaygroundToggle";
import PlaygroundSlider from "./PlaygroundSlider";
import PlaygroundMagneticButton from "./PlaygroundMagneticButton";
import PlaygroundShapeMorph from "./PlaygroundShapeMorph";

export default function InteractivePlayground() {
  return (
    <section className="section px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <p className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-4 py-1.5 text-sm font-medium text-ink/70">
            Just for fun — try these
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-4xl font-bold text-ink">
            A tiny motion playground
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-center justify-center gap-4 rounded-card bg-base-raised p-8">
            <p className="text-sm text-ink/60">Spring toggle</p>
            <PlaygroundToggle />
          </div>
          <div className="flex flex-col justify-center gap-4 rounded-card bg-base-raised p-8">
            <p className="text-sm text-ink/60">Draggable slider</p>
            <PlaygroundSlider />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 rounded-card bg-base-raised p-8">
            <p className="text-sm text-ink/60">Magnetic button</p>
            <PlaygroundMagneticButton />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 rounded-card bg-base-raised p-8">
            <p className="text-sm text-ink/60">Shape morph</p>
            <PlaygroundShapeMorph />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 19:** Run `npm run test` — expect all suites (Plan 1/2/3's plus these four) to pass. Run `npm run build` — expect success.

- [ ] **Step 20:** Commit: `git add components/Animate/Playground package.json package-lock.json && git commit -m "feat: add /animate interactive playground"`

---

### Task 5: Capabilities strip

Varied bento sizing, not a repeated identical-card grid (per impeccable's ban on that pattern).

- [ ] **Step 1:** Create `components/Animate/CapabilitiesStrip.tsx`:

```tsx
const capabilities = [
  { id: "brand", title: "Brand Animation", description: "Logo reveals, brand videos, motion identity systems." },
  { id: "ui", title: "UI Micro-interactions", description: "The small moments that make software feel considered." },
  { id: "social", title: "Social & Explainer", description: "Short-form video built to hold attention and explain fast." },
];

export default function CapabilitiesStrip() {
  return (
    <section className="section px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-12 text-center font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-4xl font-bold text-ink">
          What I do
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {capabilities.map((cap, i) => (
            <div
              key={cap.id}
              className={`rounded-card bg-base-raised p-8 ${i === 0 ? "md:col-span-2" : ""}`}
            >
              <h3 className="mb-3 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
                {cap.title}
              </h3>
              <p className="text-ink/70">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Run `npm run build` — expect success.

- [ ] **Step 3:** Commit: `git add components/Animate/CapabilitiesStrip.tsx && git commit -m "feat: add /animate capabilities strip"`

---

### Task 6: Featured motion work

The one deliberate dark-band section (spec §11) — reels get contrast to pop against, rest of the page stays light. Reuses the shared `ProjectCard` themed `accent="animate"`.

- [ ] **Step 1:** Create `components/Animate/FeaturedWork.tsx`:

```tsx
import Link from "next/link";
import ProjectCard from "@/components/Shared/ProjectCard";
import { motionProjectsData } from "@/data/motion-projects";

export default function FeaturedWork() {
  const featured = motionProjectsData.slice(0, 3);

  return (
    <section className="section bg-band-dark px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-4xl font-bold text-base">
            Featured work
          </h2>
          <Link
            href="/animate/projects"
            className="text-sm font-medium text-base/70 transition-colors duration-200 ease-out hover:text-base"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.id} accent="animate" project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

(`text-base` here is Tailwind's `--color-base` text-color utility — on the dark band it reads as near-white, giving the inverted-section contrast intentionally.)

- [ ] **Step 2:** Run `npm run build` — expect success.

- [ ] **Step 3:** Commit: `git add components/Animate/FeaturedWork.tsx && git commit -m "feat: add /animate featured work band"`

---

### Task 7: Testimonials

Same visual language as `/build`'s testimonial cards, seeded with placeholder data until real motion-client quotes exist (spec §12).

- [ ] **Step 1:** Create `components/Animate/AnimateTestimonials.tsx`:

```tsx
import Image from "next/image";
import { motionTestimonialsData } from "@/data/motion-testimonials";

export default function AnimateTestimonials() {
  return (
    <section className="section px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="mb-12 text-center font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-4xl font-bold text-ink">
          What clients say
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {motionTestimonialsData.map((testimonial) => (
            <div key={testimonial.id} className="rounded-card bg-base-raised p-8">
              <p className="mb-6 text-ink/70">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-ink">{testimonial.name}</p>
                  <p className="text-sm text-ink/60">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Run `npm run build` — expect success.

- [ ] **Step 3:** Commit: `git add components/Animate/AnimateTestimonials.tsx && git commit -m "feat: add /animate testimonials"`

---

### Task 8: Resources teaser + newsletter signup

The route's primary conversion moment (spec §6/§11, audience-first). No email-service backend exists yet, so the form is honest about that: it validates a real email format client-side and confirms with copy that doesn't overpromise persistence.

- [ ] **Step 1: Write the failing test**

Create `components/Animate/__tests__/ResourcesTeaser.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResourcesTeaser from "../ResourcesTeaser";

describe("ResourcesTeaser", () => {
  it("renders up to 3 latest resources", () => {
    render(<ResourcesTeaser />);
    expect(screen.getByText("Starter LUT Pack")).toBeInTheDocument();
    expect(screen.getByText("Breaking Down a Brand Reel")).toBeInTheDocument();
    expect(screen.getByText("Tools I Use")).toBeInTheDocument();
  });

  it("rejects an invalid email on submit", async () => {
    const user = userEvent.setup();
    render(<ResourcesTeaser />);
    const input = screen.getByLabelText(/email/i);
    await user.type(input, "not-an-email");
    await user.click(screen.getByRole("button", { name: /notify me/i }));
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it("confirms signup for a valid email without claiming a backend exists", async () => {
    const user = userEvent.setup();
    render(<ResourcesTeaser />);
    const input = screen.getByLabelText(/email/i);
    await user.type(input, "reader@example.com");
    await user.click(screen.getByRole("button", { name: /notify me/i }));
    expect(screen.getByText(/thanks/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2:** Run it, confirm it fails on module-not-found.

- [ ] **Step 3:** Create `components/Animate/ResourcesTeaser.tsx`:

```tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { resourcesData } from "@/data/resources";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ResourcesTeaser() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const latest = resourcesData.slice(0, 3);

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
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-4xl font-bold text-ink">
            Free resources
          </h2>
          <p className="mt-3 text-ink/70">LUTs, breakdowns, and tools — free, no email required.</p>
        </div>

        <ul className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {latest.map((resource) => (
            <li key={resource.id}>
              <Link
                href={`/animate/resources/${resource.slug}`}
                className="block rounded-card bg-base-raised p-6 transition-transform duration-200 ease-out hover:-translate-y-1"
              >
                <p className="text-sm font-medium text-accent-animate">{resource.type}</p>
                <p className="mt-2 font-semibold text-ink">{resource.title}</p>
              </Link>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col items-center gap-3 sm:flex-row">
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
            Thanks — the newsletter is launching soon, we&apos;ll let you know.
          </p>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4:** Run the test — expect PASS, 3/3.

- [ ] **Step 5:** Commit: `git add components/Animate/ResourcesTeaser.tsx components/Animate/__tests__/ResourcesTeaser.test.tsx && git commit -m "feat: add /animate resources teaser + signup"`

---

### Task 9: Hire CTA, footer, and the `/animate` home page

Composes everything from Tasks 3–8 into the actual route.

- [ ] **Step 1:** Create `components/Animate/HireCta.tsx`:

```tsx
import Link from "next/link";

export default function HireCta() {
  return (
    <section className="px-6 pb-24">
      <div className="max-w-4xl mx-auto rounded-card bg-base-raised p-8 md:p-12 text-center">
        <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl md:text-3xl font-bold text-ink">
          Have a project in mind?
        </h2>
        <p className="mt-3 text-ink/70">Always open to motion work — brand, product, or social.</p>
        <Link
          href="/build#contact"
          className="mt-6 inline-flex items-center gap-2 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
        >
          Let&apos;s talk
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Create `components/Animate/AnimateFooter.tsx`:

```tsx
import Link from "next/link";

export default function AnimateFooter() {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-ink/60 md:flex-row md:px-12">
      <p>© {new Date().getFullYear()} Okata Miracle. All rights reserved.</p>
      <div className="flex gap-6">
        <Link href="/" className="transition-colors duration-200 ease-out hover:text-ink">
          ← All modes
        </Link>
        <Link href="/build" className="transition-colors duration-200 ease-out hover:text-ink">
          View dev work
        </Link>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3:** Create `app/animate/page.tsx`:

```tsx
import type { Metadata } from "next";
import AnimateHero from "@/components/Animate/AnimateHero";
import InteractivePlayground from "@/components/Animate/Playground/InteractivePlayground";
import CapabilitiesStrip from "@/components/Animate/CapabilitiesStrip";
import FeaturedWork from "@/components/Animate/FeaturedWork";
import AnimateTestimonials from "@/components/Animate/AnimateTestimonials";
import ResourcesTeaser from "@/components/Animate/ResourcesTeaser";
import HireCta from "@/components/Animate/HireCta";
import AnimateFooter from "@/components/Animate/AnimateFooter";

export const metadata: Metadata = {
  title: "Okata Miracle | Motion Designer",
  description:
    "Motion design by Okata Miracle — brand animation, UI micro-interactions, short-form video, plus free resources for the motion design community.",
  openGraph: {
    title: "Okata Miracle | Motion Designer",
    description: "Brand animation, UI micro-interactions, and free motion design resources.",
    url: "https://www.okata-miracle.site/animate",
    siteName: "Okata Miracle",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://www.okata-miracle.site/animate",
  },
};

export default function AnimatePage() {
  return (
    <>
      <AnimateHero />
      <InteractivePlayground />
      <CapabilitiesStrip />
      <FeaturedWork />
      <AnimateTestimonials />
      <ResourcesTeaser />
      <HireCta />
      <AnimateFooter />
    </>
  );
}
```

- [ ] **Step 4:** Run `npm run build` — expect success. `/animate` should now appear in the route list.

- [ ] **Step 5:** Manual check: `npm run dev`, visit `/animate` directly, and also via the landing page's **Animate** card (`/`) — it should no longer 404. Scroll the whole page top to bottom; every section from Tasks 3–8 should be present and styled consistently. Click "Switch mode" in the nav (→ `/`), "← All modes" and "View dev work" in the footer (→ `/` and `/build`), and "Let's talk" (→ `/build#contact`).

- [ ] **Step 6:** Commit: `git add components/Animate/HireCta.tsx components/Animate/AnimateFooter.tsx app/animate/page.tsx && git commit -m "feat: compose /animate home page"`

---

### Task 10: `/animate/projects` grid

Shared `ProjectCard`, themed `accent="animate"`.

- [ ] **Step 1:** Create `app/animate/projects/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import ProjectCard from "@/components/Shared/ProjectCard";
import { motionProjectsData } from "@/data/motion-projects";

export const metadata: Metadata = {
  title: "Motion Projects | Okata Miracle",
  description: "Motion design case studies — brand animation, UI micro-interactions, and short-form video.",
};

export default function AnimateProjectsPage() {
  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl md:text-5xl font-bold text-ink">
            Motion Projects
          </h1>
          <p className="mt-4 text-lg text-ink/70">Case studies from brand, product, and social work.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {motionProjectsData.map((project) => (
            <ProjectCard key={project.id} accent="animate" project={project} />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/animate"
            className="group inline-flex items-center gap-3 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
          >
            <span>←</span>
            <span>Back to Animate home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2:** Run `npm run build` — expect success.

- [ ] **Step 3:** Manual check: `/animate/projects` shows all three placeholder projects with tag chips; clicking one navigates to its case study.

- [ ] **Step 4:** Commit: `git add app/animate/projects/page.tsx && git commit -m "feat: add /animate/projects grid"`

---

### Task 11: `/animate/projects/[slug]` case study

Video embed is a click-to-load facade when a real `videoEmbedUrl` exists; every current entry is a placeholder without one, so this also exercises the "coming soon" fallback state.

- [ ] **Step 1:** Create `app/animate/projects/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { motionProjectsData } from "@/data/motion-projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return motionProjectsData.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = motionProjectsData.find((p) => p.slug === slug);

  if (!project) {
    return { title: "Project not found | Okata Miracle" };
  }

  return {
    title: `${project.title} | Okata Miracle`,
    description: project.description,
  };
}

const AnimateProjectPage = async ({ params }: Props) => {
  const { slug } = await params;
  const project = motionProjectsData.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold text-ink">
          Project not found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-4xl md:text-5xl font-bold text-ink">
          {project.title}
        </h1>
        <p className="mb-8 text-lg text-ink/70">{project.description}</p>

        <div className="mb-8 flex aspect-video items-center justify-center rounded-card bg-band-dark">
          {project.videoEmbedUrl ? (
            <iframe
              src={project.videoEmbedUrl}
              title={project.title}
              className="h-full w-full rounded-card"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-base/60">
              Reel coming soon
            </p>
          )}
        </div>

        <div className="mb-8 rounded-card bg-base-raised p-8">
          <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-animate">
            Process
          </p>
          <p className="mb-6 text-ink/70">{project.process}</p>

          <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-animate">
            Tools
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-pill bg-accent-animate/15 px-4 py-2 text-sm font-[family-name:var(--font-jetbrains-mono)] font-medium text-accent-animate"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/animate/projects"
          className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
        >
          <span>←</span>
          <span>Back to Projects</span>
        </Link>
      </div>
    </div>
  );
};

export default AnimateProjectPage;
```

- [ ] **Step 2:** Run `npm run build` — expect success. Confirm all 3 placeholder slugs are statically generated.

- [ ] **Step 3:** Manual check: each case study shows the "Reel coming soon" placeholder (none have a real `videoEmbedUrl` yet), the process text, tool tags, and a working back link.

- [ ] **Step 4:** Commit: `git add app/animate/projects/[slug] && git commit -m "feat: add /animate project case study page"`

---

### Task 12: `/animate/resources` hub with type filters

Client-side filter by resource type (Downloads / Tutorials / Tool links / All) — the one piece of real logic on this page, so it gets a test.

- [ ] **Step 1: Write the failing test**

Create `components/Animate/__tests__/ResourceFilter.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResourceFilter from "../ResourceFilter";
import { resourcesData } from "@/data/resources";

describe("ResourceFilter", () => {
  it("shows every resource when 'All' is selected (the default)", () => {
    render(<ResourceFilter resources={resourcesData} />);
    resourcesData.forEach((r) => {
      expect(screen.getByText(r.title)).toBeInTheDocument();
    });
  });

  it("filters down to only downloads when Downloads is selected", async () => {
    const user = userEvent.setup();
    render(<ResourceFilter resources={resourcesData} />);
    await user.click(screen.getByRole("button", { name: /downloads/i }));

    const downloads = resourcesData.filter((r) => r.type === "download");
    const others = resourcesData.filter((r) => r.type !== "download");

    downloads.forEach((r) => expect(screen.getByText(r.title)).toBeInTheDocument());
    others.forEach((r) => expect(screen.queryByText(r.title)).not.toBeInTheDocument());
  });
});
```

- [ ] **Step 2:** Run it, confirm it fails on module-not-found.

- [ ] **Step 3:** Create `components/Animate/ResourceFilter.tsx`:

```tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import type { ResourceContent } from "@/types/content";

type FilterValue = "all" | ResourceContent["type"];

const filters: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "download", label: "Downloads" },
  { value: "tutorial", label: "Tutorials" },
  { value: "tool-link", label: "Tool links" },
];

export default function ResourceFilter({ resources }: { resources: ResourceContent[] }) {
  const [active, setActive] = useState<FilterValue>("all");
  const visible = active === "all" ? resources : resources.filter((r) => r.type === active);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActive(filter.value)}
            className={`rounded-pill px-4 py-2 text-sm font-medium transition-colors duration-200 ease-out ${
              active === filter.value ? "bg-accent-animate text-ink" : "bg-ink/5 text-ink/70 hover:bg-ink/10"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {visible.map((resource) => (
          <li key={resource.id}>
            <Link
              href={`/animate/resources/${resource.slug}`}
              className="block h-full rounded-card bg-base-raised p-6 transition-transform duration-200 ease-out hover:-translate-y-1"
            >
              <p className="text-sm font-medium text-accent-animate">{resource.type}</p>
              <p className="mt-2 font-semibold text-ink">{resource.title}</p>
              <p className="mt-2 text-sm text-ink/70">{resource.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4:** Run the test — expect PASS, 2/2.

- [ ] **Step 5:** Create `app/animate/resources/page.tsx`:

```tsx
import type { Metadata } from "next";
import ResourceFilter from "@/components/Animate/ResourceFilter";
import { resourcesData } from "@/data/resources";

export const metadata: Metadata = {
  title: "Resources | Okata Miracle",
  description: "Free downloads, tutorials, and tool recommendations for motion designers.",
};

export default function ResourcesPage() {
  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl md:text-5xl font-bold text-ink">
            Resources
          </h1>
          <p className="mt-4 text-lg text-ink/70">
            Free for the community — no email required for downloads.
          </p>
        </div>

        <ResourceFilter resources={resourcesData} />
      </div>
    </div>
  );
}
```

- [ ] **Step 6:** Run `npm run build` — expect success.

- [ ] **Step 7:** Manual check: `/animate/resources` shows all 3 placeholder resources; clicking each filter pill narrows the list correctly; "All" restores everything.

- [ ] **Step 8:** Commit: `git add components/Animate/ResourceFilter.tsx components/Animate/__tests__/ResourceFilter.test.tsx app/animate/resources/page.tsx && git commit -m "feat: add /animate/resources hub with type filter"`

---

### Task 13: `/animate/resources/[slug]` detail page

Downloads with no real `fileUrl` yet (all current placeholder entries) show a "coming soon" state instead of a dead link — same honesty pattern as the video embed in Task 11.

- [ ] **Step 1:** Create `app/animate/resources/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { resourcesData } from "@/data/resources";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return resourcesData.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = resourcesData.find((r) => r.slug === slug);

  if (!resource) {
    return { title: "Resource not found | Okata Miracle" };
  }

  return {
    title: `${resource.title} | Okata Miracle`,
    description: resource.description,
  };
}

const ResourceDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  const resource = resourcesData.find((r) => r.slug === slug);

  if (!resource) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold text-ink">
          Resource not found
        </h1>
      </div>
    );
  }

  const actionHref = resource.fileUrl ?? resource.externalUrl;

  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <div className="max-w-2xl mx-auto rounded-card bg-base-raised p-8 md:p-12">
        <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-animate">
          {resource.type}
        </p>
        <h1 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-4xl font-bold text-ink">
          {resource.title}
        </h1>
        <p className="mb-8 text-ink/70">{resource.description}</p>

        {actionHref ? (
          <a
            href={actionHref}
            target={resource.type === "tool-link" ? "_blank" : undefined}
            rel={resource.type === "tool-link" ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
          >
            {resource.type === "download" ? "Download" : "Visit link"}
          </a>
        ) : (
          <p className="inline-flex items-center gap-2 rounded-pill bg-ink/5 px-6 py-3 font-semibold text-ink/50">
            Coming soon
          </p>
        )}

        <div className="mt-8">
          <Link
            href="/animate/resources"
            className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
          >
            <span>←</span>
            <span>Back to Resources</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
```

- [ ] **Step 2:** Run `npm run build` — expect success.

- [ ] **Step 3:** Manual check: each of the 3 placeholder resources shows "Coming soon" (none have `fileUrl`/`externalUrl` set... check `data/resources.ts` from Task 1 — the `tools-i-use` entry does have an `externalUrl`, so that one should show a working "Visit link" button opening in a new tab; the other two should show "Coming soon").

- [ ] **Step 4:** Commit: `git add app/animate/resources/[slug] && git commit -m "feat: add /animate resource detail page"`

---

### Task 14: Sitemap coverage

Extends `next-sitemap` to include the new dynamic `/animate` routes (spec §13).

- [ ] **Step 1:** Read the current `next-sitemap.config.js` and add an `additionalPaths` (or equivalent, matching whatever API the existing config already uses) entry enumerating `/animate/projects/[slug]` and `/animate/resources/[slug]` for each item in `motionProjectsData` and `resourcesData`, following the same pattern already used (if any) for `/build/projects/[projectID]`. If the existing config has no dynamic-route handling at all (static-only sitemap), add a minimal `additionalPaths` async function that imports both data files and returns a loc entry per project/resource slug, matching next-sitemap's documented `additionalPaths` API.

- [ ] **Step 2:** Run `npm run build && npx next-sitemap` (or whatever script currently generates the sitemap — check `package.json` for an existing `postbuild` hook) and inspect the generated `public/sitemap.xml` (or wherever it outputs) to confirm `/animate`, `/animate/projects`, each `/animate/projects/[slug]`, `/animate/resources`, and each `/animate/resources/[slug]` are all present.

- [ ] **Step 3:** Commit: `git add next-sitemap.config.js && git commit -m "feat: extend sitemap to cover /animate dynamic routes"`

---

## Definition of Done

- [ ] `npm run build` and `npm run test` both succeed.
- [ ] `/animate` is reachable from the landing page's Animate card and no longer 404s.
- [ ] Every playground toy is a real `button`/`input[type=range]` with a correct ARIA role, works via mouse, touch, and keyboard, and does something visible when used.
- [ ] The resources hub's type filter actually filters (verified by test, not just visually).
- [ ] No placeholder content pretends to be real — every video embed and resource without a real asset shows an honest "coming soon" state rather than a broken link or an empty player.
- [ ] `/animate` has working cross-links back to `/` and to `/build`, and `/build` (from Plan 2/3) already links to `/animate`.
- [ ] Every `/animate/*` page has its own accurate `<title>`/description, including the dynamic project and resource detail pages.
