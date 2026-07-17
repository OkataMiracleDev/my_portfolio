# `/animate` v2 Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **Do not start this plan without first reading `docs/superpowers/specs/2026-07-17-animate-v2-redesign.md` in full** — it has the reasoning this plan executes against, plus three open questions in its §6 that should be resolved with the user before or at the start of Task 4/5/7 below.

**Goal:** Fix the nav-legibility bug (both routes), fill the hero's dead space with a placeholder Lottie, de-stiffen and de-grid the interactive playground, and take a bigger visual/motion swing on `/animate` inspired by kova.me and danielsun.space, per the spec.

**Status when this plan was written:** not started. All 4 prior redesign plans (Foundation, Landing, `/build`, `/animate` v1) are complete, tested, and reviewed clean on this branch (`worktree-portfolio-redesign-foundation`). This is new work layered on top, not a continuation of an in-flight plan.

**Architecture:** `/build`'s Nav and `/animate`'s AnimateNav both get the same dark-pill treatment (Task 1) — the only cross-route change in this plan. Everything else touches `/animate` only. The playground's move to spring-based motion (Task 3) introduces `motion` as a dependency scoped strictly to `components/Animate/Playground/*` — it must not leak into any other part of the codebase, which still uses GSAP exclusively.

**On testing:** Tasks 1, 4, 5, 6 are visual/layout changes with no new logic — verified by build + manual browser check, consistent with every prior plan's treatment of pure-CSS/layout work. Task 3's spring conversion changes *how* the toys animate but not their accessible contract (role, aria-*, accessible name) — the existing Vitest suites for each toy (`components/Animate/Playground/__tests__/*`) must still pass unmodified; if any assertion needs to change, that's a signal the a11y contract regressed and should be treated as a bug, not adapted around.

---

## File Structure

| File | Change | Task |
|---|---|---|
| `app/globals.css` | Modify | 1 |
| `components/Home/Navbar/Nav.tsx` | Modify | 1 |
| `components/Animate/AnimateNav.tsx` | Modify | 1 |
| `package.json` | Modify | 2, 3 |
| `public/lottie/hero-placeholder.json` | Create (asset) | 2 |
| `components/Animate/HeroLottie.tsx` | Create | 2 |
| `components/Animate/AnimateHero.tsx` | Modify | 2, 4 |
| `components/Animate/Playground/PlaygroundToggle.tsx` | Modify | 3, 4 |
| `components/Animate/Playground/PlaygroundMagneticButton.tsx` | Modify | 3, 4 |
| `components/Animate/Playground/PlaygroundShapeMorph.tsx` | Modify | 3, 4 |
| `components/Animate/Playground/InteractivePlayground.tsx` | Delete | 4 |
| `components/Animate/CapabilitiesStrip.tsx` | Modify | 4, 5 |
| `components/Animate/FeaturedWork.tsx` | Modify | 4, 5, 6 |
| `components/Animate/HireCta.tsx` | Modify | 4, 5 |
| `components/Animate/AnimateFooter.tsx` | Modify | 4 |
| `components/Animate/ResourcesTeaser.tsx` | Modify | 5, 6 |
| `app/animate/page.tsx` | Modify | 4 |

---

### Task 1: Nav contrast fix (`/build` + `/animate`)

- [ ] **Step 1:** Add the new token to `app/globals.css`'s `@theme` block, alongside `--color-band-dark`:

```css
--color-nav-dark: oklch(18% 0.02 55);
```

- [ ] **Step 2:** In `components/Home/Navbar/Nav.tsx`, change the mounted-state `<nav>` className from:

```tsx
className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[10000] rounded-pill px-4 py-3 transition-colors duration-200 ease-out ${
  navBg ? "bg-base-raised shadow-[0_4px_24px_rgb(0_0_0_/_0.08)]" : "bg-transparent"
}`}
```

to a permanently-dark pill (drop the `navBg` conditional entirely — the pill no longer needs two visual states):

```tsx
className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[10000] rounded-pill bg-nav-dark px-4 py-3 shadow-[0_4px_24px_rgb(0_0_0_/_0.08)]"
```

Change every nav-link text color in this file from `text-ink` to `text-base` (so text reads light-on-dark). Leave the "Blog" button (`bg-accent-build`) as-is. `navBg`/`setNavBg`/the scroll-listener `useEffect` become dead code — remove them along with the now-unconditional className.

- [ ] **Step 3:** In `components/Animate/AnimateNav.tsx`, change the `<nav>` className from `bg-base-raised` to `bg-nav-dark`, and change nav-link text color from `text-ink` to `text-base`. Leave "Switch mode" (`bg-accent-animate`) as-is.

- [ ] **Step 4:** Run `npm run build` — expect success.

- [ ] **Step 5:** Manual check: on both `/build` and `/animate`, confirm nav text (icons/links) is clearly legible against the dark pill immediately on page load (no dependency on scroll position or browser dark-mode settings).

- [ ] **Step 6:** Commit: `git add app/globals.css components/Home/Navbar/Nav.tsx components/Animate/AnimateNav.tsx && git commit -m "fix: give nav a permanently-dark pill for reliable text contrast"`

---

### Task 2: Hero Lottie placeholder

**Resolve spec §6 open question 1 first** (source vs. custom vs. skip-Lottie-entirely) if not already resolved.

- [ ] **Step 1:** Install the dependency: `npm install lottie-react`

- [ ] **Step 2 (manual):** Source a placeholder Lottie JSON file — abstract, motion/creative-flavored, free/permissive license, not tied to any real client or brand. Save to `public/lottie/hero-placeholder.json`.

- [ ] **Step 3:** Create `components/Animate/HeroLottie.tsx`:

```tsx
"use client";
import Lottie from "lottie-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import placeholderAnimation from "@/public/lottie/hero-placeholder.json";

export default function HeroLottie() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Lottie
      animationData={placeholderAnimation}
      loop={!prefersReducedMotion}
      autoplay={!prefersReducedMotion}
      className="pointer-events-none w-full max-w-md"
      aria-hidden="true"
    />
  );
}
```

(If the sourced file isn't a natural loop, set `loop={false}` unconditionally instead — see spec §2 on preferring a single satisfying play over a short jarring loop.)

- [ ] **Step 4:** In `components/Animate/AnimateHero.tsx`, place `<HeroLottie />` in the currently-empty right-hand space (the hero is presently a single-column `max-w-3xl` block with decorative blobs behind it — this likely means changing the section to a two-column layout on desktop, text left / Lottie right, collapsing to stacked on mobile). Keep the existing decorative blur blobs.

- [ ] **Step 5:** Run `npm run build` — expect success.

- [ ] **Step 6:** Manual check: hero's right side no longer reads as empty on desktop; the Lottie plays (or shows a static frame under emulated `prefers-reduced-motion: reduce`); layout still reads correctly on mobile.

- [ ] **Step 7:** Commit: `git add package.json package-lock.json public/lottie components/Animate/HeroLottie.tsx components/Animate/AnimateHero.tsx && git commit -m "feat: fill hero dead space with placeholder Lottie animation"`

---

### Task 3: Spring-based playground motion

- [ ] **Step 1:** Install the dependency: `npm install motion`

- [ ] **Step 2:** Convert `components/Animate/Playground/PlaygroundMagneticButton.tsx` to use `motion.button` + `useSpring`-driven x/y instead of direct `style.transform` mutation. Keep the exact same `aria-label`, and keep `onMouseDown`/`onMouseUp` press-state behavior. Rough shape:

```tsx
"use client";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function PlaygroundMagneticButton() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [pressed, setPressed] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      style={{ x: springX, y: springY }}
      aria-label="Demo magnetic button — for fun, no data is saved"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      animate={{ scale: pressed ? 0.95 : 1 }}
      transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
      className="rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink"
    >
      Try me
    </motion.button>
  );
}
```

- [ ] **Step 3:** Run its existing test: `npx vitest run components/Animate/Playground/__tests__/PlaygroundMagneticButton.test.tsx` — expect PASS, unmodified from Plan 4. If it fails, that's a real regression (likely the accessible name or clickability), not a test-needs-updating situation.

- [ ] **Step 4:** Convert `components/Animate/Playground/PlaygroundToggle.tsx`'s thumb animation from `transition-transform duration-200` to a `motion.span` with `animate={{ x: checked ? 28 : 4 }}` and `transition={{ type: "spring", duration: 0.4, bounce: 0.35 }}`. Keep the outer element a plain `<button role="switch" aria-checked={checked}>` — do not convert the button itself to `motion.button` here, there's no motion need on it beyond the background color transition it already has.

- [ ] **Step 5:** Run its test: `npx vitest run components/Animate/Playground/__tests__/PlaygroundToggle.test.tsx` — expect PASS, unmodified (3/3, including the keyboard-activation test — confirm a `motion.span` child doesn't interfere with the button's native keyboard handling).

- [ ] **Step 6:** Convert `components/Animate/Playground/PlaygroundShapeMorph.tsx`'s shape from a CSS `transition-all duration-500` div to a `motion.div` animating `borderRadius`/`rotate` via `animate={{ borderRadius: morphed ? "9999px" : "12px", rotate: morphed ? 45 : 0 }}` with `transition={{ type: "spring", duration: 0.6, bounce: 0.25 }}`. Keep `data-testid="morph-shape"` and `data-morphed={morphed}` exactly as they are — the test asserts on those attributes, not on computed style.

- [ ] **Step 7:** Run its test: `npx vitest run components/Animate/Playground/__tests__/PlaygroundShapeMorph.test.tsx` — expect PASS, unmodified (2/2).

- [ ] **Step 8:** Run the full suite (`npm run test`) and build (`npm run build`) — expect all green.

- [ ] **Step 9:** Manual check: each toy now has a noticeably springier, more physical feel than the previous linear `ease-out` transitions — the magnetic button should overshoot slightly and settle, the toggle thumb and morph shape should have a small bounce rather than a flat glide.

- [ ] **Step 10:** Commit: `git add package.json package-lock.json components/Animate/Playground && git commit -m "feat: convert playground toys to spring-based motion"`

---

### Task 4: Scatter the playground toys, retire the grid section

- [ ] **Step 1:** Delete `components/Animate/Playground/InteractivePlayground.tsx` (`git rm`) — its four children move into other sections per the spec §3b table; nothing else imports it once Step 2 lands.

- [ ] **Step 2:** Wire each toy into its new home (adjust each target component's JSX and, where useful, its layout to accommodate the toy without producing another uniform card):
  - `PlaygroundToggle` → `components/Animate/AnimateHero.tsx`, near the "Motion Designer" status pill.
  - `PlaygroundSlider` → `components/Animate/CapabilitiesStrip.tsx`, inside or beside one of the capability blocks.
  - `PlaygroundMagneticButton` → `components/Animate/FeaturedWork.tsx`, as a small beat between the section heading and the card grid (or after it — whichever reads better against the dark band).
  - `PlaygroundShapeMorph` → `components/Animate/HireCta.tsx` or `components/Animate/AnimateFooter.tsx` (spec allows either — pick whichever placement doesn't fight the CTA button for attention).

  Each toy keeps its own small `bg-base-raised`-or-similar wrapper sized to its new context, not the old uniform grid cell — no two toys should end up in visually identical containers.

- [ ] **Step 3:** Update `app/animate/page.tsx` to remove the `<InteractivePlayground />` import/usage (the toys are now rendered inside the sections that import them directly).

- [ ] **Step 4:** Run `npm run build` — expect success.

- [ ] **Step 5:** Run the existing playground tests once more (`npx vitest run components/Animate/Playground`) — expect all still PASS; relocating a component doesn't change its own test file's import path (`../PlaygroundX`) since the components didn't move, only their consumers changed.

- [ ] **Step 6:** Manual check: scroll the full `/animate` page top to bottom; each toy appears once, in its new section, still fully interactive via mouse and keyboard; no leftover empty "Interactive Playground" section remains.

- [ ] **Step 7:** Commit: `git add components/Animate app/animate/page.tsx && git commit -m "refactor: scatter playground toys into their sections, retire grid layout"`

---

### Task 5: Typography + layout pass

This is the most open-ended task — the spec (§4) intentionally leaves exact values to implementation-time judgment rather than prescribing pixel values, since it's a creative pass. Before starting, resolve spec §6 open question 3 (confirm the reference-site direction still matches what's live today).

- [ ] **Step 1:** Increase the hero headline's scale beyond the current `text-6xl md:text-8xl` — aim for something that reads as closer to filling the viewport width on desktop (fluid `clamp()`, consistent with how the rest of the site already sizes display type).

- [ ] **Step 2:** Widen the type-scale gap between section headings and body copy specifically on `/animate` (target ~1.5–2× rather than the site-wide ≥1.25 floor) across `CapabilitiesStrip`, `FeaturedWork`, `AnimateTestimonials`, `ResourcesTeaser`, `HireCta`.

- [ ] **Step 3:** Loosen the copy tone across these same components — shorter, more direct, a little personality (no em dashes, per impeccable's copy rule — use periods/commas instead).

- [ ] **Step 4:** Break the repeated `section` → `max-w-Nxl mx-auto` → centered-block pattern in at least two or three sections — vary container width, text alignment, or introduce an asymmetric two-column moment instead of every section being a centered stack.

- [ ] **Step 5:** Vary vertical rhythm between sections (tighter around the relocated playground toys, more spacious around the hero and Featured Work band) rather than the current flat `.section` padding everywhere.

- [ ] **Step 6:** Run `npm run build` — expect success.

- [ ] **Step 7:** Manual check: scroll the full page; it should read as a more varied, editorial scroll rather than a stack of near-identical sections; nothing should feel cramped or broken at mobile widths.

- [ ] **Step 8:** Commit: `git add components/Animate && git commit -m "redesign: bigger editorial type and asymmetric layout pass on /animate"`

---

### Task 6: Motion pass — stagger reveals and section transitions

- [ ] **Step 1:** Add GSAP ScrollTrigger stagger reveals (30–80ms between items, matching the pattern already used elsewhere in this codebase, e.g. `components/Home/HomeProjects/HomeProjects.tsx`) to `FeaturedWork.tsx`'s card grid and `ResourcesTeaser.tsx`'s resource list, if they don't already have one.

- [ ] **Step 2:** Resolve spec §6 open question 2 (second tinted/dark band — Testimonials or Resources teaser, or neither) and implement if the user confirms a preference; skip this step cleanly (no half-applied styling) if the answer is neither.

- [ ] **Step 3:** Smooth the transition into/out of the dark band(s) (Featured Work, plus the new one if added in Step 2) rather than an abrupt color cut — reuse the existing GSAP `scrollTrigger` heading-reveal pattern, extended to the section wrapper's background if that reads better than a hard cut.

- [ ] **Step 4:** Run `npm run build` and `npm run test` — expect both green.

- [ ] **Step 5:** Manual check: scroll through the whole page; list/grid sections stagger in rather than popping in all at once; transitions into dark band(s) feel considered, not jarring; `prefers-reduced-motion: reduce` still suppresses all of this per the existing site-wide convention.

- [ ] **Step 6:** Commit: `git add components/Animate && git commit -m "feat: add stagger reveals and smoother section transitions to /animate"`

---

## Definition of Done

- [ ] `npm run build` and `npm run test` both succeed.
- [ ] Nav text is legible on both `/build` and `/animate` regardless of scroll position or browser dark-mode settings.
- [ ] The hero's previously-empty space now holds a placeholder Lottie (or the user-confirmed alternative from spec §6 Q1), respecting `prefers-reduced-motion`.
- [ ] All four playground toys use spring-based motion and no longer read as stiff; each keeps its original accessible role/name and its original Vitest suite passes unmodified.
- [ ] No dedicated "Interactive Playground" grid section remains — the four toys are distributed into Hero, Capabilities, Featured Work, and Hire CTA/Footer respectively.
- [ ] `/animate`'s typography, layout rhythm, and copy tone read as a deliberate editorial pass, not a uniform repeated-section template.
- [ ] Featured Work and Resources teaser reveal with a staggered animation on scroll.
- [ ] `motion` (Framer Motion) is imported only inside `components/Animate/Playground/*` — nowhere else in the codebase.
- [ ] `lottie-react` is used only for the hero placeholder.
