# `/animate` v2 Redesign — Design Spec

**Date**: 2026-07-17
**Status**: Draft, pending user review (produced for cross-device handoff — not yet approved or implemented)
**Author**: Design session (Claude, impeccable + emil-design-eng skills; supersedes/amends parts of `2026-07-10-portfolio-redesign-design.md` §6, §7, §11)
**Supersedes**: `docs/superpowers/specs/2026-07-10-portfolio-redesign-design.md` §7 (motion), §11 (`/animate` home structure) where noted below. Everything else in the original spec still stands.

## 0. Why this spec exists

Plan 4 shipped `/animate` per the original spec, reviewed clean, all tests passing. Live user feedback on the shipped result raised four issues the original spec didn't anticipate:

1. Nav text is illegible on both `/build` and `/animate` under real browser conditions (see §1).
2. The hero's off-content side is dead space.
3. The interactive playground reads as stiff/mechanical, and bundling all four toys into one boxed grid section undercuts the "found in the wild, not a demo booth" feeling the user actually wants.
4. The whole `/animate` route should take a bigger swing, stylistically — closer to editorial, motion-portfolio sites like kova.me and danielsun.space than to the current "reskinned SaaS-card layout."

This document is a spec for that second pass, written so implementation can resume on a different device without re-deriving context. It does not change `/build` (aside from the shared nav-contrast fix in §1) or the landing page.

**Research caveat**: kova.me and danielsun.space are both JS-rendered SPAs; a text-based fetch of their markup returned almost nothing usable (page titles and a rough section list, no real color/type/motion detail — see the raw results quoted in §4). The direction in §4 is built from the impeccable/emil design frameworks plus general familiarity with that aesthetic family (oversized editorial type, vertical narrative scroll, playful conversational copy, minimal top nav, frequent friendly CTAs), not a pixel audit of the live sites. **Before implementing §4, open both sites yourself and sanity-check the direction below against what's actually live now** — treat this spec as a strong starting brief, not a transcription.

## 1. Nav contrast fix (both `/build` and `/animate`)

**Root cause of the illegibility bug**: the nav pill's background (`bg-base-raised`, ~99% lightness) sits almost flush against the page background (`bg-base`, ~97% lightness) and relies on browser-default text rendering for contrast. Some browsers' "force dark mode for web content" heuristics (Edge/Chrome) partially override even `color-scheme: light`-declared pages for text specifically, washing out plain-text nav links while leaving strongly-saturated elements (buttons, colored icons) untouched — which is exactly the pattern in the reported screenshots.

**Fix**: stop relying on a near-white pill for contrast. Give the nav an actually-dark, opaque surface so legibility doesn't depend on any browser heuristic cooperating.

New token (add to `app/globals.css` `@theme` block, alongside the existing `--color-band-dark`):

```css
--color-nav-dark: oklch(18% 0.02 55); /* warm near-black, tinted like --color-ink, not pure black */
```

Both `components/Home/Navbar/Nav.tsx` (`/build`) and `components/Animate/AnimateNav.tsx` (`/animate`) change their pill background from `bg-base-raised` (scrolled state) / `bg-transparent` (top state) to a **permanently dark** pill: `bg-nav-dark`, with nav link text in `text-base` (near-white on the dark pill, not `text-ink`). This makes the nav read the same regardless of scroll position (simpler state, one fewer thing to get wrong) and independent of any browser dark-mode heuristic, since the pill is now genuinely dark rather than accidentally washed-out-light.

Accent buttons inside the nav (`/build`'s "Blog" button, `/animate`'s "Switch mode" button) keep their existing accent-colored pill treatment — they already have sufficient contrast and don't need to change.

## 2. Hero: fill the dead space

`AnimateHero.tsx`'s right-hand side currently has two blurred decorative blobs and otherwise nothing — on wide viewports this reads as an unfinished, empty half of the screen (per the screenshot).

**Fix**: add a placeholder Lottie animation occupying that space, following the same placeholder-honesty pattern as the rest of `/animate`'s content (spec §12 of the original doc) — a generic, license-clear motion-design-flavored loop (e.g. an abstract shape-morph or a simple line-art animation), clearly a placeholder, swapped for a real showreel-style Lottie (or eventually a real embedded reel) once one exists. Do not source it from a real client's work.

- New dependency: `lottie-react` (thin, actively maintained wrapper around `lottie-web`; renders to SVG so it stays crisp and themeable, unlike a baked video/gif).
- The Lottie plays once on mount (not looping indefinitely) unless the sourced placeholder file is specifically a loop — a single satisfying play matches the "explanatory/rare" tier of emil's animation-frequency framework (see reference/emil framework: rare-seen animations can carry more visual weight); if it must loop, keep the loop long (8s+) and low-motion so it doesn't compete with the headline for attention.
- Respect `prefers-reduced-motion`: render the Lottie's last frame as a static image instead of playing it (same pattern already used by `usePrefersReducedMotion` elsewhere in this codebase).
- Keep the two existing decorative blur blobs — the Lottie replaces the empty space, not the existing ambient motion.

## 3. Playground: de-stiffen and de-grid

Two separate changes:

### 3a. Motion quality

The original spec (§7) already called for the playground toys to use **spring** motion (`{ type: "spring", duration: 0.5, bounce: 0.2–0.3 }`), not CSS `ease-out` transitions. Plan 4's actual implementation used plain `transition-transform duration-200 ease-out` everywhere — that gap is exactly why it reads as stiff now. This pass corrects it to match the original intent:

- **New, narrowly-scoped dependency**: `motion` (the current name for Framer Motion) — but **only** imported inside `components/Animate/Playground/*`. This does not reopen the "replace GSAP" decision the original spec rejected (§8) — GSAP remains the backbone everywhere else (scroll-triggered reveals, the Experience card-deck). This is a small, contained addition for the one part of the site where real spring physics measurably improves the feel, per emil-design-eng's explicit guidance that decorative mouse-tracking/press interactions should use `useSpring`, not instant/linear updates.
- `PlaygroundMagneticButton`: replace the direct `style.transform` mutation in `handleMouseMove` with `motion.button` + `useSpring`-interpolated x/y (stiffness ~150, damping ~15) so the button has real momentum and settle, not an instant snap-to-cursor.
- `PlaygroundToggle`: keep it a plain `<button role="switch">` (a11y contract from the original spec must not regress), but animate the thumb's position with a spring (`type: "spring", duration: 0.4, bounce: 0.35`) instead of the current `transition-transform duration-200`.
- `PlaygroundShapeMorph`: spring the `rotate`/`borderRadius` change (`type: "spring", duration: 0.6, bounce: 0.25`) instead of `transition-all duration-500 ease-in-out`.
- `PlaygroundSlider`: stays a native `<input type="range">` (a11y contract, unchanged) — no spring needed here, the browser's own thumb drag already feels physical.
- Every toy keeps its existing `role`/`aria-*`/accessible-name contract and existing Vitest coverage untouched — this is a motion-quality change, not a behavior change, matching how Plan 3 handled "reskin only, logic byte-for-byte" work.

### 3b. Stop grid-bundling the toys

Per direct feedback: the four toys should not live in one boxed "Interactive Playground" grid section. Retire `InteractivePlayground.tsx` as a single composed block. Instead, scatter the four toys as small, individually-labeled "found" moments woven into other `/animate` sections (the "just for fun, no data saved" a11y-label contract stays on each toy regardless of where it's placed):

| Toy | New home |
|---|---|
| `PlaygroundToggle` | Tucked into a corner of the Hero (§2), e.g. near the status pill — a tiny "the lights are on" gesture on the very first section a visitor sees. |
| `PlaygroundSlider` | Embedded inside the Capabilities strip, as if it's controlling something illustrative (it isn't wired to anything real — still an honest "just for fun" control, labeled as such). |
| `PlaygroundMagneticButton` | Placed near the Featured Work band (§11 of the original spec) — a playful beat between the portfolio-proof section and the testimonials. |
| `PlaygroundShapeMorph` | Near the Hire CTA / footer — a small "still here? try this" closing gesture. |

Each toy's wrapping presentational markup (the `bg-base-raised` card + label the old grid provided) moves with it into whichever section now hosts it, sized appropriately to that section rather than a uniform grid cell — this is also where impeccable's "cards are the lazy answer, avoid identical repeated cards" rule gets applied: no two toys should sit in visually identical containers anymore.

## 4. Full `/animate` visual pass — impeccable + emil-design-eng direction

`/animate` is a **brand-register** page (design IS the product — a motion designer's portfolio is itself a demonstration of craft), which under impeccable's rules means it should not default to "Restrained" color strategy. Right now it effectively is restrained (violet shows up only as small accents: a status dot, tag chips, thin CTA borders). This pass moves it to **Committed**: one saturated color (the existing `--accent-animate` violet) carries meaningfully more of the surface — full-bleed color bands, bigger colored shapes, a colored section background or two — not just corner accents.

### Typography

Go bigger and more editorial than the current `text-6xl md:text-8xl` hero, closer to the oversized-display-type treatment both reference sites are known for. Concretely:
- Hero headline scales up further (`clamp()`-driven, aiming for something that nearly fills the viewport width on desktop, not just a large-but-contained heading).
- Section headings get more type-scale contrast against body copy (impeccable's ≥1.25 ratio is a floor, not a target — lean toward 1.5–2× between a section's heading and its body text on this route specifically, since Cabinet Grotesk is the display font already licensed for exactly this).
- Copy tone: per danielsun.space's conversational register, loosen `/animate`'s copy from the current straightforward-marketing tone to something with more personality — short, direct, a little wry. (Keep the "no em dash" rule from impeccable; use periods/commas for the same effect.)

### Layout

- Replace the current uniform `section` → `max-w-Nxl mx-auto` → centered-content pattern (repeated almost identically down the page right now) with more asymmetric, full-bleed moments — matching both the original spec's own §6 guidance ("asymmetric, full-bleed moments... not a centered-stack template") and the editorial-scroll feel of the reference sites. Not every section needs the same container width or the same center-aligned text block.
- Vary vertical rhythm between sections more aggressively than the current flat `.section` padding everywhere — some transitions should feel tight (a playful aside, like the relocated playground toys), others should feel spacious (the hero, the featured-work band).
- Keep the one deliberate dark band (Featured Work, `bg-band-dark`) from the original spec — but consider a second, different-toned band elsewhere (e.g. a full violet-tinted band behind Testimonials or the Resources teaser) now that the color strategy is Committed rather than Restrained. Don't let every section default back to the plain `bg-base` surface.

### Motion

Apply emil-design-eng's full framework, not just the easing tokens already in use:
- Scroll-triggered stagger reveals (30–80ms between items) on every section that presents a list/grid (Featured Work cards, Resources teaser cards) — GSAP ScrollTrigger + stagger, consistent with how the rest of the site already does scroll reveals.
- Keep custom cubic-bezier tokens (`--ease-out`, `--ease-in-out`, `--ease-drawer`) as the baseline for anything that isn't the playground's spring interactions.
- Section-to-section transitions (especially into/out of the dark band(s)) should feel considered, not an abrupt color cut — a short cross-fade or the existing GSAP `scrollTrigger` pattern already used for headings, extended to the section wrapper itself.
- Continue respecting `prefers-reduced-motion` everywhere per the original spec's §7 rules (unchanged).

### What doesn't change

- The information architecture / route structure (§11 of the original spec: Hero → [scattered playground toys] → Capabilities → Featured Work → Testimonials → Resources teaser → Hire CTA → Footer) stays the same *order*, just restyled and with the playground toys distributed into it per §3b instead of being their own section.
- `/animate/projects`, `/animate/projects/[slug]`, `/animate/resources`, `/animate/resources/[slug]` are not explicitly in scope for this pass (not mentioned in the feedback) — but since they use the shared `ProjectCard`/page shell, some of this visual language (bigger type, less uniform card grid) may be worth extending there too once the home page direction is confirmed. Flagged as a likely follow-up, not committed scope here.

## 5. Dependency changes

- Add: `lottie-react` (hero placeholder animation, §2).
- Add: `motion` (scoped to `components/Animate/Playground/*` only, §3a).
- No removals.

## 6. Open questions for the user (resolve before/at start of implementation)

1. **Lottie asset**: no placeholder Lottie file exists yet. Options: (a) source one from LottieFiles' free-license library (pick one that reads as "abstract motion/creative," not tied to any specific brand), (b) commission/create a minimal custom one, (c) skip Lottie for v1 and fill the space with a simpler CSS/GSAP shape animation instead, avoiding a new dependency entirely. The plan below assumes (a) but should be confirmed first.
2. **Second dark/tinted band placement** (§4, Layout): Testimonials or Resources teaser — pick one, or neither if it ends up feeling like too much.
3. Confirm the reference-site direction in §4 still matches what's live on kova.me/danielsun.space today, since this spec's authors couldn't visually inspect them directly (see §0 caveat).
