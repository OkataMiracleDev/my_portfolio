# Design System Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the shared infrastructure — dependency cleanup, test harness, design tokens, fonts, smooth scroll, shared content types, and a shared `ProjectCard` component — that the Landing Page, `/build`, and `/animate` plans will all build on top of.

**Architecture:** This plan is additive and non-destructive: the currently-live single-page dev portfolio (`components/Home/Home.tsx` and its children, rendered at `/`) keeps working and rendering exactly as it does today throughout this plan. New design tokens are added to `app/globals.css` alongside the existing dark-purple tokens (not replacing them yet), and new fonts are loaded but not yet activated as the active body font. The next phase plan (Landing Page) is the one that introduces the new `/`, moves the current homepage to `/build`, and starts actually applying these tokens to markup.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, GSAP (existing), Lenis (new), Vitest + React Testing Library (new, this project currently has no test framework).

**Note on testing approach:** This codebase has no existing test framework. Per this plan, Vitest + jsdom + React Testing Library are introduced in Task 2 so that genuinely logic-bearing pieces (the reduced-motion hook, the shared card component) get real TDD coverage. Tasks that are pure CSS/config/asset-loading changes (design tokens, font wiring, Lenis integration) are not meaningfully unit-testable — there is no behavior to assert against a CSS custom property or a third-party scroll library's internals — so those tasks are verified with an exact build command and a manual browser check instead, each with a precise expected outcome. This mirrors how a senior engineer would actually verify this kind of change; it is not a shortcut around testing what can be tested.

---

## File Structure

| File | Change | Responsibility |
|---|---|---|
| `package.json` | Modify | Remove `aos`/`@types/aos`; add `lenis`, `vitest`, `jsdom`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`; add `test`/`test:watch` scripts |
| `components/Home/Home.tsx` | Modify | Remove AOS import + init effect |
| `vitest.config.ts` | Create | Vitest configuration (jsdom environment, `@` path alias) |
| `vitest.setup.ts` | Create | Loads `@testing-library/jest-dom` matchers |
| `hooks/usePrefersReducedMotion.ts` | Create | Reactive `prefers-reduced-motion` hook, used by Lenis setup and later by all decorative animation |
| `hooks/__tests__/usePrefersReducedMotion.test.ts` | Create | Tests for the hook |
| `app/globals.css` | Modify | Add new `@theme` token block (colors, radii) alongside existing tokens |
| `public/fonts/CabinetGrotesk-Variable.woff2` | Create (binary asset) | Display font file |
| `public/fonts/GeneralSans-Variable.woff2` | Create (binary asset) | Body font file |
| `lib/fonts.ts` | Create | `next/font/local` definitions for Cabinet Grotesk + General Sans |
| `app/layout.tsx` | Modify | Load new fonts as CSS variables (additive); mount `SmoothScroll` |
| `components/SmoothScroll.tsx` | Create | Lenis smooth-scroll provider, respects reduced motion |
| `types/content.ts` | Create | Shared `ProjectContent` / `ResourceContent` / `TestimonialContent` types |
| `components/Shared/ProjectCard.tsx` | Create | Shared project-card component used by later Build/Animate plans |
| `components/Shared/__tests__/ProjectCard.test.tsx` | Create | Tests for `ProjectCard` |

---

### Task 1: Remove AOS

AOS (`aos` package) is redundant with GSAP ScrollTrigger, which the codebase already uses. Removing it now keeps the dependency list clean before new dependencies are added in this same plan.

**Files:**
- Modify: `components/Home/Home.tsx`
- Modify: `package.json`

- [ ] **Step 1: Remove the AOS import and init effect from Home.tsx**

Replace the full contents of `components/Home/Home.tsx` with:

```tsx
"use client"
import Hero from './Hero/Hero'
import Projects from './Projects/Projects'
import About from './About/About'
import HomeProjects from './HomeProjects/HomeProjects'
import Stack from './Stack/Stack'
import Experience from './Experience/Experience'
import Testimonials from './Testimonials/Testimonials'
import Contact from './Contact/Contact'
import Footer from './Footer/Footer'
import SplashScreen from '../SplashScreen'

const Home = () => {
  return (
    <>
      <SplashScreen />
      <div className='min-h-screen overflow-x-hidden md:overflow-x-auto'>
        <Hero />
        <Projects />
        <About />
        <HomeProjects />
        <Stack />
        <Experience />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </>
  )
}

export default Home
```

- [ ] **Step 2: Verify the app still builds with AOS still installed but unused**

Run: `npm run build`
Expected: Build succeeds with no errors (confirms `Home.tsx` no longer depends on `aos` before we remove the package).

- [ ] **Step 3: Uninstall the AOS package**

Run: `npm uninstall aos @types/aos`
Expected: `package.json` and `package-lock.json` no longer list `aos` or `@types/aos`.

- [ ] **Step 4: Verify the app builds with the package removed**

Run: `npm run build`
Expected: Build succeeds with no errors (confirms no other file in the codebase still imports `aos`).

- [ ] **Step 5: Commit**

```bash
git add components/Home/Home.tsx package.json package-lock.json
git commit -m "chore: remove aos, redundant with GSAP ScrollTrigger"
```

---

### Task 2: Testing infrastructure + `usePrefersReducedMotion` hook

Introduces Vitest/jsdom/React Testing Library, and immediately proves the harness works by TDD-ing the first real piece of shared logic: a hook that later tasks (Lenis, and every decorative animation in the Landing/Build/Animate plans) will use to respect `prefers-reduced-motion`.

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `hooks/usePrefersReducedMotion.ts`
- Test: `hooks/__tests__/usePrefersReducedMotion.test.ts`

- [ ] **Step 1: Install test dependencies**

Run: `npm install -D vitest jsdom @vitejs/plugin-react @testing-library/react @testing-library/jest-dom`
Expected: packages added to `devDependencies` in `package.json`.

- [ ] **Step 2: Add test scripts to package.json**

In `package.json`, inside `"scripts"`, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create the Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 4: Create the Vitest setup file**

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Write the failing test for the hook**

Create `hooks/__tests__/usePrefersReducedMotion.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";

type Listener = (event: MediaQueryListEvent) => void;

function mockMatchMedia(initialMatches: boolean) {
  const listeners: Listener[] = [];
  const mql = {
    matches: initialMatches,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: (_: string, cb: Listener) => {
      listeners.push(cb);
    },
    removeEventListener: (_: string, cb: Listener) => {
      const index = listeners.indexOf(cb);
      if (index !== -1) listeners.splice(index, 1);
    },
    dispatch(nextMatches: boolean) {
      mql.matches = nextMatches;
      listeners.forEach((cb) => cb({ matches: nextMatches } as MediaQueryListEvent));
    },
  };
  window.matchMedia = vi.fn().mockReturnValue(mql);
  return mql;
}

describe("usePrefersReducedMotion", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false when the media query does not match", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when the media query matches", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it("updates when the media query changes after mount", () => {
    const mql = mockMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      mql.dispatch(true);
    });

    expect(result.current).toBe(true);
  });
});
```

- [ ] **Step 6: Run the test and verify it fails**

Run: `npx vitest run hooks/__tests__/usePrefersReducedMotion.test.ts`
Expected: FAIL — `Cannot find module '../usePrefersReducedMotion'` (this also proves the Vitest harness itself is wired up correctly, since it gets far enough to report a real module-resolution error).

- [ ] **Step 7: Implement the hook**

Create `hooks/usePrefersReducedMotion.ts`:

```ts
"use client";
import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    setPrefersReducedMotion(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
```

- [ ] **Step 8: Run the test and verify it passes**

Run: `npx vitest run hooks/__tests__/usePrefersReducedMotion.test.ts`
Expected: PASS — 3 tests passed.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts hooks/usePrefersReducedMotion.ts hooks/__tests__/usePrefersReducedMotion.test.ts
git commit -m "test: add Vitest harness and usePrefersReducedMotion hook"
```

---

### Task 3: Design tokens

Adds the new color and radius tokens from the design spec (§6) as a Tailwind v4 `@theme` block, additive alongside the existing dark-purple `:root` tokens. Tailwind v4 auto-generates utility classes from `--color-*` and `--radius-*` theme variables (e.g. `--color-ink` → `bg-ink`/`text-ink`, `--radius-card` → `rounded-card`).

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add the new `@theme` block**

In `app/globals.css`, insert the following block immediately after the `@import "tailwindcss";` line (line 1) and before the existing `:root { ... }` block:

```css
@theme {
  /* New light-minimal identity tokens (spec §6). Existing dark-purple
     :root tokens below are still in active use by the current homepage
     and are removed when that page is redesigned in a later plan. */
  --color-ink: oklch(21% 0.015 55);
  --color-base: oklch(97% 0.01 55);
  --color-base-raised: oklch(99% 0.006 55);
  --color-accent-build: oklch(64% 0.19 45);
  --color-accent-animate: oklch(58% 0.24 300);
  --color-band-dark: oklch(16% 0.02 300);

  --radius-card: 1.25rem;
  --radius-pill: 999px;

  /* Motion tokens (spec §7). These override Tailwind's built-in, weaker
     ease-out/ease-in-out utilities with the stronger custom curves; every
     `ease-out`/`ease-in-out` class site-wide now uses these automatically. */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: Build succeeds with no errors. (This is a pure token-definition change with no consumers yet — there is no behavior to unit test here; the next plan that actually applies e.g. `bg-accent-build` in markup is where these tokens get exercised for the first time.)

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add light-minimal design tokens alongside existing theme"
```

---

### Task 4: Self-hosted fonts (Cabinet Grotesk + General Sans)

Adds the two new brand fonts as CSS variables via `next/font/local`, following the font-selection decision in spec §6 (neither font is on the AI-reflex-reject list; `Space_Grotesk`, already in this codebase, is on that list and gets replaced when the Landing/Build plans redesign the pages that use it — not in this plan, to keep this plan non-destructive to the live site).

**Files:**
- Create: `public/fonts/CabinetGrotesk-Variable.woff2` (manual download, see Step 1)
- Create: `public/fonts/GeneralSans-Variable.woff2` (manual download, see Step 1)
- Create: `lib/fonts.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Download the font files (manual step)**

These are free fonts from Fontshare, not distributed via npm, so this step is a manual download rather than a command:

1. Visit `https://www.fontshare.com/fonts/cabinet-grotesk`, use "Get fonts" to download the family ZIP, extract it, and locate the **variable** `.woff2` file inside (Fontshare ships these under a `Fonts/Variable/` or `WEB/fonts/variable/` folder depending on the current package layout — check the extracted folder for the one `.woff2` file whose name contains "Variable"). Copy/rename it to `public/fonts/CabinetGrotesk-Variable.woff2`.
2. Repeat for `https://www.fontshare.com/fonts/general-sans`, saving the variable `.woff2` file to `public/fonts/GeneralSans-Variable.woff2`.

Expected: both files exist on disk at those exact paths.

- [ ] **Step 2: Define the font loaders**

Create `lib/fonts.ts`:

```ts
import localFont from "next/font/local";

export const cabinetGrotesk = localFont({
  src: "../public/fonts/CabinetGrotesk-Variable.woff2",
  variable: "--font-cabinet-grotesk",
  display: "swap",
  weight: "400 900",
});

export const generalSans = localFont({
  src: "../public/fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
  display: "swap",
  weight: "400 700",
});
```

- [ ] **Step 3: Load the fonts in the root layout (additive — do not change the active body font yet)**

In `app/layout.tsx`, add the import below the existing `next/font/google` import:

```tsx
import { cabinetGrotesk, generalSans } from "@/lib/fonts";
```

Then update the `<html>` element's `className` (currently `` `${spaceGrotesk.variable} ${jetbrainsMono.variable}` ``) to:

```tsx
<html
  lang="en"
  className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${cabinetGrotesk.variable} ${generalSans.variable}`}
>
```

Leave the `<body style={{ fontFamily: "var(--font-space-grotesk)" }}>` line unchanged — the current homepage keeps rendering in its existing font until it's redesigned in the Build-route plan. This step only makes the two new font variables available site-wide.

- [ ] **Step 4: Verify the build succeeds**

Run: `npm run build`
Expected: Build succeeds with no errors (confirms both font files were found at the paths referenced in `lib/fonts.ts`).

- [ ] **Step 5: Verify the fonts are loaded in the browser**

Run: `npm run dev`, open `http://localhost:3000`, open the browser devtools console, and run:

```js
getComputedStyle(document.documentElement).getPropertyValue('--font-cabinet-grotesk')
```

Expected: a non-empty string (the generated local font-family name), not empty/`undefined`. Repeat for `--font-general-sans`.

- [ ] **Step 6: Commit**

```bash
git add public/fonts/CabinetGrotesk-Variable.woff2 public/fonts/GeneralSans-Variable.woff2 lib/fonts.ts app/layout.tsx
git commit -m "feat: self-host Cabinet Grotesk and General Sans"
```

---

### Task 5: Lenis smooth scroll

Adds momentum-based smooth scrolling site-wide (pairs with the existing GSAP ScrollTrigger usage in the Experience section), respecting the reduced-motion hook from Task 2.

**Files:**
- Modify: `package.json`
- Create: `components/SmoothScroll.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install Lenis**

Run: `npm install lenis`
Expected: `lenis` added to `dependencies` in `package.json`.

- [ ] **Step 2: Create the SmoothScroll component**

Create `components/SmoothScroll.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function SmoothScroll() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return null;
}
```

- [ ] **Step 3: Mount it in the root layout**

In `app/layout.tsx`, add the import:

```tsx
import SmoothScroll from "@/components/SmoothScroll";
```

And mount it as the first child of `<body>`, before `<ThemeToggle />`:

```tsx
<body style={{ fontFamily: "var(--font-space-grotesk)" }}>
  <SmoothScroll />
  <ThemeToggle />
  <Nav />
  {children}
  ...
```

- [ ] **Step 4: Verify the build succeeds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Verify smooth scroll manually**

Run: `npm run dev`, open `http://localhost:3000`, and scroll with the mouse wheel. Expected: scrolling has a momentum/easing feel rather than snapping instantly (a visible, qualitative difference from default browser scroll).

Then, in Chrome DevTools, open the Rendering tab (Cmd/Ctrl+Shift+P → "Show Rendering"), set "Emulate CSS media feature prefers-reduced-motion" to "reduce", and reload the page. Expected: scrolling now behaves like native/default scroll (Lenis is not initialized).

There is no automated test for this task: Lenis's behavior is a `requestAnimationFrame` loop wrapping a third-party library's internal physics, which is not meaningfully assertable in jsdom (no real frame timing or scroll rendering exists there). The reduced-motion branch is exercised by the manual DevTools check above; the underlying hook it depends on already has full unit coverage from Task 2.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json components/SmoothScroll.tsx app/layout.tsx
git commit -m "feat: add Lenis smooth scroll, respects prefers-reduced-motion"
```

---

### Task 6: Shared content types

Defines the `ProjectContent`, `ResourceContent`, and `TestimonialContent` types from spec §15, so the Landing/Build/Animate plans and the shared `ProjectCard` component (Task 7) share one contract.

**Files:**
- Create: `types/content.ts`

- [ ] **Step 1: Define the types**

Create `types/content.ts`:

```ts
export interface ProjectContent {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  href: string;
}

export interface ResourceContent {
  id: string;
  slug: string;
  type: "download" | "tutorial" | "tool-link";
  title: string;
  description: string;
  fileUrl?: string;
  externalUrl?: string;
  tags: string[];
  publishedAt: string;
}

export interface TestimonialContent {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}
```

- [ ] **Step 2: Verify the project type-checks**

Run: `npm run build`
Expected: Build succeeds with no type errors. (A pure type-declaration file has no runtime behavior to unit test; the type contract is exercised — and would fail to compile if violated — by `ProjectCard` in Task 7.)

- [ ] **Step 3: Commit**

```bash
git add types/content.ts
git commit -m "feat: add shared Project/Resource/Testimonial content types"
```

---

### Task 7: Shared `ProjectCard` component

The one project-card component used by the Landing preview, `/build/projects`, the `/animate` preview, and `/animate/projects` (spec §6), themed per route via an `accent` prop. This is the capstone task for this plan: it exercises the design tokens (Task 3), the fonts (Task 4), and the content types (Task 6) together in one real, tested component.

**Files:**
- Create: `components/Shared/ProjectCard.tsx`
- Test: `components/Shared/__tests__/ProjectCard.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `components/Shared/__tests__/ProjectCard.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectCard from "../ProjectCard";
import type { ProjectContent } from "@/types/content";

const project: ProjectContent = {
  id: "1",
  slug: "unihub",
  title: "UniHub",
  description: "Discover and create university events.",
  thumbnail: "/images/try-unihub.jpg",
  tags: ["Next.js", "Tailwind"],
  href: "/build/projects/unihub",
};

describe("ProjectCard", () => {
  it("renders the project title and description", () => {
    render(<ProjectCard project={project} accent="build" />);
    expect(screen.getByText("UniHub")).toBeInTheDocument();
    expect(
      screen.getByText("Discover and create university events.")
    ).toBeInTheDocument();
  });

  it("renders a link to the project href", () => {
    render(<ProjectCard project={project} accent="build" />);
    const link = screen.getByRole("link", { name: /UniHub/i });
    expect(link).toHaveAttribute("href", "/build/projects/unihub");
  });

  it("renders the thumbnail with the project title as alt text", () => {
    render(<ProjectCard project={project} accent="build" />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "UniHub");
  });

  it("marks the card with a build data-accent attribute when accent is build", () => {
    render(<ProjectCard project={project} accent="build" />);
    expect(screen.getByTestId("project-card")).toHaveAttribute(
      "data-accent",
      "build"
    );
  });

  it("marks the card with an animate data-accent attribute when accent is animate", () => {
    render(<ProjectCard project={project} accent="animate" />);
    expect(screen.getByTestId("project-card")).toHaveAttribute(
      "data-accent",
      "animate"
    );
  });

  it("renders every tag", () => {
    render(<ProjectCard project={project} accent="build" />);
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("Tailwind")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npx vitest run components/Shared/__tests__/ProjectCard.test.tsx`
Expected: FAIL — `Cannot find module '../ProjectCard'`.

- [ ] **Step 3: Implement the component**

Create `components/Shared/ProjectCard.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import type { ProjectContent } from "@/types/content";

interface ProjectCardProps {
  project: ProjectContent;
  accent: "build" | "animate";
}

export default function ProjectCard({ project, accent }: ProjectCardProps) {
  const accentOutline =
    accent === "build"
      ? "focus-visible:outline-accent-build"
      : "focus-visible:outline-accent-animate";

  return (
    <Link
      href={project.href}
      data-testid="project-card"
      data-accent={accent}
      className={`group block overflow-hidden rounded-card bg-base-raised transition-transform duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 ${accentOutline}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-6">
        <h3 className="font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold text-ink">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-ink/70">{project.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-pill bg-ink/5 px-3 py-1 text-xs text-ink/70"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npx vitest run components/Shared/__tests__/ProjectCard.test.tsx`
Expected: PASS — 6 tests passed.

- [ ] **Step 5: Run the full test suite and the build**

Run: `npm run test`
Expected: PASS — all test files (the hook from Task 2 and this component) pass.

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add components/Shared/ProjectCard.tsx components/Shared/__tests__/ProjectCard.test.tsx
git commit -m "feat: add shared ProjectCard component"
```

---

## Definition of Done

- [ ] `npm run build` succeeds.
- [ ] `npm run test` passes (hook + `ProjectCard` suites).
- [ ] The currently-live homepage at `/` still renders and behaves exactly as before this plan (visually unchanged — this plan added infrastructure, it did not redesign any page).
- [ ] Smooth scroll is felt on `/` and is disabled when `prefers-reduced-motion: reduce` is emulated.
- [ ] `--font-cabinet-grotesk` and `--font-general-sans` custom properties resolve to non-empty values in the browser.
- [ ] `bg-ink`, `text-ink`, `bg-base`, `bg-base-raised`, `bg-accent-build`, `bg-accent-animate`, `bg-band-dark`, `rounded-card`, `rounded-pill` are available Tailwind utilities (no build errors if referenced).
- [ ] `ease-out`, `ease-in-out`, `ease-drawer` are available Tailwind utilities using the spec's custom cubic-bezier curves (overriding Tailwind's weaker built-in `ease-out`/`ease-in-out`).
- [ ] `ProjectCard` renders correctly for both `accent="build"` and `accent="animate"` in its test suite.
