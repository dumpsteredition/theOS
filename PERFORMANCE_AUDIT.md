# BrumbleyOS Performance Audit

## Scope

Audited the current BrumbleyOS Next.js app for performance, rendering stability, asset usage, CSS/animation cost, production risks, and accessibility/performance overlap.

Read/reviewed:

- `BrumbleyOS.MD`
- `BrumbleyOS_Design_Language.md`
- `package.json`
- `next.config.ts`
- `app/layout.tsx`
- `app/page.tsx`
- shared shell components
- homepage component
- profile page/component
- inbox page/component
- system logs pages/components
- available work-related component/data references
- global CSS
- public image/assets usage
- inbox capture API routes

Note: `.env.example`, `app/layout.tsx`, and part of `components/sections/inbox-view.tsx` had local edits before this audit began. This pass preserved those existing changes.

## Audit Findings

| Area | Risk | Files / Components | Finding | Recommended Fix |
| --- | --- | --- | --- | --- |
| Bundle / dependencies | Medium | `package.json`, client components | Dependency set is compact. `framer-motion` is the largest runtime dependency and is imported across homepage, shell, profile, inbox, feedback, command palette, and other interactive surfaces. | Keep `framer-motion` because it is central to the approved design, but avoid adding more animation libraries. Consider dynamic imports only for rarely opened overlays later. |
| Bundle / dependencies | Low | `node_modules`, `package-lock.json` | `npm ls --depth=0` reports several extraneous packages in `node_modules`. They are not listed as direct app dependencies. | Clean install in CI/deploy environments. Avoid editing lockfile unless intentionally refreshing dependencies. |
| Client rendering | Medium | `WorkspaceShell`, `TopBar`, `SidebarNav`, `AppFooter`, `DashboardHomeRedesign` | The global shell is client-rendered because nav state, localStorage, command palette, route transitions, and footer interactions live there. | Accept for current design. Future optimization could split static shell chrome from interactive islands. |
| Client rendering | Medium | `components/sections/dashboard-home-redesign.tsx` | Homepage is visually rich and client-heavy: chart state, many motion elements, SVG illustrations, hover previews, and repeated reduced-motion hooks. | Preserve approved design. Future pass could memoize chart point/path construction or split heavy submodules if bundle metrics justify it. |
| Timers / effects | Medium | `components/sections/inbox-view.tsx` | Inbox schedules ambient messages and smart replies. It cleared timers on unmount, but completed reply timeout IDs stayed in the registry during long sessions. | Prune timeout IDs after they fire. Keep Inbox simulation behavior intact. |
| Timers / effects | Low | `components/ui/toast.tsx` | Toast timeouts were cleared when dismissed, but provider unmount had no cleanup path. | Add provider unmount cleanup. |
| Timers / effects | Low | `components/ui/command-palette.tsx`, `components/shell/app-footer.tsx`, `components/sections/profile-editor-view.tsx` | Several focus restoration/open-feedback timeouts were scheduled without cleanup if the component unmounted immediately after. | Track and clear focus-related timeouts. |
| Rendering / derived data | Low | `components/sections/logs-view.tsx` | Search results, category counts, and filtered entries recomputed on each render. Current data is small, but the fix is straightforward. | Memoize derived log lists/counts. |
| Assets | Low | `public/images/*`, `next/image` usage | Public assets are small overall. `kyle-headshot.jpg` is the largest at about 321 KB. Current image usage checked uses `next/image`, explicit dimensions, `fill`, `sizes`, or `priority` where appropriate. | Consider converting the headshot to WebP/AVIF later if Lighthouse shows image transfer cost. |
| CSS / animation | Medium | `app/globals.css`, animated components | Most Framer Motion animations respect `useReducedMotion`, but generic CSS/Tailwind animations like `animate-ping`, `animate-pulse`, and loading pulses were not globally guarded. | Add project-level `prefers-reduced-motion` CSS guard. |
| CSS / paint cost | Medium | `app/globals.css`, shell/topbar/modal surfaces | The approved visual design uses backdrop blur, large shadows, radial gradients, and glow effects. These are intentional but can increase paint/compositing cost on low-power devices. | Preserve design. Keep future blur/shadow additions conservative and test mobile. |
| Next.js production | Low | `app/layout.tsx` | Metadata base is resolved server-side from site/Vercel env values with a fallback. No client secret exposure found. | Keep metadata env vars server-only. |
| API / secrets | Low | `app/api/inbox-contact/route.ts`, `app/api/inbox-message/route.ts`, `lib/inbox-capture.ts` | Capture routes validate payloads, enforce length limits, and use server-only env vars. No `NEXT_PUBLIC` secret usage found. | Keep webhook URLs and bearer tokens server-only. Consider rate limiting later if public traffic increases. |
| Route structure | Low | `app/logs/[slug]/page.tsx` | Log detail pages use `generateStaticParams` and `notFound()` for unknown slugs. | No immediate fix needed. |
| Work page | Low | `app`, `components/sections/work-project-card.tsx` | A standalone `app/work` route was not present in the current tree. Only work-related data/card references were available to inspect. | If Work returns, audit it with the same locked-design constraints. |
| Accessibility / performance | Medium | `components/sections/inbox-view.tsx` | Add-contact modal handles Escape and body scroll lock, but does not trap Tab focus. This is an a11y gap more than a performance issue. | Future focused a11y pass should add focus trap without visual changes. |
| Accessibility / performance | Low | `GrowthChart` | Wide SVG chart uses internal horizontal scroll to avoid page overflow. | Keep internal overflow. Verify on mobile after future chart changes. |

## Fixes Applied

- Added timeout registry pruning in `components/sections/inbox-view.tsx` so completed smart-reply/status timers do not accumulate during long Inbox sessions.
- Added unmount cleanup for toast dismissal timers in `components/ui/toast.tsx`.
- Added tracked cleanup for focus/open-feedback timeouts in `components/ui/command-palette.tsx`.
- Added tracked cleanup for Builder's Trace focus timeouts in `components/shell/app-footer.tsx`.
- Added tracked cleanup for Profile Review modal focus timeouts in `components/sections/profile-editor-view.tsx`.
- Memoized search matches, category counts, and filtered entries in `components/sections/logs-view.tsx`.
- Added a global `prefers-reduced-motion: reduce` guard in `app/globals.css` for CSS/Tailwind animations, transitions, and smooth scrolling.

## Checks Run

Baseline before safe fixes:

- `npm run lint` - passed
- `npm run typecheck` - passed

Post-fix:

- `npm run lint` - passed
- `npm run typecheck` - passed
- `npm run build` - first sandboxed attempt failed because `next/font` could not fetch Google Fonts with network restricted; rerun with approved network access passed.

## Remaining Risks

- `framer-motion` remains a meaningful client bundle/runtime cost, especially on the homepage and interactive overlays.
- The global app shell is client-rendered; deeper optimization would require architectural splitting that is outside the safe-fix scope.
- The homepage has many animated SVG/motion elements. They are design-approved and reduced-motion aware, but still paint-heavy.
- Blurs, backdrop filters, and large shadows are part of the locked visual language and should be budgeted carefully on future pages.
- Inbox add-contact modal should get a focus trap in a future accessibility pass.
- No Lighthouse or production bundle analyzer run was performed in this local pass.

## Future Optimization Ideas

- Add bundle analysis with `@next/bundle-analyzer` only with explicit approval, since it adds a dependency.
- Consider dynamic imports for rarely used overlays such as feedback, recovery terminal, and Builder's Trace after measuring impact.
- Consider converting `public/images/profile/kyle-headshot.jpg` to WebP/AVIF if image transfer shows up in Lighthouse.
- Memoize or precompute homepage chart paths if the homepage grows further.
- Add rate limiting or bot protection to public inbox capture routes if traffic increases.
- Add focused keyboard/focus-management tests for command palette, profile review, feedback, and Inbox add-contact modal.
