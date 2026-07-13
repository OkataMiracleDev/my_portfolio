# Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/` the new mode-select landing page, relocate the existing (unredesigned) dev portfolio to `/build` with zero content or visual changes, and build the landing page itself — header, hero, fun-stuff strip, the two route-choice cards, footer — per spec §9.

**Architecture:** This plan depends on Plan 1 (Design System Foundation) being complete — it uses the design tokens, fonts, and motion tokens from that plan. Two things happen: (1) a mechanical relocation of every existing dev-site route under `/build/*`, with internal links fixed so nothing 404s, and (2) the new landing page built fresh at `/`. The root layout (`app/layout.tsx`) shrinks to only what's truly shared (fonts, smooth scroll, toast host, speed insights) — the dev site's nav and theme toggle move into a new `app/build/layout.tsx` so they only render on `/build/*`, matching the "fully distinct shells per route" decision in spec §5. (The spec's file-structure sketch in §5 shows route groups like `app/(build)/build/...` — this plan uses plain nested folders, `app/build/layout.tsx` + `app/build/page.tsx`, instead. Route groups only matter when you need a layout boundary *without* adding a URL segment; `/build` already has its own segment to hang a layout off of, so the parens add nothing here. Same outcome — distinct shell per route — simpler mechanism.)

**Deviation from spec §9, with reason:** the landing header omits the theme toggle. Dark mode is an explicit non-goal/stretch item (spec §3) and no dark variant of the new light-minimal tokens exists yet — wiring up a toggle with nowhere for the "dark" state to go would be broken, not delightful. `ThemeToggle` moves into `app/build/layout.tsx` only, where it keeps working exactly as it does today against the existing dark-purple theme. Revisit this once/if dark mode for the new identity is scoped.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, the design tokens/fonts/hook from Plan 1.

---

## File Structure

| File | Change | Responsibility |
|---|---|---|
| `app/page.tsx` | Replace | Was the dev homepage route; becomes the new landing page route |
| `app/build/page.tsx` | Create (moved) | Dev homepage, content unchanged, relocated from `app/page.tsx` |
| `app/build/layout.tsx` | Create | Wraps `/build/*` with the existing `Nav` + `ThemeToggle`, unchanged |
| `app/build/blog/page.tsx` | Create (moved) | Relocated from `app/blog/page.tsx`, unchanged |
| `app/build/projects/page.tsx` | Create (moved) | Relocated from `app/projects/page.tsx`, internal links fixed |
| `app/build/projects/[projectID]/page.tsx` | Create (moved) | Relocated from `app/projects/[projectID]/page.tsx`, internal links fixed |
| `app/layout.tsx` | Modify | Shrink to shared shell only: fonts, `SmoothScroll`, `Toaster`, `SpeedInsights`; remove `Nav`/`ThemeToggle`/Person JSON-LD (all move to route-specific homes) |
| `components/Home/HomeProjects/HomeProjects.tsx` | Modify | Fix `/projects` link → `/build/projects` |
| `data/data.ts` | Modify | Fix `homeprojectsData` full-path `projectID` values → `/build/projects/*` |
| `components/Home/Navbar/Nav.tsx` | Modify | Fix `/blog` navigation → `/build/blog` |
| `constant/constant.tsx` | Modify | Fix nav-link URLs (`/` → `/build`, `/#about` → `/build#about`) |
| `data/landing.ts` | Create | Fun-fact cards + the two route-choice descriptions |
| `components/Landing/RouteChoiceCard.tsx` | Create | The Build/Animate choice card — highest-value click on the site |
| `components/Landing/__tests__/RouteChoiceCard.test.tsx` | Create | Tests for `RouteChoiceCard` |
| `components/Landing/LandingHeader.tsx` | Create | Name mark + quiet contact link |
| `components/Landing/LandingHero.tsx` | Create | Name, status pill, one-line pitch |
| `components/Landing/FunStuffGrid.tsx` | Create | 3-4 card personality strip |
| `components/Landing/RouteChoiceSection.tsx` | Create | Wraps the two `RouteChoiceCard`s |
| `components/Landing/LandingFooter.tsx` | Create | Email/socials/copyright |
| `components/Landing/Landing.tsx` | Create | Composes the above into the full landing page |

---

### Task 1: Relocate the dev site to `/build`

Pure relocation — no visual or content changes. Every existing page keeps working, just under a new URL prefix. This must happen before Task 4, which claims `app/page.tsx` for the new landing page.

**Files:** see table above (all the "moved" and link-fix rows).

- [ ] **Step 1: Move the page files, preserving git history**

```bash
mkdir -p app/build
git mv app/page.tsx app/build/page.tsx

mkdir -p app/build/blog
git mv app/blog/page.tsx app/build/blog/page.tsx
rmdir app/blog

mkdir -p app/build/projects
git mv app/projects/page.tsx app/build/projects/page.tsx

mkdir -p "app/build/projects/[projectID]"
git mv "app/projects/[projectID]/page.tsx" "app/build/projects/[projectID]/page.tsx"
rmdir "app/projects/[projectID]"
rmdir app/projects
```

- [ ] **Step 2: Fix internal links in the moved projects listing page**

In `app/build/projects/page.tsx`, change:

```tsx
              href={`/projects/${project.projectID}`}
```
to:
```tsx
              href={`/build/projects/${project.projectID}`}
```

And change:
```tsx
          <Link href="/" className="btn-secondary group inline-flex items-center gap-3">
```
to:
```tsx
          <Link href="/build" className="btn-secondary group inline-flex items-center gap-3">
```

- [ ] **Step 3: Fix internal link in the moved project detail page**

In `app/build/projects/[projectID]/page.tsx`, change:

```tsx
            <Link href="/projects" className="btn-secondary inline-flex items-center gap-2">
```
to:
```tsx
            <Link href="/build/projects" className="btn-secondary inline-flex items-center gap-2">
```

- [ ] **Step 4: Fix the dev homepage's project links**

In `components/Home/HomeProjects/HomeProjects.tsx`, change:

```tsx
            href="/projects"
```
to:
```tsx
            href="/build/projects"
```

Also fix `data/data.ts`: `homeprojectsData` stores each project's link target in its own `projectID` field as a full path (not a bare slug like `projectsData` uses) — e.g. `projectID: "/projects/NEM"`. `components/Home/HomeProjects/ProjectsCard.tsx` navigates with `router.push(`${projects.projectID}`)`, using that value directly. Left as `/projects/NEM` it would 404 once `/projects` moves to `/build/projects`. In `data/data.ts`, in the `homeprojectsData` array, change:

```ts
    projectID: "/projects/NEM",
```
to:
```ts
    projectID: "/build/projects/NEM",
```

and change:

```ts
    projectID: "/projects/try-unihub",
```
to:
```ts
    projectID: "/build/projects/try-unihub",
```

(`projectsData`, the separate array used by `/build/projects` and `/build/projects/[projectID]`, stores bare slugs like `"NEM"` rather than full paths — that array needs no change here.)

- [ ] **Step 5: Fix the nav's Blog button**

In `components/Home/Navbar/Nav.tsx`, change:

```tsx
          onClick={() => router.push("/blog")}
```
to:
```tsx
          onClick={() => router.push("/build/blog")}
```

- [ ] **Step 6: Fix the nav-link URLs**

In `constant/constant.tsx`, change the first two `navLinks` entries:

```tsx
  {
    id: 1,
    label: <RiHome9Line className="text-2xl" />,
    url: "/",
  },
  {
    id: 2,
    label: <CgProfile className="text-2xl" />,
    url: "/#about",
  },
```
to:
```tsx
  {
    id: 1,
    label: <RiHome9Line className="text-2xl" />,
    url: "/build",
  },
  {
    id: 2,
    label: <CgProfile className="text-2xl" />,
    url: "/build#about",
  },
```

(No change needed elsewhere — `components/Home/About/About.tsx` already has `id='about'` on its root `<section>`, so `/build#about` resolves correctly.)

- [ ] **Step 7: Create the `/build` layout carrying the existing Nav + ThemeToggle**

Create `app/build/layout.tsx`:

```tsx
import Nav from "@/components/Home/Navbar/Nav";
import ThemeToggle from "@/components/ThemeToggle";

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeToggle />
      <Nav />
      {children}
    </>
  );
}
```

- [ ] **Step 8: Shrink the root layout to the shared shell only**

Replace the full contents of `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { cabinetGrotesk, generalSans } from "@/lib/fonts";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Okata Miracle",
  description: "Okata Miracle — frontend developer and motion designer.",
  authors: [{ name: "Okata Miracle" }],
  creator: "Okata Miracle",
  publisher: "Okata Miracle",
  metadataBase: new URL("https://www.okata-miracle.site"),
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${cabinetGrotesk.variable} ${generalSans.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
      </head>
      <body style={{ fontFamily: "var(--font-space-grotesk)" }}>
        <SmoothScroll />
        {children}
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: 'oklch(0.22 0.04 285)',
              color: 'oklch(0.98 0.01 285)',
              border: '1px solid oklch(0.35 0.05 285 / 0.3)',
            },
          }}
        />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

Note: the page-level `metadata` export already in `app/build/page.tsx` ("Portfolio | Okata Miracle - Front-End Developer") overrides this root fallback for `/build`, so the dev homepage's SEO title is unaffected. `app/build/projects/[projectID]/page.tsx` has no metadata export of its own and will fall back to this generic root metadata for now — that per-page SEO gap is tracked for the `/build` redesign plan, not fixed here, since fixing it well means writing per-project titles/descriptions, which is a content task, not a routing task.

- [ ] **Step 9: Verify the build succeeds**

Run: `npm run build`
Expected: Build succeeds. `/build`, `/build/blog`, `/build/projects`, and `/build/projects/[projectID]` all appear in the route list; `/`, `/blog`, `/projects` (old paths) do not.

- [ ] **Step 10: Verify manually in the browser**

Run: `npm run dev`. Visit `http://localhost:3000/build` — the full dev homepage should render exactly as it did before this task (same content, same nav, same theme toggle, same dark-purple styling). Click through: the nav's home icon and Blog button, the About profile icon (should scroll to the About section), a project card **on the homepage itself** (the `homeprojectsData`-driven preview — this is the one that depends on the `data/data.ts` fix in Step 4; clicking it is the actual regression test for that fix), "View All Projects" through to `/build/projects`, then a project card there through to its detail page and back. Every link should resolve under `/build/*` with no 404s. Then visit `http://localhost:3000/` — at this point in the plan it will 404 or show a blank/broken page, since the new landing page doesn't exist until Task 4. That's expected mid-plan.

- [ ] **Step 11: Commit**

```bash
git add app/build app/layout.tsx components/Home/HomeProjects/HomeProjects.tsx components/Home/Navbar/Nav.tsx constant/constant.tsx data/data.ts
git status
```

Confirm the status shows the old `app/page.tsx`, `app/blog/`, `app/projects/` paths as deleted/renamed (not just the new paths as untracked) — `git mv` should have staged both sides of each rename automatically, but double-check before committing.

```bash
git commit -m "refactor: relocate dev site to /build, ahead of new landing page"
```

---

### Task 2: Landing page content data

**Files:**
- Create: `data/landing.ts`

- [ ] **Step 1: Create the data file**

Create `data/landing.ts`:

```ts
export interface FunFactCard {
  id: string;
  label: string;
  value: string;
}

// Placeholder copy — personalize before shipping. Keep it to 3-4 cards
// (spec §9): this is a teaser, not a full personality dump.
export const funFactCards: FunFactCard[] = [
  { id: "building", label: "Currently building", value: "This very site" },
  { id: "editing", label: "Currently editing", value: "A motion reel for a client brand" },
  { id: "based", label: "Based in", value: "Lagos, Nigeria" },
  { id: "status", label: "Status", value: "Open to new work" },
];

export interface RouteChoice {
  id: "build" | "animate";
  title: string;
  description: string;
  href: string;
  accent: "build" | "animate";
}

export const routeChoices: RouteChoice[] = [
  {
    id: "build",
    title: "Build",
    description:
      "Frontend development — Next.js, React, and interfaces built to convert.",
    href: "/build",
    accent: "build",
  },
  {
    id: "animate",
    title: "Animate",
    description:
      "Motion design — brand animation, UI micro-interactions, and free resources.",
    href: "/animate",
    accent: "animate",
  },
];
```

Note: the `/animate` href is a forward reference — that route doesn't exist until Plan 4. Following it before then will 404. This is expected mid-sequence between plans; Plan 4 makes it resolve.

- [ ] **Step 2: Verify the project type-checks**

Run: `npm run build`
Expected: succeeds with no type errors. No runtime test needed — this is a pure data/type file with no logic to assert against (the same reasoning as Plan 1's content-types task).

- [ ] **Step 3: Commit**

```bash
git add data/landing.ts
git commit -m "feat: add landing page content data"
```

---

### Task 3: `RouteChoiceCard` component

The single highest-value click on the entire site (spec §9), so it's the one landing-page piece that gets full TDD treatment — same pattern Plan 1 used for `ProjectCard`.

**Files:**
- Create: `components/Landing/RouteChoiceCard.tsx`
- Test: `components/Landing/__tests__/RouteChoiceCard.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `components/Landing/__tests__/RouteChoiceCard.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import RouteChoiceCard from "../RouteChoiceCard";
import type { RouteChoice } from "@/data/landing";

const buildChoice: RouteChoice = {
  id: "build",
  title: "Build",
  description: "Frontend development.",
  href: "/build",
  accent: "build",
};

describe("RouteChoiceCard", () => {
  it("renders the title and description", () => {
    render(<RouteChoiceCard choice={buildChoice} />);
    expect(screen.getByText("Build")).toBeInTheDocument();
    expect(screen.getByText("Frontend development.")).toBeInTheDocument();
  });

  it("links to the route's href", () => {
    render(<RouteChoiceCard choice={buildChoice} />);
    expect(screen.getByRole("link", { name: /Build/i })).toHaveAttribute(
      "href",
      "/build"
    );
  });

  it("marks the card with a build data-accent attribute", () => {
    render(<RouteChoiceCard choice={buildChoice} />);
    expect(screen.getByTestId("route-choice-card")).toHaveAttribute(
      "data-accent",
      "build"
    );
  });

  it("marks the card with an animate data-accent attribute for the animate variant", () => {
    const animateChoice: RouteChoice = {
      id: "animate",
      title: "Animate",
      description: "Motion design.",
      href: "/animate",
      accent: "animate",
    };
    render(<RouteChoiceCard choice={animateChoice} />);
    expect(screen.getByTestId("route-choice-card")).toHaveAttribute(
      "data-accent",
      "animate"
    );
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npx vitest run components/Landing/__tests__/RouteChoiceCard.test.tsx`
Expected: FAIL — `Cannot find module '../RouteChoiceCard'`.

- [ ] **Step 3: Implement the component**

Create `components/Landing/RouteChoiceCard.tsx`:

```tsx
import Link from "next/link";
import type { RouteChoice } from "@/data/landing";

interface RouteChoiceCardProps {
  choice: RouteChoice;
}

export default function RouteChoiceCard({ choice }: RouteChoiceCardProps) {
  const accentBg =
    choice.accent === "build" ? "bg-accent-build" : "bg-accent-animate";
  const accentOutline =
    choice.accent === "build"
      ? "focus-visible:outline-accent-build"
      : "focus-visible:outline-accent-animate";

  return (
    <Link
      href={choice.href}
      data-testid="route-choice-card"
      data-accent={choice.accent}
      className={`group relative block overflow-hidden rounded-card bg-base-raised p-8 transition-transform duration-[250ms] ease-out hover:-translate-y-1 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 ${accentOutline}`}
    >
      <span
        className={`mb-6 inline-block h-2 w-12 rounded-pill ${accentBg} transition-all duration-[250ms] ease-out group-hover:w-20`}
        aria-hidden="true"
      />
      <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold text-ink md:text-4xl">
        {choice.title}
      </h2>
      <p className="mt-3 text-base text-ink/70">{choice.description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink transition-transform duration-200 ease-out group-hover:translate-x-1">
        Enter
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npx vitest run components/Landing/__tests__/RouteChoiceCard.test.tsx`
Expected: PASS — 4 tests passed.

- [ ] **Step 5: Commit**

```bash
git add components/Landing/RouteChoiceCard.tsx components/Landing/__tests__/RouteChoiceCard.test.tsx
git commit -m "feat: add RouteChoiceCard component"
```

---

### Task 4: Assemble the landing page

Builds the remaining presentational pieces (header, hero, fun-stuff grid, route-choice section, footer), composes them, and wires the result into `app/page.tsx` with the landing page's own metadata and the `Person` JSON-LD (moved here from the root layout in Task 1, per spec §13).

**Files:**
- Create: `components/Landing/LandingHeader.tsx`
- Create: `components/Landing/LandingHero.tsx`
- Create: `components/Landing/FunStuffGrid.tsx`
- Create: `components/Landing/RouteChoiceSection.tsx`
- Create: `components/Landing/LandingFooter.tsx`
- Create: `components/Landing/Landing.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create the header**

Create `components/Landing/LandingHeader.tsx`:

```tsx
import Link from "next/link";

export default function LandingHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-6 md:px-12">
      <Link
        href="/"
        className="font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink"
      >
        Okata Miracle
      </Link>
      <Link
        href="/build#contact"
        className="rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
      >
        Say hello
      </Link>
    </header>
  );
}
```

(`/build#contact` resolves correctly — `components/Home/Contact/Contact.tsx` already has `id="contact"` on its root `<section>`.)

- [ ] **Step 2: Create the hero**

Create `components/Landing/LandingHero.tsx`:

```tsx
export default function LandingHero() {
  return (
    <section className="px-6 pb-16 pt-8 md:px-12 md:pb-24">
      <p className="mb-4 inline-flex items-center gap-2 rounded-pill border border-ink/15 px-4 py-1.5 text-sm font-medium text-ink/70">
        <span
          className="h-2 w-2 rounded-full bg-accent-build"
          aria-hidden="true"
        />
        Open to work
      </p>
      <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-5xl font-bold leading-[1.05] text-ink md:text-7xl">
        Okata Miracle
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink/70 md:text-xl">
        Frontend developer and motion designer. I build interfaces that
        work, then I make them move.
      </p>
    </section>
  );
}
```

- [ ] **Step 3: Create the fun-stuff grid**

Create `components/Landing/FunStuffGrid.tsx`:

```tsx
import type { FunFactCard } from "@/data/landing";

interface FunStuffGridProps {
  facts: FunFactCard[];
}

export default function FunStuffGrid({ facts }: FunStuffGridProps) {
  return (
    <section className="px-6 pb-16 md:px-12 md:pb-24">
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {facts.map((fact) => (
          <li
            key={fact.id}
            className="rounded-card bg-base-raised p-5 transition-transform duration-200 ease-out hover:-translate-y-1"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
              {fact.label}
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">
              {fact.value}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Create the route-choice section**

Create `components/Landing/RouteChoiceSection.tsx`:

```tsx
import { routeChoices } from "@/data/landing";
import RouteChoiceCard from "./RouteChoiceCard";

export default function RouteChoiceSection() {
  return (
    <section className="px-6 pb-16 md:px-12 md:pb-24">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {routeChoices.map((choice) => (
          <RouteChoiceCard key={choice.id} choice={choice} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create the footer**

Create `components/Landing/LandingFooter.tsx`:

```tsx
import Link from "next/link";
import { footLinks } from "@/constant/constant";

export default function LandingFooter() {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-ink/60 md:flex-row md:px-12">
      <p>© {new Date().getFullYear()} Okata Miracle. All rights reserved.</p>
      <div className="flex gap-6">
        {footLinks.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            className="transition-colors duration-200 ease-out hover:text-ink"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Compose the landing page**

Create `components/Landing/Landing.tsx`:

```tsx
import LandingHeader from "./LandingHeader";
import LandingHero from "./LandingHero";
import FunStuffGrid from "./FunStuffGrid";
import RouteChoiceSection from "./RouteChoiceSection";
import LandingFooter from "./LandingFooter";
import { funFactCards } from "@/data/landing";

export default function Landing() {
  return (
    <div className="min-h-screen bg-base">
      <LandingHeader />
      <LandingHero />
      <FunStuffGrid facts={funFactCards} />
      <RouteChoiceSection />
      <LandingFooter />
    </div>
  );
}
```

- [ ] **Step 7: Wire it into `app/page.tsx` with metadata and the Person JSON-LD**

Replace the full contents of `app/page.tsx` with:

```tsx
import type { Metadata } from "next";
import Landing from "@/components/Landing/Landing";

export const metadata: Metadata = {
  title: "Okata Miracle | Frontend Developer & Motion Designer",
  description:
    "Okata Miracle builds interfaces as a frontend developer and brings them to life as a motion designer. Explore dev work, motion reels, and free resources.",
  openGraph: {
    title: "Okata Miracle | Frontend Developer & Motion Designer",
    description:
      "Frontend developer and motion designer. Explore dev work, motion reels, and free resources.",
    url: "https://www.okata-miracle.site",
    siteName: "Okata Miracle",
    images: [
      {
        url: "https://www.okata-miracle.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "Okata Miracle - Frontend Developer & Motion Designer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Okata Miracle | Frontend Developer & Motion Designer",
    description: "Frontend developer and motion designer.",
    creator: "@mimi_codes",
    images: ["https://www.okata-miracle.site/og-image.png"],
  },
  alternates: {
    canonical: "https://www.okata-miracle.site",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Okata Miracle",
  jobTitle: ["Frontend Developer", "Motion Designer"],
  url: "https://www.okata-miracle.site",
  sameAs: [
    "https://github.com/OkataMiracleDev",
    "https://twitter.com/mimi_codes",
  ],
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Landing />
    </>
  );
}
```

- [ ] **Step 8: Run the full test suite and the build**

Run: `npm run test`
Expected: PASS — all suites from Plan 1 and Task 3 of this plan pass.

Run: `npm run build`
Expected: Build succeeds. Route list includes `/` (landing) and `/build/*`.

- [ ] **Step 9: Verify manually in the browser**

Run: `npm run dev`.

Visit `http://localhost:3000/` — the new landing page renders: header with name + "Say hello" link, hero with status pill and pitch, the fun-stuff grid, the two route-choice cards, footer. Click "Say hello" — lands on `/build` scrolled to the contact form. Click the **Build** card — navigates to `/build` and the existing dev homepage renders unchanged. Click the **Animate** card — this will 404 until Plan 4 ships; that's expected at this point in the sequence.

Tab through the page with the keyboard: the header link, "Say hello" link, both route-choice cards, and footer links should all be reachable and show a visible focus outline (the route-choice cards should show the outline in their own accent color — amber for Build, violet for Animate).

- [ ] **Step 10: Commit**

```bash
git add components/Landing app/page.tsx
git commit -m "feat: build the landing page"
```

---

## Definition of Done

- [ ] `npm run build` succeeds.
- [ ] `npm run test` passes (Plan 1's suites + `RouteChoiceCard`'s suite).
- [ ] `/` renders the new landing page; `/build` renders the untouched dev homepage.
- [ ] Every link that used to point at `/`, `/blog`, `/projects`, or `/projects/[id]` now correctly points at the `/build/*` equivalent, and none of them 404.
- [ ] The landing page's two route-choice cards are real `<a>` elements, keyboard-focusable, with visible per-route-accent focus states.
- [ ] The `Person` JSON-LD on `/` reflects both `jobTitle`s.
- [ ] Visiting `/animate` 404s (expected — that route ships in Plan 4).
