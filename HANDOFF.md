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
- Plan 1 (Foundation): `docs/superpowers/plans/2026-07-13-design-system-foundation.md` — **currently executing**
- Plan 2 (Landing): `docs/superpowers/plans/2026-07-13-landing-page.md` — written, not started
- Plan 3 (`/build` redesign): `docs/superpowers/plans/2026-07-13-build-route-redesign.md` — written, not started
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

## Plan 1 is done — next up is Plan 2 (Landing Page)

**Plan 2 is the first plan that changes what the site looks like** — it turns `/` into the new landing page and relocates the current homepage to `/build`. Until Plan 2 runs, `npm run dev` looks identical to the live site today (Plan 1 was deliberately invisible infrastructure).

Pick up Plan 2 with the subagent-driven-development skill, same pattern as Plan 1: dispatch an implementer per task using the exact task text from `docs/superpowers/plans/2026-07-13-landing-page.md`, then a spec-compliance reviewer, then a code-quality reviewer per task, then a final whole-implementation review before moving to Plan 3.

## A few things learned the hard way this session, worth knowing before continuing

- **Interactive browser verification isn't reliably available to subagents** (no screenshot/browser tool). For any plan step that says "open devtools and check X," either do it yourself directly (e.g. inspect compiled CSS/JS output in `.next/` instead of visually confirming in a browser — this worked well for verifying fonts loaded correctly) or accept code-review-level verification instead. Don't expect a dispatched subagent to actually open a browser.
- **`npm run dev` backgrounded via the Bash tool detaches** — the tool reports "completed" immediately even though the real `node` process keeps running and holding the port. If a task needs to start a dev server, find and kill the real process by port afterward (e.g. `Get-NetTCPConnection -LocalPort 3000` on Windows), don't trust the background-task completion signal to mean the server stopped.
- All work happens in this worktree, not the main `my_portfolio` checkout — double check `pwd` / the terminal's cwd before running `npm run dev` to preview anything, or you'll see the unmodified original site and think nothing happened.
