# `/animate` v2 Redesign — Design Spec

**Date**: 2026-07-17 (rewritten same day after user supplied real screenshots of both reference sites)
**Status**: Draft, pending user review (produced for cross-device handoff — not yet approved or implemented)
**Author**: Design session (Claude, impeccable + emil-design-eng skills; supersedes/amends parts of `2026-07-10-portfolio-redesign-design.md` §6, §7, §11)
**Supersedes**: `docs/superpowers/specs/2026-07-10-portfolio-redesign-design.md` §7 (motion), §11 (`/animate` home structure) where noted below. Everything else in the original spec still stands. Also fully replaces this document's own first draft — the earlier version was written from a text-only `WebFetch` of both reference sites, which returned almost nothing (both are JS-rendered SPAs). The user then supplied real screenshots; §1 below is the actual visual analysis, and every decision after it is grounded in that, not general familiarity with the aesthetic family.

## 0. Why this spec exists

Plan 4 shipped `/animate` per the original spec, reviewed clean, all tests passing. Live user feedback on the shipped result raised four issues:

1. Nav text is illegible on both `/build` and `/animate` under real browser conditions.
2. The hero's off-content side is dead space.
3. The interactive playground reads as stiff/mechanical, and bundling all four toys into one boxed grid section undercuts the "found in the wild" feeling wanted.
4. The whole `/animate` route should take a bigger swing, stylistically — closer to kova.me and danielsun.space than to the current reskinned-card layout.

This document specs that second pass. It's written so implementation can resume on a different device without re-deriving context.

---

## 1. Reference site analysis (from user-supplied screenshots)

### danielsun.space

- **Nav**: a floating dark pill (`bg-near-black`, fully opaque, pill-radius), persistent top-center across scroll. Contents: a sun/theme-toggle icon, then text links (`Work`, `Story`, `Process`, `Connect` — current section underlined), then a **gold/yellow filled pill CTA** ("Start project") visually separated from the plain-text links.
- **Hero**: warm off-white background with a **diagonal gold gradient light-beam** sweeping across it (like a spotlight cutting the page corner to corner). Small gray intro line ("Howdy! Meet your trusted design partner, crafting strong brands for SaaS and Web3.") sits above a **massive, heavy-weight black display headline** ("DANIEL SUN") in tight all-caps that nearly spans the full viewport width — the single biggest type moment on the page by a wide margin.
- **Work section**: project cards are **not a uniform grid**. They're scattered at different sizes and vertical offsets, each **tilted a few degrees** and **white-bordered like a Polaroid**, sitting directly on the page background (no shared container/card chrome around the whole section). Some previews are flat images (an app-icon-style logo on a dark card), others are **framed inside a device bezel** (a dark laptop/tablet frame around a real website screenshot). Captions under each project use a **handwritten/cursive font** for the small aside line ("backed in OO Design team"), contrasting with the sans-serif title/tag line above it.
- **Story section**: two-column — a plain gray rounded panel of **first-person, conversational body copy** ("Growing up in Ukraine... art and graffiti sparked my visual storytelling passion... =)") on the left, and a **cluster of tilted Polaroid photos with hand-drawn doodle accents** (a sketched airplane, a sketched camera-with-sparkle) scattered between them on the right — literal scrapbook/photo-album styling.
- **Overall palette**: warm off-white base, near-black text/nav, one gold/yellow accent used for both the light-beam hero background and the primary CTA pill — a single accent color doing double duty as both a background effect and the CTA color, not spread thin across many small UI details.

### kova.me

- **Header** (not just a nav — a full persistent header bar): site owner's name top-left (small caps). Top-right: **live location + live clock** ("NORTH PORT, FL · 11:46 AM EST") next to a "RESUME" download link with an icon — both in a small monospace font. Center: a floating **white** pill nav (`WORK ABOUT CONTACT`) with the owner's **profile photo visibly peeking out from behind/within the pill** — the nav isn't a flat rectangle, something (the photo) intentionally breaks its silhouette.
- Around the nav sit a few **organic, blob/pebble-shaped white containers** (not circles, not rounded-rects — irregular asymmetric blobs) each holding a single social icon (a "brick" icon, Dribbble, LinkedIn), scattered loosely rather than in a row.
- A small black pill button reads **"SOME EYE CANDY"** — a playful, explicitly-labeled toggle for something extra/hidden. This is a distinct, callable-out easter-egg entry point, not a hidden gesture the visitor has to stumble on.
- **Hero headline** uses **mixed typography within one line**: most of the phrase in a bold geometric sans, then the last word or two in a **large italic script/cursive font** — "Our paths *just crossed*", and later "My cup of *tea*", "Bragging *rights.*" — this exact mixed-font accent (bold sans + italic script on the emotional/punchline word) repeats as a signature device on every major headline across the whole site, not a one-off.
- Small caption/label text throughout (subtitle under the hero headline, "COMPANIES I WORKED WITH", the location/clock) is set in a **monospace font** — a consistent small-caps-or-mono treatment for anything that reads as metadata rather than headline or body copy.
- **Companies-worked-with strip**: a horizontal row of logos in bordered cells with thin vertical dividers; most logos are muted/grayscale, but **one cell (Discord) has a solid black background**, visually promoted above the others rather than every logo getting identical treatment.
- **Project showcase**: three cards in a row, but each uses a **different presentation frame per project** — one is a loose dashboard/UI collage, one is a phone-frame mockup of a real estate app, one is a browser-chrome frame around a social app screenshot. No shared card template; the frame matches what best shows off that specific project.
- **Dark band section** ("Bragging rights."): full-bleed near-black background, same mixed bold-sans/italic-script headline treatment, and a **stat/credentials grid**: label in small caps above, big number below, thin horizontal divider rules separating each label/value pair ("EDUCATION — SRQ Design School", "DESIGN EXPERIENCE — 20 yrs", "RUNNING A TEAM — 10 yrs", "COMPANIES HELPED — 100+"). Below that, a **timeline** of past roles, each with a year and a small white card holding that employer's logo.
- Later in the same dark section: **custom flat-illustration character art** (a friendly, informal cartoon of the site owner at a desk, handing over a "contract") sits beside body copy, plus **pill-shaped skill tags** ("Social Media", "Brand", "Product", "Client Manager", "Print").
- **Overall palette**: light hero → dark "Bragging rights" band → (presumably back to light after) — a real alternation, not one isolated dark section. White/near-black base with sparse color; the illustration art is the only saturated color moment on these screenshots.

### What both sites share, and what's just one site's idea

Shared across both (safe to treat as "this genre of site basically requires it"):
- A floating pill nav that survives scroll, small in the viewport, never a full-width bar.
- Oversized, heavy-weight display type for the name/hero headline — bigger than anything else on the page, by a lot.
- Scattered/asymmetric project presentation instead of a uniform grid of identical cards.
- At least one full-bleed dark band breaking up an otherwise light page.
- A single clear, callable CTA pill, visually distinct from plain nav links.

Distinct to one site (pick deliberately, don't cargo-cult both at once):
- Daniel Sun's move: hand-drawn doodle accents + tilted Polaroid photo treatment + cursive captions (a **scrapbook/personal-diary** register).
- Kova's move: mixed bold-sans/italic-script headline typography as a repeated signature + live clock/location + mono metadata labels + an explicit "eye candy" easter-egg toggle + per-project custom device frames (a **playful-but-precise, slightly technical** register).

**Decision for this redesign**: lean toward Kova's register — mixed-typography headlines, mono metadata labels, an explicit easter-egg toggle, per-project custom frames — because it maps more naturally onto a motion *and code-adjacent* practice (Okata is a developer as well as a motion designer; Kova's "builder" framing and slightly technical feel fits that dual identity better than Daniel Sun's pure-illustration scrapbook register). Borrow two specific moves from Daniel Sun regardless: the gold/color light-beam hero background technique (adapted to violet, `--accent-animate`) and the tilted-Polaroid asymmetric project layout (which pairs well with Kova's per-project custom frames — tilt *and* vary the frame, don't just do one or the other).

---

## 2. Nav contrast fix (both `/build` and `/animate`)

**Root cause of the illegibility bug**: the nav pill's background (`bg-base-raised`, ~99% lightness) sits almost flush against the page background (`bg-base`, ~97% lightness), and some browsers' "force dark mode for web content" heuristics partially override even a `color-scheme: light` declaration for plain text specifically, washing out nav links while leaving strongly-saturated elements untouched — matching the reported screenshots exactly.

Kova's nav is light and evidently works in production — but it also has zero ambiguity: solid white, a real drop shadow, and the text living inside it is never relying on a barely-different-lightness neutral for contrast the way ours was. Daniel Sun's nav sidesteps the whole problem by being genuinely dark. Given the actual reported bug was about accidental near-invisibility, not a considered aesthetic choice, this spec keeps the safer fix: **make the nav genuinely dark**, matching Daniel Sun's approach, which also gives us a natural place to put the gold/yellow-equivalent (violet) CTA pill contrast Kova and Daniel Sun both rely on.

New token (add to `app/globals.css`'s `@theme` block, alongside `--color-band-dark`):

```css
--color-nav-dark: oklch(18% 0.02 55); /* warm near-black, tinted like --color-ink, not pure black */
```

Both `components/Home/Navbar/Nav.tsx` (`/build`) and `components/Animate/AnimateNav.tsx` (`/animate`) change their pill background from the current `bg-base-raised`/`bg-transparent` toggle to a **permanently dark** pill: `bg-nav-dark`, nav-link text in `text-base` (near-white). This also matches Kova's "resume link + metadata" idea (§4 below extends this further for `/animate` specifically) and removes a whole scroll-state (`navBg`/the scroll listener) that no longer needs to exist once the pill doesn't change appearance.

Accent buttons inside the nav (`/build`'s "Blog" button, `/animate`'s "Switch mode" button) keep their existing accent-colored pill treatment.

---

## 3. Hero: fill the dead space + adopt the light-beam + mixed-type headline

Two changes land together here since they touch the same component.

### 3a. Mixed-typography headline (Kova's signature move)

Currently: `Motion that means something.` in a single weight/style of Cabinet Grotesk. Change to a two-part headline where the emotional/punchline word(s) shift to italic, in the same Cabinet Grotesk family (it has an italic style available as a variable font axis — confirm at implementation time; if the self-hosted subset doesn't include an italic axis, this is the one place worth evaluating a single small script/display accent font rather than faking italics with CSS `font-style: oblique`, which looks cheap). Example: `Motion that means` in the existing bold weight, `something.` in italic — same treatment style as Kova's "Our paths *just crossed*." Apply this same bold+italic pattern to at least one other major `/animate` headline (Featured Work's section heading is the next-best candidate) so it reads as a repeated signature, not a one-off.

### 3b. Light-beam background (Daniel Sun's move, in our accent)

Add a diagonal gradient "light beam" sweep behind the hero content, using `--accent-animate` (violet) instead of Daniel Sun's gold — a large soft-edged diagonal gradient band, low opacity, sweeping from one corner. This replaces/supplements the existing two blurred decorative blobs (keep the blobs if they still add depth once the beam is in; drop them if the beam alone reads as enough).

### 3c. Status line becomes a "live" line (Kova's move)

Replace the current static `Motion Designer` status pill with a small monospace metadata line matching Kova's location+clock treatment: e.g. `Based remotely · [live local time] · Open to work`, using `font-[family-name:var(--font-jetbrains-mono)]` (already self-hosted, already used for small technical labels on `/build` — extending it to `/animate`'s metadata-only text is a deliberate, narrow exception to the original spec's "mono is `/build`-only" rule, justified because this is metadata, not a headline or body-copy device, matching exactly how Kova uses mono only for metadata too). The clock ticks client-side (`setInterval`, once a minute is enough) — a small, honest "there's a real person here" touch, not a Lottie-scale production.

### 3d. Fill the empty space: still a placeholder Lottie, or reconsider

The original ask ("that empty space in hero feels weird, maybe add a lottie file there") predates seeing that Daniel Sun's fix for the equivalent problem was the light-beam gradient treatment, not an added illustration. **Recommendation: try 3b first.** If the hero still feels empty once the headline is bigger (§3a scales it up too, see §5) and the light-beam is in, add a small placeholder Lottie in the remaining dead space — but don't reflexively add a whole new animation library if a background treatment plus bigger type already solves the actual complaint. Flagged as an open question, §8 Q1.

---

## 4. Playground: de-stiffen, and replace "scattered toys" with an explicit easter-egg toggle

The first draft of this spec (before screenshots) proposed scattering the four toys invisibly into different sections. Kova's actual solution to "I want playful hidden interactions without a boxed demo section" is better and more implementable: **one small, explicitly-labeled toggle button**, in the spirit of "SOME EYE CANDY", that reveals/activates the playful stuff — visitors who don't care never see a demo booth; visitors who click get the fun.

**Revised approach**:
- Add a small pill button near the hero, labeled something in Okata's own voice (not literally "SOME EYE CANDY" — that's Kova's line; ideas: "Poke around" / "Touch grass? No, touch this" / "A little something" — pick one that matches the site's own tone).
- Clicking it reveals the four toys, but **not as a grid** — they still land near-but-not-boxed-together in different sections per the original relocation idea (Hero corner, Capabilities strip, Featured Work band, Hire CTA/footer), just **hidden by default and revealed by the toggle** rather than always-visible. This keeps both the "not a demo booth" spirit and gives it the single clear entry point Kova's approach has.
- State: a simple `useState` in a small client component wrapping the toggle, lifted high enough (e.g. a context or the `/animate` page's top-level client boundary) that all four toy locations can read "revealed or not." Keep this simple — no need for anything heavier than React context for a boolean.

### Motion quality (unchanged from the first draft, still correct)

- **New, narrowly-scoped dependency**: `motion` (Framer Motion), imported **only** inside `components/Animate/Playground/*`. Does not reopen the "keep GSAP" decision — GSAP remains the backbone everywhere else.
- `PlaygroundMagneticButton`: `motion.button` + `useSpring`-interpolated x/y (stiffness ~150, damping ~15) instead of direct `style.transform` mutation.
- `PlaygroundToggle`: keep the `<button role="switch">` a11y contract; animate the thumb with `motion.span` + spring (`{ type: "spring", duration: 0.4, bounce: 0.35 }`).
- `PlaygroundShapeMorph`: spring the `rotate`/`borderRadius` change (`{ type: "spring", duration: 0.6, bounce: 0.25 }`).
- `PlaygroundSlider`: stays a native `<input type="range">`, no spring needed.
- Every toy keeps its existing `role`/`aria-*`/accessible-name contract and existing Vitest coverage untouched.
- The reveal/hide transition itself (toggle → toys appearing) should also use a spring or the site's `--ease-out` token, staggered 30–80ms per toy as each becomes visible (emil-design-eng's stagger guidance) — not all four popping in simultaneously.

---

## 5. Typography scale-up

Directly evidenced by both references: the hero name/headline is dramatically larger, relative to everything else on the page, than our current `text-6xl md:text-8xl`. Push it further — aim for something closer to Daniel Sun's "nearly fills the viewport width" treatment. Also adopt the monospace-for-metadata pattern (§3c) consistently anywhere `/animate` shows a label rather than a headline or body sentence (section eyebrows, stat labels in §6, tag chips).

---

## 6. Layout: scattered project presentation, credentials block, company strip

### 6a. Featured Work → scattered, per-project framing

Replace the current uniform 3-column `ProjectCard` grid in `FeaturedWork.tsx` with a Daniel-Sun-style scattered layout: each project card at a different size/vertical offset, tilted a few degrees (`rotate-2`/`-rotate-3`, alternating), white/light-bordered. Combine with Kova's per-project custom framing: since all three current motion projects are placeholders (no real screenshots yet), frame each with a different device chrome (one in a plain rounded card like Daniel Sun's app-icon treatment, one in a laptop-bezel frame, one in a phone-frame) so the *pattern* is in place even before real assets exist — swapping in real reels later is then a content change, not a layout change. This is a bigger structural change to `FeaturedWork.tsx` than the original v1 plan anticipated; treat it as its own task.

### 6b. Credentials/stat block (new, adapted from Kova's "Bragging rights")

Add a small stats section — mono labels, big numbers, thin horizontal divider rules between rows, living inside (or immediately after) the existing dark band (`bg-band-dark`) so it inherits the "one deliberate dark moment" rule from the original spec rather than adding a second dark section by accident. Placeholder-honest numbers only (e.g. "Years in motion", "Projects shipped", "Tools mastered") — mark these as placeholder in a code comment exactly like every other placeholder number/asset on this route, per the original spec's §12 rule.

### 6c. Company/client logo strip — explicitly deferred

Kova's muted-logos-with-one-highlighted strip is a nice pattern, but there are no real motion clients to list yet (all current content is placeholder). Building this now would mean inventing fake client names, which violates the placeholder-honesty rule harder than a labeled "coming soon" ever would. **Skip for this pass.** Revisit once real client work exists.

---

## 7. Motion pass — stagger reveals and section transitions

Unchanged from the first draft:
- GSAP ScrollTrigger stagger reveals (30–80ms between items) on Featured Work's (now-scattered) cards and Resources teaser's list.
- Keep the custom cubic-bezier tokens as baseline for anything outside the playground's springs.
- Smooth transitions into/out of dark band(s) rather than an abrupt color cut.
- Continue respecting `prefers-reduced-motion` everywhere.

---

## 8. Open questions for the user

1. **Hero dead-space fix**: does the light-beam + bigger type (§3) resolve the "empty space" complaint on its own, or is a placeholder Lottie still wanted in addition? (Original spec draft assumed Lottie by default; this rewrite recommends trying without it first.)
2. **Headline italic treatment**: confirm Cabinet Grotesk's self-hosted subset actually includes an italic axis before committing to §3a/§5 — if not, decide whether to add a second, small italic/script accent font (would need to pass the same reflex-reject font procedure as the original spec's font choices) or fake it with `font-style: oblique` (lower quality, but zero new assets).
3. **Easter-egg toggle copy**: pick the actual button label for §4 (options suggested, none chosen yet).
4. **Credentials block numbers** (§6b): need real placeholder-appropriate figures from the user (or explicit permission to invent clearly-fictional placeholder numbers, consistent with how the rest of `/animate`'s placeholder content is already handled).

---

## 9. Dependency changes

- Add: `motion` (scoped to `components/Animate/Playground/*` only).
- Add (conditional on §8 Q1): `lottie-react`, only if the light-beam + type-scale fix doesn't resolve the dead-space complaint on its own.
- No removals.
