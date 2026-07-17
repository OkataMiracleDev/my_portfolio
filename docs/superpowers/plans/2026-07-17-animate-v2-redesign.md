# `/animate` v2 Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **Do not start this plan without first reading `docs/superpowers/specs/2026-07-17-animate-v2-redesign.md` in full**, especially §1 (the actual screenshot analysis this plan executes against) and §8's four open questions, which need answers before or at the start of Tasks 2, 3, and 6 below.

**Goal:** Fix the nav-legibility bug (both routes), give the `/animate` hero Kova/Daniel-Sun-style typographic and background treatment, de-stiffen the playground and gate it behind an explicit easter-egg toggle instead of a boxed grid, and restructure Featured Work into a scattered, per-project-framed layout with a new credentials block — per the spec.

**Status when this plan was written:** not started. All 4 prior redesign plans (Foundation, Landing, `/build`, `/animate` v1) are complete, tested, reviewed clean, and pushed to `origin/worktree-portfolio-redesign-foundation`. This is new work layered on top.

**Architecture:** `/build`'s Nav and `/animate`'s AnimateNav both get the same dark-pill treatment (Task 1) — the only cross-route change in this plan. Everything else touches `/animate` only. `motion` (Task 3) stays scoped strictly to `components/Animate/Playground/*`; nothing else in the codebase should import it.

**On testing:** Tasks 1, 2, 4, 5, 6, 7 are visual/layout changes with no new logic — verified by build + manual browser check, consistent with every prior plan's treatment of pure-CSS/layout work. Task 3 changes *how* the toys animate and *when* they're visible, not their accessible contract — existing Vitest suites for each toy must still pass unmodified; a new test is warranted for the toggle's reveal/hide state itself since that's new logic.

---

## File Structure

| File | Change | Task |
|---|---|---|
| `app/globals.css` | Modify | 1 |
| `components/Home/Navbar/Nav.tsx` | Modify | 1 |
| `components/Animate/AnimateNav.tsx` | Modify | 1 |
| `components/Animate/AnimateHero.tsx` | Modify | 2 |
| `components/Animate/HeroLightBeam.tsx` | Create | 2 |
| `components/Animate/HeroLottie.tsx` | Create (conditional, spec §8 Q1) | 2 |
| `public/lottie/hero-placeholder.json` | Create (conditional asset) | 2 |
| `package.json` | Modify | 2 (conditional), 3 |
| `components/Animate/Playground/PlaygroundRevealContext.tsx` | Create | 3 |
| `components/Animate/Playground/PlaygroundToggleButton.tsx` | Create | 3 |
| `components/Animate/Playground/PlaygroundToggle.tsx` | Modify | 3 |
| `components/Animate/Playground/PlaygroundMagneticButton.tsx` | Modify | 3 |
| `components/Animate/Playground/PlaygroundShapeMorph.tsx` | Modify | 3 |
| `components/Animate/Playground/InteractivePlayground.tsx` | Delete | 3 |
| `components/Animate/Playground/__tests__/PlaygroundRevealContext.test.tsx` | Create | 3 |
| `app/animate/page.tsx` | Modify | 3 |
| `components/Animate/CapabilitiesStrip.tsx` | Modify | 3, 4 |
| `components/Animate/AnimateFooter.tsx` | Modify | 3 |
| `components/Animate/HireCta.tsx` | Modify | 3, 4 |
| `components/Animate/FeaturedWork.tsx` | Modify | 4, 5, 7 |
| `components/Animate/CredentialsBlock.tsx` | Create | 6 |
| `components/Animate/AnimateTestimonials.tsx` | Modify | 4 |
| `components/Animate/ResourcesTeaser.tsx` | Modify | 4, 7 |
| `lib/fonts.ts` | Modify (conditional, spec §8 Q2) | 2, 4 |

---

### Task 1: Nav contrast fix (`/build` + `/animate`)

- [ ] **Step 1:** Add to `app/globals.css`'s `@theme` block, alongside `--color-band-dark`:

```css
--color-nav-dark: oklch(18% 0.02 55);
```

- [ ] **Step 2:** In `components/Home/Navbar/Nav.tsx`, replace the scroll-dependent className:

```tsx
className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[10000] rounded-pill px-4 py-3 transition-colors duration-200 ease-out ${
  navBg ? "bg-base-raised shadow-[0_4px_24px_rgb(0_0_0_/_0.08)]" : "bg-transparent"
}`}
```

with a permanently-dark pill:

```tsx
className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[10000] rounded-pill bg-nav-dark px-4 py-3 shadow-[0_4px_24px_rgb(0_0_0_/_0.08)]"
```

Change nav-link text color from `text-ink` to `text-base`. Remove the now-dead `navBg`/`setNavBg` state and its scroll-listener `useEffect`. Leave the "Blog" button as-is.

- [ ] **Step 3:** In `components/Animate/AnimateNav.tsx`, change `bg-base-raised` → `bg-nav-dark`, nav-link `text-ink` → `text-base`. Leave "Switch mode" as-is.

- [ ] **Step 4:** Run `npm run build` — expect success.

- [ ] **Step 5:** Manual check: on both `/build` and `/animate`, nav text is clearly legible against the dark pill immediately on load, independent of scroll position or browser dark-mode settings.

- [ ] **Step 6:** Commit: `git add app/globals.css components/Home/Navbar/Nav.tsx components/Animate/AnimateNav.tsx && git commit -m "fix: give nav a permanently-dark pill for reliable text contrast"`

---

### Task 2: Hero — mixed-type headline, light-beam background, live status line

**Resolve spec §8 Q1 (Lottie or not) and Q2 (italic axis availability) before this task.**

- [ ] **Step 1:** Check whether the self-hosted Cabinet Grotesk variable font (`public/fonts/CabinetGrotesk-Variable.woff2`, wired in `lib/fonts.ts`) includes an italic axis/instance. If yes, italics are just `font-style: italic` / an `italic` Tailwind class on the relevant span. If no, per the Q2 resolution: either add a second small accent font (running it through the same reflex-reject procedure the original spec's typography section used) or fall back to `font-style: oblique` deliberately, not by accident.

- [ ] **Step 2:** In `components/Animate/AnimateHero.tsx`, split the headline into two `<span>`s — the bulk of the phrase in the existing bold weight, the emotional/punchline word(s) in italic — matching Kova's "Our paths *just crossed*" pattern. Example: `Motion that means` (bold) + `something.` (italic).

- [ ] **Step 3:** Create `components/Animate/HeroLightBeam.tsx` — a large, soft-edged diagonal gradient sweep in `--accent-animate` at low opacity, positioned absolutely behind the hero's text content (Daniel Sun's gold-beam technique, in violet). Pure CSS gradient (`background: linear-gradient(...)` at an angle, or a rotated pseudo-element), no new dependency.

- [ ] **Step 4:** Replace the current `Motion Designer` status pill with a live status line per spec §3c: `Based remotely · [live local time] · Open to work`, in `font-[family-name:var(--font-jetbrains-mono)]`. Client-side clock via `useEffect` + `setInterval` (once a minute is enough — this is a texture detail, not a stopwatch).

- [ ] **Step 5 (conditional on §8 Q1):** If the Lottie is still wanted after Steps 1-4 are in: `npm install lottie-react`, source a placeholder Lottie JSON to `public/lottie/hero-placeholder.json`, create `components/Animate/HeroLottie.tsx` (respecting `prefers-reduced-motion` — render a static frame instead of playing), and place it in whatever hero space still reads as empty.

- [ ] **Step 6:** Run `npm run build` — expect success.

- [ ] **Step 7:** Manual check: headline reads with a clear bold/italic contrast on the punchline word; the violet light-beam is visible but doesn't fight the text for contrast; the status line shows a real, updating local time; hero no longer reads as having dead space on desktop.

- [ ] **Step 8:** Commit: `git add components/Animate/AnimateHero.tsx components/Animate/HeroLightBeam.tsx lib/fonts.ts && git commit -m "feat: mixed-type headline, light-beam background, live status line on /animate hero"` (add `package.json`/`package-lock.json`/`public/lottie`/`components/Animate/HeroLottie.tsx` to this commit too if Step 5 happened).

---

### Task 3: Playground — spring motion + easter-egg toggle (replaces v1's "scatter into sections")

**Resolve spec §8 Q3 (toggle button copy) before Step 3.**

- [ ] **Step 1:** Install the dependency: `npm install motion`

- [ ] **Step 2:** Create `components/Animate/Playground/PlaygroundRevealContext.tsx` — a small React context providing `{ revealed: boolean; toggle: () => void }`, default `revealed: false`.

- [ ] **Step 2b (test-first):** Create `components/Animate/Playground/__tests__/PlaygroundRevealContext.test.tsx` asserting: consumers see `revealed: false` by default; calling `toggle()` flips it to `true` and back to `false` on a second call. Run it, confirm it fails on module-not-found, then implement the context to make it pass.

- [ ] **Step 3:** Create `components/Animate/Playground/PlaygroundToggleButton.tsx` — a small pill button (copy resolved via §8 Q3) that calls the context's `toggle()`. Place it near the Hero (`components/Animate/AnimateHero.tsx`), wrapped in the context provider at a level that also reaches Capabilities/Featured Work/Hire-CTA-or-Footer (likely the provider needs to live in `app/animate/page.tsx` or a new small client wrapper around the whole page body).

- [ ] **Step 4:** Convert `PlaygroundMagneticButton.tsx` to `motion.button` + `useSpring`-driven x/y (stiffness ~150, damping ~15) instead of direct `style.transform` mutation. Keep the exact `aria-label`. Wrap its rendered output in a check against the reveal context — render `null` (or an `AnimatePresence`-managed exit) when not revealed.

- [ ] **Step 5:** Run its existing test: `npx vitest run components/Animate/Playground/__tests__/PlaygroundMagneticButton.test.tsx`. This test currently renders the component in isolation with no context provider — either wrap the test render in a `PlaygroundRevealContext.Provider value={{ revealed: true, toggle: () => {} }}` so the toy is visible for its own unit test (its own accessibility/behavior contract doesn't depend on where the app decides to show it), or export a version of the component that doesn't gate itself and let the *placement* (Step 3's wrapper) do the gating instead. Prefer the latter — keeps each toy's own test unchanged from Plan 4.

- [ ] **Step 6:** Convert `PlaygroundToggle.tsx`'s thumb to `motion.span` + `animate={{ x: checked ? 28 : 4 }}`, `transition={{ type: "spring", duration: 0.4, bounce: 0.35 }}`. Keep the outer `<button role="switch" aria-checked={checked}>` as a plain button, not `motion.button`.

- [ ] **Step 7:** Run its test — expect PASS, unmodified, 3/3.

- [ ] **Step 8:** Convert `PlaygroundShapeMorph.tsx`'s shape to `motion.div` animating `borderRadius`/`rotate` via `animate={{ borderRadius: morphed ? "9999px" : "12px", rotate: morphed ? 45 : 0 }}`, `transition={{ type: "spring", duration: 0.6, bounce: 0.25 }}`. Keep `data-testid="morph-shape"`/`data-morphed={morphed}` exactly as-is.

- [ ] **Step 9:** Run its test — expect PASS, unmodified, 2/2.

- [ ] **Step 10:** Delete `components/Animate/Playground/InteractivePlayground.tsx` (`git rm`). Wire the four toys into their new homes per spec §4: `PlaygroundToggle` near the Hero's toggle button itself (a small flourish next to it), `PlaygroundSlider` in `CapabilitiesStrip.tsx`, `PlaygroundMagneticButton` in `FeaturedWork.tsx`, `PlaygroundShapeMorph` in `HireCta.tsx` or `AnimateFooter.tsx`. Each reads `revealed` from context and animates in with a stagger (30-80ms offset per toy based on its position down the page) rather than all four popping in at once.

- [ ] **Step 11:** Update `app/animate/page.tsx`: remove the `InteractivePlayground` import, add the `PlaygroundRevealContext` provider wrapping the page body.

- [ ] **Step 12:** Run the full suite (`npm run test`) and build (`npm run build`) — expect all green.

- [ ] **Step 13:** Manual check: toggle is hidden by default (toys not visible); clicking it reveals all four toys in their new locations with a staggered entrance; each toy still works via mouse and keyboard; clicking again hides them; each toy has a noticeably springier feel than the previous linear transitions.

- [ ] **Step 14:** Commit: `git add package.json package-lock.json components/Animate app/animate/page.tsx && git commit -m "feat: gate playground toys behind an easter-egg toggle, convert to spring motion"`

---

### Task 4: Typography scale-up sweep

- [ ] **Step 1:** Increase the hero headline's scale beyond whatever Task 2 landed at, toward Daniel Sun's near-full-viewport-width treatment (fluid `clamp()`).

- [ ] **Step 2:** Apply the mono-for-metadata pattern (already used for the hero's status line, Task 2) consistently to any other `/animate` label-not-headline text: section eyebrows, the new credentials block's labels (Task 6), tag chips.

- [ ] **Step 3:** Apply the bold+italic headline treatment (Task 2's pattern) to at least one more major heading — Featured Work's section heading is the best candidate.

- [ ] **Step 4:** Run `npm run build` — expect success.

- [ ] **Step 5:** Manual check: the hero headline is clearly the single biggest type moment on the page; mono metadata labels read consistently distinct from headline/body type across the whole route.

- [ ] **Step 6:** Commit: `git add components/Animate && git commit -m "redesign: scale up hero type, apply mono-metadata and bold+italic patterns across /animate"`

---

### Task 5: Featured Work — scattered, per-project-framed layout

- [ ] **Step 1:** Replace `FeaturedWork.tsx`'s uniform 3-column `ProjectCard` grid with a scattered layout: each of the 3 placeholder projects at a different size/vertical offset, tilted a few degrees (alternating `rotate-2`/`-rotate-3`), white/light-bordered — matching Daniel Sun's Polaroid treatment, sitting on the section's own background rather than in a shared container grid.

- [ ] **Step 2:** Give each of the 3 projects a **different presentation frame**, per Kova's per-project-custom-chrome pattern: e.g. project 1 in a plain rounded card (like Daniel Sun's app-icon-on-dark-card treatment), project 2 inside a laptop-bezel frame around its thumbnail, project 3 inside a phone-frame. Since all three are placeholder content (`/images/null-project.jpg`), this establishes the *pattern* now so swapping in real reel screenshots later is a content change, not a layout change.

- [ ] **Step 3:** Keep each card's existing link behavior (→ `/animate/projects/[slug]`), title, and tag chips — this task changes presentation, not the data or navigation.

- [ ] **Step 4:** Run `npm run build` — expect success.

- [ ] **Step 5:** Manual check: the three projects read as intentionally scattered and individually framed, not a repeated card template; all three still link correctly and are keyboard-reachable.

- [ ] **Step 6:** Commit: `git add components/Animate/FeaturedWork.tsx && git commit -m "redesign: scattered per-project framing for Featured Work"`

---

### Task 6: Credentials block

**Resolve spec §8 Q4 (real vs. clearly-fictional placeholder numbers) before this task.**

- [ ] **Step 1:** Create `components/Animate/CredentialsBlock.tsx` — a stat grid living inside or immediately after the existing `bg-band-dark` section in `FeaturedWork.tsx` (not a second separate dark section — reuses the one sanctioned dark band from the original spec). Mono labels above, large numbers below, thin horizontal divider rules between rows, matching Kova's "Bragging rights" treatment. Numbers/labels come from the §8 Q4 resolution; mark clearly as placeholder in a code comment if fictional, consistent with every other placeholder value on this route.

- [ ] **Step 2:** Wire `CredentialsBlock` into `FeaturedWork.tsx` (or directly into `app/animate/page.tsx` immediately after it, whichever reads better once Task 5's scattered layout is in).

- [ ] **Step 3:** Run `npm run build` — expect success.

- [ ] **Step 4:** Manual check: the credentials block reads cleanly against the dark band, doesn't visually compete with the scattered project cards above it.

- [ ] **Step 5:** Commit: `git add components/Animate/CredentialsBlock.tsx components/Animate/FeaturedWork.tsx && git commit -m "feat: add credentials/stats block to Featured Work band"`

---

### Task 7: Motion pass — stagger reveals and section transitions

- [ ] **Step 1:** Add GSAP ScrollTrigger stagger reveals (30–80ms between items) to Featured Work's scattered cards (Task 5) and `ResourcesTeaser.tsx`'s resource list, if not already present.

- [ ] **Step 2:** Smooth the transition into/out of the dark band (now including the credentials block from Task 6) rather than an abrupt color cut — reuse the existing GSAP `scrollTrigger` heading-reveal pattern, extended to the section wrapper's background if that reads better than a hard cut.

- [ ] **Step 3:** Run `npm run build` and `npm run test` — expect both green.

- [ ] **Step 4:** Manual check: scroll the whole page; cards/list items stagger in rather than popping in at once; the dark-band transition feels considered; `prefers-reduced-motion: reduce` still suppresses all of this per the existing site-wide convention.

- [ ] **Step 5:** Commit: `git add components/Animate && git commit -m "feat: add stagger reveals and smoother section transitions to /animate"`

---

## Definition of Done

- [ ] `npm run build` and `npm run test` both succeed.
- [ ] Nav text is legible on both `/build` and `/animate` regardless of scroll position or browser dark-mode settings.
- [ ] The hero has a mixed bold+italic headline, a violet light-beam background, and a live-updating mono status line; the "dead space" complaint is resolved (with or without a Lottie, per §8 Q1's resolution).
- [ ] All four playground toys use spring-based motion, are hidden by default, and reveal (staggered) only after the easter-egg toggle is activated — no boxed "Interactive Playground" grid section remains.
- [ ] Each playground toy keeps its original accessible role/name and its original Vitest suite passes unmodified.
- [ ] Featured Work presents its 3 projects scattered and tilted, each in a distinct device/card frame, not a uniform grid.
- [ ] A credentials/stats block exists inside the dark band, using placeholder-honest (clearly labeled if fictional) numbers.
- [ ] Mono-for-metadata and bold+italic-headline are applied consistently as repeated signatures, not one-off details.
- [ ] `motion` (Framer Motion) is imported only inside `components/Animate/Playground/*`.
- [ ] `lottie-react`, if added at all, is used only for the hero placeholder (§8 Q1).
