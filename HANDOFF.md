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

## Plan 1 progress (7 tasks total)

| Task | Status |
|---|---|
| 1. Remove AOS | ✅ Done, reviewed (spec + quality), commit `5ba1072` |
| 2. Vitest harness + `usePrefersReducedMotion` hook | ✅ Done, reviewed, commit `2095baf` |
| 3. Design tokens | ✅ Done, reviewed, commit `d7ff2dd` |
| 4. Self-hosted fonts | ✅ Done, reviewed, commit `0f09058` |
| 5. Lenis smooth scroll | ✅ Done, spec review passed. **Code-quality review was in flight when this session stopped — its result was never seen.** Re-run it before trusting Task 5 is fully closed out (see below). Commit `aff48dd`. |
| 6. Shared content types (`types/content.ts`) | ⬜ Not started |
| 7. Shared `ProjectCard` component | ⬜ Not started |
| Final Plan 1 code review (whole implementation) | ⬜ Not started |

**One open item flagged mid-review and not yet resolved:** the Task 5 code-quality reviewer was specifically asked to check whether Lenis needs explicit wiring to GSAP ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` or similar) for the Experience section's pinned scroll-hijack (`components/Home/Experience/Experience.tsx`) to stay in sync once Lenis is live. **This was never answered.** Check this before or during Plan 3 Task 9 (Experience redesign) — if Lenis and ScrollTrigger don't talk to each other, the pinned card-deck scroll may visually desync from the smoothed scroll position. This might already need a small addition to `components/SmoothScroll.tsx` (calling `ScrollTrigger.update` on Lenis's scroll event) — investigate first, don't assume.

## After Plan 1 finishes

Tasks 6 and 7 are small (a types file, one tested component) — pick up with the subagent-driven-development skill: dispatch an implementer per task using the exact task text from the plan doc, then a spec-compliance reviewer, then a code-quality reviewer, same pattern as Tasks 1-5 above. Then a final whole-implementation code review per the plan's own process, then move to Plan 2.

**Plan 2 is the first plan that changes what the site looks like** — it turns `/` into the new landing page and relocates the current homepage to `/build`. Until Plan 2 runs, `npm run dev` will look identical to the live site today (Plan 1 is deliberately invisible infrastructure) — that's expected, not a bug.

## A few things learned the hard way this session, worth knowing before continuing

- **Interactive browser verification isn't reliably available to subagents** (no screenshot/browser tool). For any plan step that says "open devtools and check X," either do it yourself directly (e.g. inspect compiled CSS/JS output in `.next/` instead of visually confirming in a browser — this worked well for verifying fonts loaded correctly) or accept code-review-level verification instead. Don't expect a dispatched subagent to actually open a browser.
- **`npm run dev` backgrounded via the Bash tool detaches** — the tool reports "completed" immediately even though the real `node` process keeps running and holding the port. If a task needs to start a dev server, find and kill the real process by port afterward (e.g. `Get-NetTCPConnection -LocalPort 3000` on Windows), don't trust the background-task completion signal to mean the server stopped.
- All work happens in this worktree, not the main `my_portfolio` checkout — double check `pwd` / the terminal's cwd before running `npm run dev` to preview anything, or you'll see the unmodified original site and think nothing happened.
