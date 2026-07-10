# Dual-Identity Portfolio Redesign — Design Spec

**Date**: 2026-07-10
**Status**: Approved by user, pending written-spec review
**Author**: Design session (Claude, brainstorming + impeccable + emil-design-eng skills)

## 1. Summary

Okata Miracle is now both a frontend developer and a motion designer. The current portfolio (Next.js, dark-purple, GSAP-driven, single dev-focused site) gets rebuilt as a single site with three areas:

1. A **landing page** that briefly introduces Okata and lets a visitor choose a route.
2. **`/build`** — the redesigned dev portfolio (existing content, new shell).
3. **`/animate`** — a brand-new motion design portfolio, including a public resources hub.

Goals, in the user's words: fun, simplistic, interactive, convertible, and better SEO than today.

## 2. Users & Jobs to Be Done

- **Recruiters / hiring managers / potential clients** land on `/` from a shared link, quickly understand Okata does both dev and motion work, and self-select the route relevant to them within seconds.
- **Developers/clients evaluating frontend work** go to `/build`, assess technical + design skill via existing project case studies, and contact/hire.
- **Motion clients and the wider design community** go to `/animate`, assess reel/case-study quality, optionally grab free resources, and either subscribe (audience-first) or reach out to hire (secondary).

## 3. Non-Goals (explicitly out of scope for this pass)

- Booking-calendar integration (Cal.com/Calendly) for a "Book a call" CTA — flagged as a future P2 enhancement, not core scope.
- A CMS for resources or projects — v1 uses local TypeScript data files, matching the existing codebase pattern.
- Email-gating downloads — resources are free and instant; a separate, low-pressure newsletter signup exists alongside them.
- Full dark-mode theme parity across both routes — the merged identity is light-first; retaining the existing `ThemeToggle` as a dark-mode option is a stretch goal, not required for launch.
- i18n / multi-language support.
- Deep redesign of `/build/blog` — kept, reskinned to new tokens, but not a focus area.

## 4. Information Architecture

```
/                           Landing — mode select
/build                      Dev home (redesigned current homepage)
/build/projects             All dev projects
/build/projects/[projectID] Dev case study
/build/blog                 Technical writing (existing route, kept dev-side, light reskin only)

/animate                    Motion home
/animate/projects           Motion project/reel grid
/animate/projects/[slug]    Motion case study (video embed + breakdown)
/animate/resources          Resources hub (downloads + tutorials + tool links)
/animate/resources/[slug]   Individual resource page

Shared: contact (modal, launched from either route with context-aware copy),
custom 404, sitemap.xml, robots.txt
```

Both `/build` and `/animate` carry a small persistent affordance (real `<a>` links, not JS-only) back to `/` and across to the other route, so nothing is orphaned for crawlers and switching modes is always one click away.

## 5. Architecture Decision: Single Next.js App, Route Groups

Everything stays in this repo. App Router route groups: `app/(landing)/`, `app/(build)/build/...`, `app/(animate)/animate/...`, each with its own `layout.tsx` (nav, footer, theme). Shared design tokens (CSS variables, fonts) live at the root layout so both routes read as one brand while each owns its own shell, per the "fully distinct shells" decision.

**Rejected alternative**: separate repos/apps per route. Doubles hosting/CI/dependency maintenance for a solo portfolio, splits SEO authority across properties, and buys nothing the route-groups approach doesn't already give in terms of creative independence.

## 6. Visual Identity

**Strategy**: shared neutral base (so the whole site reads as one person), two route-owned accent colors (so each route is instantly identifiable, and the accent itself becomes a wayfinding device). Reference point: Raycast's black-and-white product chrome with a single loud accent, stretched into two accents that each own a route.

**Theme**: light-first. Scene test: a hiring manager or fellow designer opens the link from a Slack/LinkedIn message on a laptop, during a workday, skimming fast, deciding in under ten seconds whether to keep looking. That scene doesn't call for a moody dark room — it calls for fast, scannable, confident daylight design. Dark mode remains available as a stretch-goal toggle, not the primary experience.

### Design tokens

| Token | Value (illustrative OKLCH) | Use |
|---|---|---|
| `--ink` | oklch(21% 0.015 55) | body text — warm near-black, never pure `#000` |
| `--base` | oklch(97% 0.01 55) | page background — warm off-white, never pure `#fff` |
| `--base-raised` | oklch(99% 0.006 55) | card surfaces |
| `--accent-build` | oklch(64% 0.19 45) | amber/orange — Build route accent |
| `--accent-animate` | oklch(58% 0.24 300) | electric violet — Animate route accent |
| `--band-dark` | oklch(16% 0.02 300) | the one deliberate dark band behind featured motion reels |

Reduce chroma as lightness approaches 0/100. All neutrals tinted toward the site's warm hue (never desaturated gray).

### Typography

Font selection followed the reflex-reject procedure — none of the following are used: Fraunces, Newsreader, Lora, Crimson*, Playfair Display, Cormorant*, Syne, IBM Plex*, Space Mono, Space Grotesk, Inter, DM Sans/Serif*, Outfit, Plus Jakarta Sans, Instrument Sans/Serif.

- **Display/headline**: Cabinet Grotesk (700/800) — bold, chunky geometric grotesk, reads equally well as "technical" (Build) and "playful" (Animate).
- **Body/UI**: General Sans (400–600) — same foundry as Cabinet Grotesk, designed to pair.
- **Mono accent**: JetBrains Mono (500) — `/build` only, for code-flavored micro-labels/tags. Not used on `/animate`: mono is earned by the dev route's actual technicality, and would read as costume on the motion route.

Modular scale, ratio 1.333, fluid `clamp()` from mobile to desktop, ≥1.25 contrast between adjacent steps. Both fonts self-hosted as variable fonts via `next/font/local`, `font-display: swap`.

### Layout & components

- Bento-grid card system for the landing page's "fun stuff" strip and capability strips — varied card sizes, never an identical repeated grid.
- Asymmetric, full-bleed moments for route hero sections and case studies — not a centered-stack template.
- Spacing: 4px base unit, varied rhythm (96–160px vertical section padding on desktop, 12–16px tight internal card gaps).
- Radius: chunky and consistent — 16–24px on cards, full-pill on buttons/nav — matching the "tactile control panel" feel the interactive playground implies.
- Shadows: soft, ink-tinted, low-opacity. No glassmorphism as a default, no side-stripe borders, no gradient text (per impeccable's absolute bans).
- One shared **project-card component**, same shape language, used across `/build` home preview, `/build/projects`, `/animate` home preview, and `/animate/projects` — themed per route's accent so the codebase and the visual language both stay consistent without the two routes looking identical.

## 7. Motion System

Motion tokens (per emil-design-eng's easing/duration framework):

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* entrances, button press */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* on-screen movement */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* modal/drawer */
```

| Element | Duration | Easing |
|---|---|---|
| Button press feedback | 120–160ms, `scale(0.97)` | ease-out |
| Tooltips/dropdowns | 150–250ms | ease-out |
| Modals (contact) | 250–350ms | ease-drawer |
| Route-choice cards (landing) | ~250ms | ease-out — the single highest-value click on the site earns the most expressive hover |
| Playground toys | spring, `{ duration: 0.5, bounce: 0.2–0.3 }` | spring (interruptible, feels alive) |
| Experience card-deck scroll | scroll-driven | ease-in-out (on-screen movement) |
| Shape drift / hero background loops | several seconds, looping | linear or ease-in-out |

Rules carried from emil-design-eng: never animate keyboard-triggered actions; never `ease-in` on UI; only animate `transform`/`opacity`; use CSS transitions (not keyframes) for anything rapidly retriggerable; popovers scale from their trigger, modals stay centered; stagger reveals 30–80ms apart.

`prefers-reduced-motion: reduce` disables shape drift, cursor-follow, parallax, and the scroll-hijacked experience card deck (falls back to a normal stacked scroll); opacity/color transitions are kept.

**Clarification on "dummy buttons"**: dummy means *no backend/business logic*, not *non-functional*. Every playground toy performs a real, satisfying, accessible micro-interaction — a toggle actually toggles, a slider actually slides and shows a value, a button actually triggers a visible shape morph. A control that visibly does nothing when activated (including via keyboard) is a broken-UI pattern, not a fun one, and fails accessibility expectations. Each toy gets an accurate accessible label (e.g. "Demo toggle — for fun, no data is saved").

## 8. Animation Tech Stack

- **Keep** GSAP + ScrollTrigger (already proven on the experience card-deck interaction).
- **Remove** `aos` + `@types/aos` — redundant with what ScrollTrigger already covers.
- **Add** `lenis` for smooth momentum scrolling (standard pairing with GSAP ScrollTrigger).
- **Use** GSAP's Draggable, InertiaPlugin, and SplitText for the playground toys and kinetic type — these are bundled inside the `gsap` package already (GSAP's formerly-paid Club plugins were made free in 2024), so no new dependency is needed, only new import paths.
- Shape morphing done in SVG + CSS/GSAP, not WebGL — keeps the "simplistic" brief intact and avoids the performance/complexity cost of Three.js for v1. A 3D hero is a plausible future enhancement, not part of this scope.

**Rejected alternative**: Framer Motion/Motion library replacing GSAP — would mean maintaining two animation paradigms for no real gain over extending what already works.

## 9. Landing Page (`/`)

Job: introduce Okata briefly, then convert the visitor into picking a route. Nothing else competes with that goal.

1. **Minimal header** — name mark, theme toggle, a quiet contact icon. No full site nav.
2. **Hero intro** — name, one-line dual-identity statement, 1–2 sentence bio, "open to work" status pill (existing pattern, reskinned).
3. **"Fun stuff" bento strip** — 3–4 cards maximum (e.g. "currently building," "currently editing," a socials/links card, one personality card). Deliberately capped low — a teaser, not a personality dump.
4. **Route choice** — two large, tactile cards, "Build" and "Animate," each in its own accent color with a one-line description of what's behind it. Press feedback `scale(0.97)`; hover previews the destination's motion language (subtle shape morph on Animate, subtle code-line shimmer on Build).
5. **Footer** — email, socials, resume link, copyright. Light, not a full sitemap footer.

No hire/contact CTA competes for primary attention here; contact remains one quiet click away. Real, crawlable text content (not just animated visual cards) is present so the page has indexable substance for SEO.

## 10. `/build` — Dev Route

Content is unchanged from today (per the "keep content, redesign shell" decision); only the shell, components, and tokens are redesigned.

- **Nav**: the existing compact floating icon-pill pattern, reskinned in the amber accent.
- **Home**: Hero → About → Stack (existing interactive button UX, kept and reskinned) → Experience (existing GSAP card-deck horizontal-scroll interaction, kept, still data-driven from `data/experience.ts`) → Home projects preview (3–4 featured, "view all") → Testimonials (existing card-deck component, reskinned) → Contact (existing modal + nodemailer backend, revamped visually; a "Book a call" calendar CTA is a nice-to-have P2, not core scope).
- **`/build/projects`**: all projects via the shared project-card component.
- **`/build/projects/[projectID]`**: case study — hero image, description, tech tags, live link, next/prev project nav.
- **`/build/blog`**: kept for technical writing/SEO value, reskinned to tokens only.

## 11. `/animate` — Motion Route

New. Same nav mechanism and position as `/build` (predictable, so switching routes never disorients), themed in the violet accent, with more playful hover motion on nav items (a wiggle/morph rather than a plain color change).

**Home**:
1. **Hero** — oversized display headline, animated SVG shapes drifting/morphing in the background, spring-based cursor-follow flourish (decorative and purposeful: it demonstrates motion craft in the first few seconds).
2. **Interactive Playground** — labeled sandbox ("Just for fun — try these") with a handful of toys: magnetic button, spring toggle, draggable slider, shape-morph trigger. See §7 for the "dummy ≠ non-functional" rule.
3. **Capabilities strip** — services offered, varied bento sizing, not a repeated identical-card grid.
4. **Featured motion work** — video-forward showcase. This one section deliberately inverts to the dark `--band-dark` surface so reels have contrast to pop against; the rest of the page stays on the light base. This is the single sanctioned "art direction per section" departure, not a random theme flip.
5. **Testimonials** — same card-deck component, reskinned, seeded with placeholder entries until real motion client quotes exist (per the "not yet, spec for structure" decision on motion content).
6. **Resources teaser + newsletter signup** — 2–3 latest resources, "browse all" link, plus a low-pressure email signup. This is the route's primary conversion moment (audience-first, per your call).
7. **Quiet hire CTA** — "have a project in mind?" band, visually secondary to #6.

**`/animate/projects`**: reel/case-study grid, shared card component in the violet accent, hover-to-preview video thumbnails with a static poster fallback for performance and for users who can't hover (touch/keyboard).

**`/animate/projects/[slug]`**: case study — embedded reel (Vimeo/YouTube embed, click-to-load facade pattern rather than self-hosted video, for bandwidth/cost reasons), process breakdown, tools-used tags, next/prev nav.

**`/animate/resources`**: hub with type filters (Downloads / Tutorials / Tool links — the "mix of everything" answer). Sourced from a local data file, no CMS for v1. Downloads are free and instant (no email wall); a separate newsletter signup sits on the page for anyone who wants to opt in.

**`/animate/resources/[slug]`**: individual resource page (indexable — tutorials/breakdowns earn organic search traffic on their own), download button or article body depending on resource type.

## 12. Launch Content Strategy

Motion content is not ready yet (confirmed). Per the "everything at once, placeholders included" decision: the landing page and both routes launch together. `/animate`'s projects, testimonials, and resources launch with clearly-marked placeholder/dummy entries in the same data-file shape real content will later use, so swapping in real work later is a content-only change, not a rebuild.

## 13. SEO

- Per-route `generateMetadata` (unique title/description/OG image) for every static and dynamic page, including individual project and resource pages.
- JSON-LD: `Person` schema on the landing page (dual `jobTitle`, `sameAs` for socials, canonical `url`); `VideoObject`/`CreativeWork` on motion case studies; `Article` on resources and blog posts; `BreadcrumbList` on nested pages.
- `next-sitemap` extended to enumerate dynamic routes (projects, resources) from the data files at build time.
- Dynamic OG images (`@vercel/og`) per project/resource page.
- Real, crawlable text content on the landing page alongside the visual cards — a highly animated, card-driven page can otherwise be thin on indexable text.
- Cross-links between `/build` and `/animate` (see §4) double as internal-linking signal, distributing crawl authority instead of isolating either route.

## 14. Performance & Accessibility

- Route-based code splitting is automatic via the App Router. GSAP's Draggable/Inertia/SplitText load only inside the Animate playground component, not the global bundle.
- Video embeds use a click-to-load facade (poster image first) so case-study pages never pay the iframe cost until a visitor opts in.
- Route-choice cards and playground toys are real `button`/`a` elements with visible, accent-colored focus states — never `div onClick`.
- `prefers-reduced-motion` support as specified in §7.
- Variable fonts, `next/image` everywhere, `font-display: swap`.
- Target: Lighthouse performance/accessibility/SEO ≥ 90 on both routes and the landing page.

## 15. Data Model

- `data/motion-projects.ts` and `data/resources.ts` — new, same flat-array pattern as the existing `data/data.ts`.
- `data/experience.ts` — unchanged.
- `data/motion-testimonials.ts` — new, placeholder-seeded.
- Shared `Project` / `Resource` / `Testimonial` TypeScript types so the shared project-card and testimonial components stay generic across both routes.

## 16. Dependency Changes

- Remove: `aos`, `@types/aos`.
- Add: `lenis`.
- No new package for Draggable/Inertia/SplitText (bundled in `gsap`).
- Self-host Cabinet Grotesk, General Sans, JetBrains Mono via `next/font/local`.
- Evaluate at implementation time whether both `swiper` and `react-multi-carousel` are still needed once the shared project-card system exists — likely consolidates to one, but that's an implementation-time call, not a spec commitment.

## 17. Success Criteria

- A first-time visitor on `/` can state, within seconds, that Okata does both dev and motion work, and which route to pick for their need.
- `/build` and `/animate` are visually distinguishable at a glance (via accent color and motion language) while still reading as one coherent brand.
- The interactive playground and route-choice cards work correctly via mouse, touch, and keyboard, with no dead/silent controls.
- Lighthouse performance/accessibility/SEO ≥ 90 on landing, `/build`, and `/animate`.
- Both `/build` and `/animate` are indexed with unique, accurate metadata and structured data within normal crawl timelines post-launch.

## 18. Risks & Mitigations

- **Two routes double the design/build surface.** Mitigated by the shared token system and the shared project-card component — most of the system is shared; only accent color and a handful of route-specific modules diverge.
- **Heavy animation hurts performance.** Mitigated by lazy-loading GSAP plugins per-route, the video click-to-load facade, and `prefers-reduced-motion` support.
- **`/animate` launches with placeholder content.** Mitigated by placeholder entries living in the same data-file shape as real content, so replacing them later is a content edit, not a rebuild; placeholders are clearly labeled, not presented as real client work.
