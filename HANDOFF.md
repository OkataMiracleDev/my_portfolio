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
- Plan 3 (`/build` redesign): `docs/superpowers/plans/2026-07-13-build-route-redesign.md` — ✅ complete, reviewed clean
- Plan 4 (`/animate`): `docs/superpowers/plans/2026-07-13-animate-route.md` — written, not started — **currently next**

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

## Plan 3 progress (16 tasks total) — ✅ COMPLETE

Every task from `docs/superpowers/plans/2026-07-13-build-route-redesign.md` is implemented and committed (one commit per task, `a155475`..`ec8291b`). Every `/build/*` component is reskinned to the light-minimal design system; all GSAP animations, form logic, and content/copy are preserved byte-for-byte. The final whole-implementation review (independent re-check of every file against the pre-Plan-3 diff) came back clean — highlights:

- **Experience.tsx's scroll-hijack math (the highest-risk task) was diffed line-by-line against its pre-Plan-3 version and confirmed logically identical** — only classNames changed, plus the intentional fix of the dead `var(--color-bg-primary)` reference to a real `bg-base` background.
- `ProjectsCard.tsx` (bespoke) was fully retired in favor of the shared `ProjectCard` from Plan 1, in both `HomeProjects.tsx` and the `/build/projects` listing page — confirmed each passes the correct `href` shape for its own data source (`homeprojectsData.projectID` is already a full path; `projectsData.projectID` is a bare slug needing `/build/projects/` prefixed).
- `/build/projects/[projectID]` now has its own `generateMetadata` (previously had none, silently used the wrong generic title) — verified via a temporary local prod server that both projects render correct, distinct `<title>` tags.
- `globals.css`'s old dark-purple theme, `.card`/`.btn-*`/`.heading-*`/`.body*`/`.nav-icon`/`.hire-me-btn`/`.fade-in-up` were deleted — grepped for dangling references to removed classes and removed CSS custom properties (`--color-text-primary`, `--color-accent-bright`, etc.) across `app` and `components`: none found.
- `npm run build` and `npm run test` (13/13) both pass.

**Non-blocking note:** while testing locally, a Turbopack dev-mode error appeared once (`Can't resolve '@vercel/turbopack-next/internal/font/google/font'`), traced to Turbopack misdetecting the workspace root because of a stray `package-lock.json` in `C:\Users\okata\` (home directory) — visible in the build's own "Detected additional lockfiles" warning. It resolved itself/didn't recur, but if it comes back, the fix is setting `turbopack.root` explicitly in `next.config.ts` rather than relying on auto-detection.

## Plan 3 is done — next up is Plan 4 (`/animate` route)

This is the final plan in the sequence — it builds a whole new `/animate` route (motion-design portfolio) sharing the design system but with its own accent color, nav, and motion language, per the spec. It's the plan that finally makes the landing page's "Animate" route-choice card resolve instead of 404ing.

Pick up Plan 4 with the subagent-driven-development skill, same pattern as Plans 1-3: dispatch an implementer per task using the exact task text from `docs/superpowers/plans/2026-07-13-animate-route.md`, then a spec-compliance reviewer, then a code-quality reviewer per task, then a final whole-implementation review. This is the last plan — once it's reviewed clean, the whole 4-phase redesign is complete.

## A few things learned the hard way this session, worth knowing before continuing

- **Interactive browser verification isn't reliably available to subagents** (no screenshot/browser tool). For any plan step that says "open devtools and check X," either do it yourself directly (e.g. inspect compiled CSS/JS output in `.next/` instead of visually confirming in a browser — this worked well for verifying fonts loaded correctly) or accept code-review-level verification instead. Don't expect a dispatched subagent to actually open a browser.
- **`npm run dev` backgrounded via the Bash tool detaches** — the tool reports "completed" immediately even though the real `node` process keeps running and holding the port. If a task needs to start a dev server, find and kill the real process by port afterward (e.g. `Get-NetTCPConnection -LocalPort 3000` on Windows), don't trust the background-task completion signal to mean the server stopped.
- All work happens in this worktree, not the main `my_portfolio` checkout — double check `pwd` / the terminal's cwd before running `npm run dev` to preview anything, or you'll see the unmodified original site and think nothing happened.
