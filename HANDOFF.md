# Portfolio Redesign — Handoff

Where this stands and exactly how to pick it back up, on this machine or another.

## Branch

`worktree-portfolio-redesign-foundation`, pushed to `origin`. On another device:

```bash
git fetch origin
git checkout worktree-portfolio-redesign-foundation
npm install
```

(This worktree lives at `.claude/worktrees/portfolio-redesign-foundation` off the main `my_portfolio` checkout on this machine — on another device you don't need the worktree layout, a plain `git checkout` of the branch is enough.)

## Documents

- Spec: `docs/superpowers/specs/2026-07-10-portfolio-redesign-design.md`
- Plan 1 (Foundation): `docs/superpowers/plans/2026-07-13-design-system-foundation.md` — ✅ complete, reviewed clean
- Plan 2 (Landing): `docs/superpowers/plans/2026-07-13-landing-page.md` — ✅ complete, reviewed clean
- Plan 3 (`/build` redesign): `docs/superpowers/plans/2026-07-13-build-route-redesign.md` — written, not started — **currently next**
- Plan 4 (`/animate`): `docs/superpowers/plans/2026-07-13-animate-route.md` — written, not started

## Plan 1 progress (7 tasks total) — ✅ COMPLETE

| Task | Status |
|---|---|
| 1. Remove AOS | ✅ Done, reviewed (spec + quality), commit `5ba1072` |
| 2. Vitest harness + `usePrefersReducedMotion` hook | ✅ Done, reviewed, commit `2095baf` |
| 3. Design tokens | ✅ Done, reviewed, commit `d7ff2dd` |
| 4. Self-hosted fonts | ✅ Done, reviewed, commit `0f09058` |
| 5. Lenis smooth scroll | ✅ Done, commit `aff48dd`. Lenis↔ScrollTrigger wiring gap (below) fixed in commit `8e87c0e`. |
| 6. Shared content types (`types/content.ts`) | ✅ Done, commit `4ce37cb` |
| 7. Shared `ProjectCard` component | ✅ Done (TDD, 6/6 tests), commit `f9846f4` |
| Final Plan 1 code review (whole implementation) | ✅ Done — clean, no blocking issues. Definition of Done fully satisfied. |

**Resolved:** the open question from Task 5's review — whether Lenis needs explicit wiring to GSAP ScrollTrigger for the Experience section's pinned scroll-hijack to stay in sync — was answered yes. `components/SmoothScroll.tsx` (commit `8e87c0e`) now drives Lenis from `gsap.ticker` (with the correct seconds→ms conversion, verified by tracing both libraries' source) and calls `lenis.on('scroll', ScrollTrigger.update)`. Independently re-reviewed and confirmed correct.

**Non-blocking notes carried into Plan 2+:**
- Pre-existing `html { scroll-behavior: smooth }` in `globals.css` can double-smooth with Lenis on anchor-hash navigation. Currently harmless (no `href="#..."` links exist yet) — revisit if Plan 2+ adds in-page anchor links.

## Plan 2 progress (4 tasks total) — ✅ COMPLETE

| Task | Status |
|---|---|
| 1. Relocate dev site to `/build` | ✅ Done — all internal links fixed, `git mv` preserved history, verified via build route list + repo-wide grep for stale `/projects`/`/blog` references (zero hits) |
| 2. Landing page content data (`data/landing.ts`) | ✅ Done |
| 3. `RouteChoiceCard` component | ✅ Done (TDD, 4/4 tests) |
| 4. Assemble the landing page | ✅ Done — `/` renders the new landing page, `/build` renders the untouched dev homepage |
| Final Plan 2 code review (whole implementation) | ✅ Done — clean, no issues. Definition of Done fully satisfied. |

`/animate` correctly 404s for now — that route doesn't ship until Plan 4. This is expected, not a bug.

## Plan 2 is done — next up is Plan 3 (`/build` route redesign)

This is the first plan that actually redesigns the dev portfolio's own look (the user's own notes on what this should cover are in `redesign.md` at the repo root of this worktree — alignment/spacing pass, ProjectsSlider restyle, card format consistency across the site, projects + project-detail page redesign, nav redesign keeping the same links, MyStack section restyle keeping the existing button UX, a GSAP horizontal card-deck treatment for Work Experience pulling from a data file, keeping the testimonial card-deck animation but restyling the section, and a Contact section + "Hire me" modal revamp).

**Important open item carried from Plan 1, to resolve during this plan:** Plan 3's Experience section task is exactly where the Lenis↔ScrollTrigger wiring (fixed in Plan 1, commit `8e87c0e`) gets its real test — verify the redesigned card-deck scroll-hijack still feels in sync with smoothed scroll once the section is rebuilt.

Pick up Plan 3 with the subagent-driven-development skill, same pattern as Plans 1-2: dispatch an implementer per task using the exact task text from `docs/superpowers/plans/2026-07-13-build-route-redesign.md`, then a spec-compliance reviewer, then a code-quality reviewer per task, then a final whole-implementation review before moving to Plan 4.

## A few things learned the hard way this session, worth knowing before continuing

- **Interactive browser verification isn't reliably available to subagents** (no screenshot/browser tool). For any plan step that says "open devtools and check X," either do it yourself directly (e.g. inspect compiled CSS/JS output in `.next/` instead of visually confirming in a browser — this worked well for verifying fonts loaded correctly) or accept code-review-level verification instead. Don't expect a dispatched subagent to actually open a browser.
- **`npm run dev` backgrounded via the Bash tool detaches** — the tool reports "completed" immediately even though the real `node` process keeps running and holding the port. If a task needs to start a dev server, find and kill the real process by port afterward (e.g. `Get-NetTCPConnection -LocalPort 3000` on Windows), don't trust the background-task completion signal to mean the server stopped.
- All work happens in this worktree, not the main `my_portfolio` checkout — double check `pwd` / the terminal's cwd before running `npm run dev` to preview anything, or you'll see the unmodified original site and think nothing happened.
